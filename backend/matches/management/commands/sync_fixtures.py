import time

import requests
from django.conf import settings
from django.core.management.base import BaseCommand

from matches.providers import get_provider
from matches.services import save_matches, save_standings


# Free tier allows 10 calls/minute; each season is 2 calls, so pause between seasons.
SECONDS_BETWEEN_SEASONS = 13


class Command(BaseCommand):
    help = "Pull the full Champions League schedule and table for a season (2 API calls per season)."

    def add_arguments(self, parser):
        parser.add_argument("--season", type=int, default=settings.CURRENT_SEASON)
        parser.add_argument(
            "--all",
            action="store_true",
            help="Sync every season from FIRST_SEASON to CURRENT_SEASON.",
        )

    def handle(self, *args, **options):
        provider = get_provider()

        if options["all"]:
            seasons = list(range(settings.FIRST_SEASON, settings.CURRENT_SEASON + 1))
        else:
            seasons = [options["season"]]

        for i, season in enumerate(seasons):
            if i > 0:
                time.sleep(SECONDS_BETWEEN_SEASONS)
            try:
                self._sync_season(provider, season)
            except requests.HTTPError as error:
                # e.g. a season the free tier doesn't cover: report it and carry on.
                self.stderr.write(self.style.WARNING(f"Skipped {season}: {error}"))

    def _sync_season(self, provider, season: int):
        match_count = save_matches(provider.get_matches(season))
        self.stdout.write(f"Saved {match_count} matches for {season}.")

        standing_count = save_standings(season, provider.get_standings(season))
        self.stdout.write(self.style.SUCCESS(f"Saved {standing_count} table rows for {season}."))