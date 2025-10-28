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
- Area configuration is defined in `app/javascript/area_settings.json`
- Area feed logic is implemented in `app/models/area_feed.rb`

## Development Commands

### Initial Setup
```bash
bin/setup
# Installs Ruby gems, JS dependencies via yarn, and prepares the database
```

### Running the Development Server
```bash
bin/dev
# Starts all services via overmind/foreman:
# - Rails web server (port 3000)
# - Sidekiq background workers
# - Node.js streaming server (port 4000)
# - Webpack dev server
```

Individual services from `Procfile.dev`:
```bash
bundle exec puma -C config/puma.rb              # Web server
bundle exec sidekiq                              # Background jobs
yarn workspace @mastodon/streaming start         # Streaming API
bin/webpack-dev-server                           # Frontend assets
```

### Testing

**Ruby tests (RSpec):**
```bash
bin/rspec                           # Run all specs
bin/rspec spec/models              # Run specific directory
bin/rspec spec/models/account_spec.rb:42  # Run specific line
bin/flatware                        # Parallel test execution
```

**JavaScript tests (Jest):**
```bash
yarn test                           # Run all Jest tests
yarn jest path/to/test.js          # Run specific test file
```

### Linting & Formatting

**Run all linters:**
```bash
yarn lint                           # JS/TS (eslint) + CSS (stylelint)
bundle exec rubocop                 # Ruby linting
bundle exec haml-lint               # HAML template linting
yarn typecheck                      # TypeScript type checking
```

**Auto-fix issues:**
```bash
yarn fix                            # Fix JS and CSS issues
bundle exec rubocop -a              # Auto-correct Ruby issues
yarn format                         # Run Prettier on all files
```

**Lint-staged (pre-commit):**
The project uses `lint-staged` with Husky. On commit, it automatically runs:
- Prettier on all files
- Rubocop on Ruby files
- ESLint on JS/TS files
- Stylelint on CSS/SCSS files
- HAML-lint on HAML files
- TypeScript type checking

### Database

```bash
bin/rails db:migrate               # Run pending migrations
bin/rails db:rollback              # Rollback last migration
bin/rails db:seed                  # Seed database
bin/rails db:prepare               # Create/migrate/seed as needed
```

### CLI Tool (tootctl)

Mastodon provides a powerful CLI tool for administration:
```bash
bin/tootctl accounts modify USERNAME --role admin    # Make user admin
bin/tootctl accounts delete USERNAME                 # Delete account
bin/tootctl media remove                             # Remove remote media
bin/tootctl search deploy                            # Deploy search index
bin/tootctl maintenance                              # Maintenance commands
bin/tootctl feeds build                              # Rebuild home feeds
```

Available command categories: `accounts`, `cache`, `canonical_email_blocks`, `domains`, `email_domain_blocks`, `emoji`, `federation`, `feeds`, `ip_blocks`, `maintenance`, `media`, `preview_cards`, `search`, `settings`, `statuses`, `upgrade`

### Building for Production

```bash
RAILS_ENV=production NODE_ENV=production bin/webpack  # Build frontend assets
RAILS_ENV=production bundle exec rails assets:precompile  # Precompile assets
```

## Architecture Overview

### Backend (Ruby on Rails)

**Tech Stack:**
- Rails 7.1 with Ruby 3.1+
- PostgreSQL 12+ (primary database)
- Redis 4+ (caching, Sidekiq queues, streaming)
- Sidekiq for background job processing

**Key Directory Structure:**

- `app/models/` - ActiveRecord models representing core entities (Account, Status, User, etc.)
- `app/controllers/` - Request handlers
  - `app/controllers/api/v1/`, `api/v2/` - REST API endpoints
  - `app/controllers/activitypub/` - ActivityPub protocol implementation
  - Standard Rails controllers for web views
- `app/services/` - Business logic layer (e.g., `PostStatusService`, `FollowService`, `FanOutOnWriteService`)
- `app/workers/` - Sidekiq background jobs (e.g., `ActivityPub::DeliveryWorker`, `FeedInsertWorker`)
- `app/serializers/` - ActiveModel serializers for API responses
- `app/policies/` - Pundit authorization policies
- `app/validators/` - Custom ActiveModel validators
- `app/lib/` - Shared utilities and libraries
- `app/chewy/` - Chewy/Elasticsearch index definitions
- `lib/mastodon/cli/` - tootctl CLI command implementations

