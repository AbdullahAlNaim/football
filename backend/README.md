# Matchday: backend

Django REST Framework API for Matchday. See the [main README](../README.md) for the full project overview and setup.

## Quick reference

```bash
python manage.py runserver        # API at http://localhost:8000/api/v1/
python manage.py sync_fixtures    # pull the season's schedule + table (2 API calls)
python manage.py sync_results     # update finished matches (usually 0 API calls)
```

Configuration comes from `../.env` (see `../.env.example`).

## How the `matches` app is organised

| File | Job |
| --- | --- |
| `models.py` | `Team`, `Match`, `Standing` |
| `providers/` | The only code that calls football-data.org; turns JSON into dataclasses |
| `services.py` | Writes to the database (idempotent upserts by `provider_id`) |
| `selectors.py` | Reads from the database (date-range queries, last-5 form) |
| `serializers.py` / `views.py` / `urls.py` | The REST API |
| `management/commands/` | `sync_fixtures`, `sync_results` |
