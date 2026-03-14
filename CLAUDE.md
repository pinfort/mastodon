# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About This Fork

This is a custom Mastodon fork maintained at https://github.com/pinfort/mastodon with additional "Area Timeline" features for Hyogo prefecture regions in Japan. The fork is regularly synced with upstream Mastodon from https://github.com/mastodon/mastodon.

**Branch Strategy:**

- `hyogo-master`: Main production branch for this fork
- `hyogo-develop`: Development branch for fork-specific features
- The fork merges upstream releases via tags (e.g., `v4.3.4`)

**Custom Features:**

- **Area Timelines**: Regional timelines based on Hyogo prefecture areas (Kobe, Hanshin, Tanba, Tajima, etc.) and federated instance groupings
- Area configuration is defined in separate JSON files:
  - `app/javascript/hyogo-areas.json` - Hyogo prefecture geographic area definitions
  - `app/javascript/area-timelines.json` - Timeline configurations mapping area/instance groups to timeline IDs
  - `app/javascript/remote-instances.json` - Remote federated instance metadata
- Area feed logic is implemented in `app/models/area_feed.rb`

## Development Commands

```bash
bin/setup        # Install gems, JS deps, prepare database
bin/dev          # Start all services (Rails :3000, Sidekiq, Streaming :4000, Webpack)
```

**Testing:**

```bash
bin/rspec        # Run all Ruby specs
yarn test        # Run all Jest tests
```

**Linting:**

```bash
yarn lint                  # ESLint + Stylelint
bundle exec rubocop        # Ruby linting
bundle exec haml-lint      # HAML linting
yarn typecheck             # TypeScript type checking
yarn fix                   # Auto-fix JS/CSS
bundle exec rubocop -a     # Auto-fix Ruby
```

**Database:**

```bash
bin/rails db:migrate       # Run pending migrations
bin/rails db:rollback      # Rollback last migration
```

## Docker

Dev containers are configured in `.devcontainer/`. Use `bin/setup && bin/dev` inside the container.

Fork-specific Docker config lives in `docker-compose.override.yml` (image tags like `ghcr.io/pinfort/mastodon:hyogo_*`). The base `docker-compose.yml` can accept upstream changes; always preserve the override file.

## Fork-Specific: Area Timeline Implementation

`AreaFeed` extends `PublicFeed` with domain filtering. Configuration:

- `app/javascript/hyogo-areas.json` — geographic area definitions (id, Japanese name, English slug)
- `app/javascript/area-timelines.json` — maps timeline slugs to `timeline_id` and `instances` lists (`null` = local instance)
- `app/javascript/remote-instances.json` — federated instance metadata
- `app/models/area_feed.rb` — feed logic using `Status.posted_in_domains` scope
- Routes use `/areas/(*any)` pattern

## Upstream Sync

Tag format after merging to `hyogo-master`: `hyogo_<fork-version>_<upstream-tag>` (e.g., `hyogo_v4.3.4_v4.3.5`)

**Conflict resolution — always keep fork version (`--ours`):**

- `app/javascript/hyogo-areas.json`
- `app/javascript/area-timelines.json`
- `app/javascript/remote-instances.json`
- `app/models/area_feed.rb`
- `docker-compose.override.yml`
- Any controllers/routes for area timelines

**Accept upstream version (`--theirs`):**

- `docker-compose.yml`

## Important Notes

- **ActivityPub Federation:** Changes to `Account` or `Status` models may need corresponding updates to ActivityPub serializers and delivery workers.
- **Database Migrations:** Always follow `StrongMigrations` guidelines. The gem will raise errors for unsafe migrations.
- **I18n:** New user-facing strings need translation keys. Run `yarn i18n:extract` to update locale files. Use `i18n-tasks normalize` before committing.
- **Streaming Server:** Changes to real-time features require updates to both Rails and Node.js streaming code.
- **Breaking API Changes:** This fork maintains compatibility with upstream Mastodon. Avoid breaking changes to standard API endpoints.
