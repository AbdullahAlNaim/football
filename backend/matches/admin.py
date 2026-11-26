from django.contrib import admin
from .models import Match, Standing, Team


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ["name", "tla", "is_followed"]
    list_filter = ["is_followed"]
    search_fields = ["name"]


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ["__str__", "stage", "status", "home_score", "away_score"]
    list_filter = ["status", "stage"]


@admin.register(Standing)
class StandingAdmin(admin.ModelAdmin):
    list_display = ["position", "team", "points", "won", "draw", "lost"]
    list_filter = ["season"]