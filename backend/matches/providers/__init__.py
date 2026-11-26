from django.conf import settings

from .football_data import FootballDataProvider


def get_provider():
    return FootballDataProvider(token=settings.FOOTBALL_DATA_TOKEN)