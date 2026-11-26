from django.conf import settings
from django.core.management.base import BaseCommand

from matches.providers import get_provider
from matches.services import save_matches, save_standings


class Command(BaseCommand):
    help = "Pull the full Champions League schedule and table for a season (2 API calls)."

    def add_arguments(self, parser):
        parser.add_argument("--season", type=int, default=settings.CURRENT_SEASON)

    def handle(self, *args, **options):
        season = options["season"]
        provider = get_provider()

        match_count = save_matches(provider.get_matches(season))
        self.stdout.write(f"Saved {match_count} matches for {season}.")

        standing_count = save_standings(season, provider.get_standings(season))
        self.stdout.write(self.style.SUCCESS(f"Saved {standing_count} table rows."))