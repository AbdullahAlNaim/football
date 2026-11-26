from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.health, name="health"),
    path("matches/", views.match_list, name="match-list"),
    path("standings/", views.standing_list, name="standing-list"),
    path("teams/", views.team_list, name="team-list"),
]