**Service Pattern:**
Mastodon uses service objects for complex operations. Services inherit from `BaseService` and encapsulate business logic. Example: `app/services/post_status_service.rb` handles status creation with all side effects (mentions, hashtags, federation).

**Background Jobs:**
Sidekiq workers handle asynchronous tasks:
- ActivityPub message delivery to remote servers
- Feed fanout (distributing posts to follower timelines)
- Media processing
- Email notifications
- Scheduled post publishing

**Database & Caching:**
- PostgreSQL stores all persistent data
- Redis handles caching, Sidekiq queues, and real-time data for streaming
- Uses `Scenic` for database views
- Uses `strong_migrations` for safe schema changes

### Frontend (React + Redux)

**Tech Stack:**
- React 18 with Redux Toolkit
- TypeScript for type safety
- Webpack 4 for bundling
- Sass for styling

**Key Directory Structure:**

- `app/javascript/mastodon/` - Main React application
  - `actions/` - Redux action creators
  - `reducers/` - Redux state reducers (uses Immutable.js)
  - `components/` - Presentational React components
  - `features/` - Feature-specific container components and logic
  - `locales/` - i18n translations (JSON)
  - `api.js` - Axios-based API client
- `app/javascript/styles/` - Sass stylesheets
- `app/javascript/entrypoints/` - Webpack entry points

**State Management:**
Redux with Immutable.js for state trees. Uses `redux-immutable` and React-Redux for connecting components to state.

**Routing:**
Uses React Router v5 for client-side routing within the SPA.

### Streaming API (Node.js)

**Location:** `streaming/`

Separate Node.js server providing real-time WebSocket/EventStream connections:
- Handles timeline streaming (home, public, hashtag, list)
- Uses Redis pub/sub for message distribution
- Implements authentication via Rails-generated tokens
- Runs independently from Rails (can scale separately)

### API Architecture

**REST API:**
- `/api/v1/` - Main API version with endpoints for statuses, accounts, timelines, etc.
- `/api/v2/` - Newer API version with improved endpoints (search, notifications)
- Uses Doorkeeper for OAuth2 authentication
- JSON responses serialized via ActiveModel Serializers

**ActivityPub:**
- Implements W3C ActivityPub protocol for federation
- Controllers in `app/controllers/activitypub/`
- JSON-LD format with context normalization
- Inbox/Outbox pattern for message delivery

### Key Architectural Patterns

1. **Service Objects:** Complex business logic isolated in service classes
2. **Background Processing:** Sidekiq workers for async operations and federation
3. **Policy Objects:** Pundit policies for authorization
4. **Presenters:** Presentation logic separated from models
5. **Feed Architecture:** Redis-backed timeline caching with fanout-on-write pattern
6. **Chewy Indexes:** Elasticsearch integration for advanced search

### Testing

**Ruby:**
- RSpec for unit and integration tests
- Fabrication for test data factories (not FactoryBot)
- Webmock for HTTP stubbing
- Capybara + Selenium for system tests

**JavaScript:**
- Jest for unit tests
- React Testing Library for component tests
- Located in `app/javascript/**/__tests__/`

### Fork-Specific: Area Timeline Implementation

The area timeline feature allows filtering public timelines by:
1. Geographic areas within Hyogo prefecture
2. Groups of federated instances (Kansai region servers, specific communities)

**Implementation:**
- `AreaFeed` class extends `PublicFeed` with domain filtering
- Area/instance configuration in `app/javascript/area_settings.json`
- Routes defined with `/areas/(*any)` pattern
- Uses `Status.posted_in_domains` scope for filtering

## Important Notes

- **ActivityPub Federation:** When making changes to models like `Account` or `Status`, consider federation implications. Changes may need corresponding updates to ActivityPub serializers and delivery workers.
- **Database Migrations:** Always use `StrongMigrations` guidelines. The gem will raise errors for unsafe migrations.
- **I18n:** New user-facing strings need translation keys. Run `yarn i18n:extract` to update locale files.
- **Normalization:** Use `i18n-tasks normalize` before committing locale changes.
- **Streaming Server:** Changes to real-time features require updates to both Rails and Node.js streaming code.
- **Breaking API Changes:** This fork maintains compatibility with upstream Mastodon. Avoid breaking changes to standard API endpoints.
