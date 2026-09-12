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

Tag format after merging to `hyogo-master`: `hyogo_<fork-version>_<upstream-tag>` (e.g., `hyogo_v4.3.4_v4.3.5`). Since the v4.7.1 sync, the fork-version segment's minor tracks upstream's minor directly (e.g. `hyogo_v4.7.0_v4.7.1`), rather than drifting independently across multiple patch-level syncs within the same upstream minor line.

If the jump spans multiple upstream minor versions (as v4.5.8 → v4.7.1 did), expect the merge-base to land _before_ the currently-synced tag, not on it — Mastodon's `stable-X.Y` branches carry cherry-picked backports that aren't the same commit objects as their `main`-line equivalents, so `git merge-base` often resolves to an earlier common ancestor. This can turn what looks like a routine sync into one with 100+ conflicting files, including files the fork has never touched. When that happens: resolve pure-upstream conflicts (no fork stake) by taking the incoming tag's version wholesale rather than hand-splicing hunks, since the incoming version is usually a substantial rewrite rather than a small diff (e.g. a `res` object replacing manual string parsing). Then specifically grep every remaining conflicted file's current side for `area`/`hyogo` markers before resolving it — files with real fork logic won't always match this doc's shared-files table below, since files that merge cleanly in one sync can still carry fork-specific lines that only surface as conflicts in a later, bigger sync.

**Conflict resolution — always keep fork version (`--ours`):**

- `app/javascript/hyogo-areas.json`
- `app/javascript/area-timelines.json`
- `app/javascript/remote-instances.json`
- `app/models/area_feed.rb`
- `docker-compose.override.yml`
- Any controllers/routes for area timelines

**Accept upstream version (`--theirs`):**

- `docker-compose.yml`

**Shared files with fork-specific additions (require manual merge — do NOT blindly take `--theirs`):**

These files are primarily upstream but contain fork-specific lines that must be preserved after every merge:

| File                                                              | Fork-specific additions                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/build-releases.yml`                            | Image names `ghcr.io/pinfort/mastodon` and `ghcr.io/pinfort/mastodon-streaming`                                                                                                                                                                            |
| `app/javascript/mastodon/components/account_header/index.tsx`     | `AreaHeader` import and `<AreaHeader account={account} />` usage inside the avatar wrapper (was `features/account_timeline/components/account_header.tsx` before upstream split that file up in v4.7.0)                                                    |
| `app/javascript/mastodon/components/status/header.tsx`            | `AreaAvatar` import and conditional render in `StatusDisplayName` (gated on `!friendAccount && !isQuotedPost`); `isQuotedPost` threaded through `StatusHeaderProps` (was inline in `components/status.jsx` before upstream extracted the header in v4.7.0) |
| `app/javascript/mastodon/components/status.jsx`                   | Passes `isQuotedPost` into `<StatusHeader>` so `status/header.tsx` can gate the area badge                                                                                                                                                                 |
| `app/javascript/mastodon/features/ui/components/columns_area.tsx` | `AreaTimeline` import and `AREA` entry in `componentMap` (was `columns_area.jsx` before upstream converted it to TypeScript in v4.7.0)                                                                                                                     |
| `app/javascript/mastodon/features/navigation_panel/index.tsx`     | `PinDropIcon` import; `area` message; `isAreaActive` function; area `ColumnLink` in nav panel                                                                                                                                                              |
| `app/javascript/mastodon/features/ui/index.jsx`                   | `AreaTimeline`, `AreaTimelineRedirect` imports; `/areas` and `/timelines/area` routes                                                                                                                                                                      |
| `app/javascript/mastodon/actions/streaming.js`                    | `area` in the `bogusQuotePolicy` channel-name check; `connectAreaStream`, `fillAreaTimelineGaps` import                                                                                                                                                    |
| `app/javascript/mastodon/actions/timelines.js`                    | `expandAreaTimeline`, `fillAreaTimelineGaps` action creators                                                                                                                                                                                               |
| `app/javascript/mastodon/locales/en.json`                         | All `area.*`, `column.area*`, `dismissable_banner.area_timeline`, `empty_column.area`, `tabs_bar.area_timeline` keys                                                                                                                                       |
| `app/javascript/mastodon/locales/ja.json`                         | Same area keys in Japanese; `navigation_bar.area_timeline`                                                                                                                                                                                                 |
| `app/models/account.rb`                                           | `area` column comment; `validates :area` line                                                                                                                                                                                                              |
| `app/serializers/rest/account_serializer.rb`                      | `:area` in the `attributes` list                                                                                                                                                                                                                           |
| `app/services/fan_out_on_write_service.rb`                        | Per-area `redis.publish("timeline:area:#{area_name}", ...)` loop in `broadcast_to_public_streams!`                                                                                                                                                         |
| `app/views/settings/profiles/show.html.haml`                      | Whole legacy simple_form profile-edit page is kept (fork did not adopt upstream's v4.7 redesign-notice + `/profile/edit` SPA flow, since the `area` picker lives only in this form)                                                                        |
| `config/locales/simple_form.en.yml`                               | `area:` hint and label entries                                                                                                                                                                                                                             |
| `config/routes/web_app.rb`                                        | `/areas` and `/areas/(*any)` in the React-app path list                                                                                                                                                                                                    |
| `db/schema.rb`                                                    | `area` column on the `accounts` table (kept in sync with the `account.rb` annotation whenever migrations are run)                                                                                                                                          |
| `streaming/index.js`                                              | `'area'` in channel list; `/api/v1/streaming/area` case; `area` channel resolution and params                                                                                                                                                              |

Note: this table was audited and substantially expanded during the v4.5.8 → v4.7.1 sync (2026-09-11) — a plain `git merge` conflict scan surfaced several fork touchpoints (`status/header.tsx`, `actions/streaming.js`, `actions/timelines.js`, `account_serializer.rb`, `fan_out_on_write_service.rb`, `profiles/show.html.haml`, `routes/web_app.rb`) that earlier versions of this table missed because they'd merged cleanly without conflicts in past syncs. Treat this table as a best-effort snapshot, not a guarantee — after any future sync, prefer re-running a scan like `git grep -n "area\|hyogo" <conflicted-files>` over trusting this table blindly.

**Post-merge verification — run these checks after every upstream merge:**

```bash
# Verify fork-specific patterns still exist in shared files
grep -r "AreaTimeline\|AreaAvatar\|AreaHeader\|AreaFeed\|area_feed" app/javascript app/controllers app/models --include="*.rb" --include="*.tsx" --include="*.jsx" --include="*.ts" -l

# Check locale files contain area keys
grep "area_timeline\|column\.area\|empty_column\.area" app/javascript/mastodon/locales/en.json

# Check streaming server has area channel
grep "area" streaming/index.js

# Check build workflow uses fork image names
grep "pinfort/mastodon" .github/workflows/build-releases.yml
```

If any of these return no results, the fork-specific lines were lost in the merge and must be restored before committing.

## Important Notes

- **ActivityPub Federation:** Changes to `Account` or `Status` models may need corresponding updates to ActivityPub serializers and delivery workers.
- **Database Migrations:** Always follow `StrongMigrations` guidelines. The gem will raise errors for unsafe migrations.
- **I18n:** New user-facing strings need translation keys. Run `yarn i18n:extract` to update locale files. Use `i18n-tasks normalize` before committing.
- **Streaming Server:** Changes to real-time features require updates to both Rails and Node.js streaming code.
- **Breaking API Changes:** This fork maintains compatibility with upstream Mastodon. Avoid breaking changes to standard API endpoints.
