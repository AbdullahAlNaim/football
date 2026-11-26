from django.db import models


class Team(models.Model):
    provider_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=100)          # "FC Barcelona"
    short_name = models.CharField(max_length=50)     # "Barça"
    tla = models.CharField(max_length=5)             # "FCB"
    crest_url = models.URLField(blank=True)
    is_followed = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Match(models.Model):
    class Status(models.TextChoices):
        SCHEDULED = "SCHEDULED"
        TIMED = "TIMED"
        IN_PLAY = "IN_PLAY"
        PAUSED = "PAUSED"
        FINISHED = "FINISHED"
        POSTPONED = "POSTPONED"
        SUSPENDED = "SUSPENDED"
        CANCELLED = "CANCELLED"

    provider_id = models.IntegerField(unique=True)
    competition = models.CharField(max_length=10, default="CL")
    season = models.IntegerField()                   # 2026 = the 2026/27 season
    stage = models.CharField(max_length=40)          # "LEAGUE_STAGE", "QUARTER_FINALS"
    matchday = models.IntegerField(null=True, blank=True)
    home_team = models.ForeignKey(Team, on_delete=models.PROTECT, related_name="home_matches")
    away_team = models.ForeignKey(Team, on_delete=models.PROTECT, related_name="away_matches")
    kickoff_utc = models.DateTimeField(db_index=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    home_score = models.IntegerField(null=True, blank=True)
    away_score = models.IntegerField(null=True, blank=True)
    last_synced_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["kickoff_utc"]

    def __str__(self):
        return f"{self.home_team.tla} v {self.away_team.tla} ({self.kickoff_utc:%Y-%m-%d})"


class Standing(models.Model):
    season = models.IntegerField()
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="standings")
    position = models.IntegerField()
    played = models.IntegerField()
    won = models.IntegerField()
    draw = models.IntegerField()
    lost = models.IntegerField()
    points = models.IntegerField()
    goals_for = models.IntegerField()
    goals_against = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["season", "position"]
        constraints = [
            models.UniqueConstraint(fields=["season", "team"], name="one_standing_per_team_per_season"),
        ]