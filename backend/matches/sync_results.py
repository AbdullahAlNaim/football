from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from matches.models import Match
from matches.providers import get_provider

MATCH_DONE_AFTER = timedelta(minutes=120)
DONE = ["FINISHED", "POSTPONED", "CANCELLED"]

class Command(BaseCommand):
    help = "Fetch final scores only for matches that should be over."

    def handle(self, *args, **options):
        cutoff = timezone.now() - MATCH_DONE_AFTER
        pending = Match.objects.filter(kickoff_utc__lte=cutoff).exclude(status__in=DONE)

        if not pending.exists():
            self.stdout.write("Nothing to update (0 API calls).")
            return

        provider = get_provider()
        match_days = {m.kickoff_utc.date() for m in pending}
        for day in match_days:  # one API call per match day
            for result in provider.get_matches_on(day):
                Match.objects.filter(provider_id=result.provider_id).update(
                    status=result.status,
                    home_score=result.home_score,
                    away_score=result.away_score,
                    last_synced_at=timezone.now(),
                )