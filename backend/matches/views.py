from django.db import connection
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from django.conf import settings
from django.utils.dateparse import parse_date
from rest_framework.exceptions import ValidationError

from .models import Standing, Team
from .selectors import matches_between, recent_form
from .serializers import MatchSerializer, StandingSerializer, TeamFollowSerializer, TeamSerializer


MAX_RANGE_DAYS = 62
FORM_LENGTH = 5
TABLE_STAGE = "LEAGUE_STAGE"

@api_view(["GET"])
def health(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        db_ok = True
    except Exception:
        db_ok = False

    return Response(
        {
            "status": "ok" if db_ok else "degraded",
            "database": db_ok,
            "time": timezone.now(),
        },
        status=200 if db_ok else 503,
    )


@api_view(["GET"])
def match_list(request):
    start = parse_date(request.query_params.get("from", ""))
    end = parse_date(request.query_params.get("to", ""))
    if not start or not end:
        raise ValidationError("Both 'from' and 'to' are required, as YYYY-MM-DD.")
    if end < start:
        raise ValidationError("'to' must be on or after 'from'.")
    if (end - start).days > MAX_RANGE_DAYS:
        raise ValidationError(f"Date range can't be longer than {MAX_RANGE_DAYS} days.")

    followed_only = request.query_params.get("followed") == "true"
    matches = matches_between(start, end, followed_only)
    return Response(MatchSerializer(matches, many=True).data)


@api_view(["GET"])
def standing_list(request):
    season = int(request.query_params.get("season", settings.CURRENT_SEASON))
    standings = Standing.objects.filter(season=season).select_related("team")
    serializer = StandingSerializer(
        standings, many=True, context={"form": recent_form(season, limit=FORM_LENGTH, stage=TABLE_STAGE)}
    )
    return Response(serializer.data)


@api_view(["GET"])
def team_list(request):
    teams = Team.objects.order_by("name")
    if request.query_params.get("followed") == "true":
        teams = teams.filter(is_followed=True)
    return Response(TeamSerializer(teams, many=True).data)


# Personal app for now: no login, so no session auth (and no CSRF check).
# TODO before deploying publicly: restrict this to you (e.g. IsAdminUser + CSRF token).
@api_view(["PATCH"])
@authentication_classes([])
def team_follow(request, pk):
    team = get_object_or_404(Team, pk=pk)
    serializer = TeamFollowSerializer(team, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(TeamSerializer(team).data)
