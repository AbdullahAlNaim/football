from rest_framework import serializers

from .models import Match, Standing, Team
from .selectors import result_for


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ["id", "name", "short_name", "tla", "crest_url", "is_followed"]


class TeamFollowSerializer(serializers.ModelSerializer):
    """Write side: the only field the app may change on a team."""

    class Meta:
        model = Team
        fields = ["is_followed"]


class MatchSerializer(serializers.ModelSerializer):
    home_team = TeamSerializer()
    away_team = TeamSerializer()

    class Meta:
        model = Match
        fields = [
            "id", "competition", "stage", "matchday", "kickoff_utc",
            "status", "home_score", "away_score", "home_team", "away_team",
        ]


class ClubMatchSerializer(MatchSerializer):
    """A match from one club's point of view: adds that club's result (W/D/L)."""

    result = serializers.SerializerMethodField()

    class Meta(MatchSerializer.Meta):
        fields = MatchSerializer.Meta.fields + ["result"]

    def get_result(self, obj):
        if obj.status != Match.Status.FINISHED:
            return None
        return result_for(obj, self.context["team_id"])


class StandingSerializer(serializers.ModelSerializer):
    team = TeamSerializer()
    form = serializers.SerializerMethodField()
    goal_difference = serializers.SerializerMethodField()

    class Meta:
        model = Standing
        fields = [
            "position", "team", "played", "won", "draw", "lost",
            "points", "goals_for", "goals_against", "goal_difference", "form",
        ]

    def get_goal_difference(self, obj):
        return obj.goals_for - obj.goals_against

    def get_form(self, obj):
        return self.context.get("form", {}).get(obj.team_id, [])