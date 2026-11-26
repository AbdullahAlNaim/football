from rest_framework import serializers

from .models import Match, Standing, Team


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ["id", "name", "short_name", "tla", "crest_url", "is_followed"]


class MatchSerializer(serializers.ModelSerializer):
    home_team = TeamSerializer()
    away_team = TeamSerializer()

    class Meta:
        model = Match
        fields = [
            "id", "competition", "stage", "matchday", "kickoff_utc",
            "status", "home_score", "away_score", "home_team", "away_team",
        ]


class StandingSerializer(serializers.ModelSerializer):
    team = TeamSerializer()
    form = serializers.SerializerMethodField()

    class Meta:
        model = Standing
        fields = [
            "position", "team", "played", "won", "draw", "lost",
            "points", "goals_for", "goals_against", "form",
        ]

    def get_form(self, obj):
        return self.context.get("form", {}).get(obj.team_id, [])