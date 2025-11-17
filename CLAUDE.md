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

## Docker Development Environment

This repository supports Docker-based development workflows for containerized environments.

### Prerequisites

- Docker 20.10+ and Docker Compose V2
- 4GB+ RAM allocated to Docker
- Basic familiarity with Docker concepts

### Option 1: Dev Containers (Recommended for VS Code)

The `.devcontainer/` directory provides a complete containerized development environment with all dependencies pre-configured.

**Using VS Code:**

1. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open the repository in VS Code
3. Press `F1` and select "Dev Containers: Reopen in Container"
4. Wait for the container to build and start (first time takes ~5-10 minutes)
5. Once ready, open the integrated terminal and run:

```bash
bin/setup     # Install dependencies and prepare database
bin/dev       # Start all services
```

**Manual Docker Compose setup:**

```bash
# Start services (PostgreSQL, Redis, Elasticsearch)
docker compose -f .devcontainer/compose.yaml up -d

# Set up the application (first time only)
docker compose -f .devcontainer/compose.yaml exec app bin/setup

# Start development server
docker compose -f .devcontainer/compose.yaml exec app bin/dev

# Stop services when done
docker compose -f .devcontainer/compose.yaml down
```

### Option 2: Production-Like Docker Compose

The `docker-compose.yml` in the root is designed for production deployment but can be adapted for local testing.

**Important:** This setup requires external PostgreSQL and Redis. Database and Redis services are commented out by default.

**Setup:**

1. Create environment configuration:

```bash
cp .env.production.sample .env.production
```

2. Edit `.env.production` and configure at minimum:

```env
LOCAL_DOMAIN=localhost:3000
REDIS_HOST=redis
REDIS_PORT=6379
DB_HOST=db
DB_USER=mastodon
DB_NAME=mastodon_production
DB_PASS=your_secure_password
DB_PORT=5432

# Generate with: bundle exec rails secret
SECRET_KEY_BASE=your_generated_secret

# Generate with: bundle exec rails secret
OTP_SECRET=your_generated_secret

# Generate with: bundle exec rails mastodon:webpush:generate_vapid_key
VAPID_PRIVATE_KEY=your_generated_key
VAPID_PUBLIC_KEY=your_generated_key
```

3. Uncomment the `db` and `redis` services in `docker-compose.yml` if using containerized database/redis

4. Build and start services:

```bash
docker compose build
docker compose up -d db redis  # Start dependencies first
docker compose run --rm web bundle exec rails db:setup
docker compose up -d
```

**Access the application:**

- Web interface: http://localhost:3000
- Streaming API: http://localhost:4000
- Elasticsearch (if enabled): http://localhost:9200

### Fork-Specific Docker Configuration

This fork uses Docker Compose's override file mechanism to manage fork-specific image tags:

- `docker-compose.yml` - Base configuration compatible with upstream Mastodon
- `docker-compose.override.yml` - Fork-specific image tags (e.g., `ghcr.io/pinfort/mastodon:hyogo_v4.3.4_v4.3.9`)

The override file is automatically applied when running `docker compose` commands. This separation prevents merge conflicts during upstream syncs, as the base `docker-compose.yml` can accept upstream changes while `docker-compose.override.yml` preserves fork customizations.

**When syncing with upstream:**

- Accept upstream changes to `docker-compose.yml`
- Always preserve `docker-compose.override.yml` with fork-specific image tags

### Docker Commands Reference

**Container management:**

```bash
docker compose ps                  # List running services
docker compose logs -f web         # Follow web server logs
docker compose logs -f sidekiq     # Follow background job logs
docker compose logs -f streaming   # Follow streaming API logs
docker compose restart web         # Restart web service
docker compose down                # Stop all services
docker compose down -v             # Stop and remove volumes (WARNING: deletes data)
```

**Executing commands inside containers:**

```bash
# Rails console
docker compose exec web bundle exec rails console

# Database console
docker compose exec web bundle exec rails dbconsole

# Run migrations
docker compose exec web bundle exec rails db:migrate

# Run RSpec tests
docker compose exec web bundle exec rspec

# Run tootctl commands
docker compose exec web bin/tootctl accounts create USERNAME --email user@example.com --confirmed --role Owner

# Access container shell
docker compose exec web bash
```

**Testing Database Migrations in Docker:**

When working with database migrations in the dev container environment, use these commands:

```bash
# Check migration status (shows which migrations are up/down)
docker compose -f .devcontainer/compose.yaml exec app bin/rails db:migrate:status

# Run pending migrations
docker compose -f .devcontainer/compose.yaml exec app bin/rails db:migrate

# Check current database schema version
docker compose -f .devcontainer/compose.yaml exec app bin/rails db:version

# Rollback last migration
docker compose -f .devcontainer/compose.yaml exec app bin/rails db:rollback

# Run database-related RSpec tests
docker compose -f .devcontainer/compose.yaml exec app bin/rspec spec/models
docker compose -f .devcontainer/compose.yaml exec app bin/rspec spec/db

# Reset database (WARNING: deletes all data)
docker compose -f .devcontainer/compose.yaml exec app bin/rails db:reset
```

For production-like Docker Compose setup, replace `.devcontainer/compose.yaml` with the default compose file and `app` with `web`:

```bash
docker compose exec web bin/rails db:migrate:status
docker compose exec web bin/rails db:migrate
```

**Rebuilding after code changes:**

```bash
# Rebuild and restart services
docker compose build
docker compose up -d

# Force rebuild without cache
docker compose build --no-cache
```

### Port Mappings

The default port mappings are:

| Service   | Container Port | Host Port      | Description                |
| --------- | -------------- | -------------- | -------------------------- |
| web       | 3000           | 127.0.0.1:3000 | Rails web server           |
| streaming | 4000           | 127.0.0.1:4000 | Node.js streaming          |
| es        | 9200           | 127.0.0.1:9200 | Elasticsearch (if enabled) |

Services are bound to `127.0.0.1` for security - only accessible from localhost.

### Docker-Specific Troubleshooting

**Container fails to start:**

```bash
# Check container logs
docker compose logs web

# Check health status
docker compose ps

# Restart problematic service
docker compose restart web
```

**"Port already in use" errors:**

```bash
# Find what's using the port
lsof -i :3000

# Use different ports by modifying docker-compose.yml
ports:
  - '127.0.0.1:3001:3000'  # Change 3001 to desired port
```

**Database connection errors:**

```bash
# Ensure database is running
docker compose ps db

# Check database logs
docker compose logs db

# Recreate database (WARNING: deletes data)
docker compose down -v
docker compose up -d db
docker compose exec web bundle exec rails db:setup
```

**Out of disk space:**

```bash
# Clean up unused Docker resources
docker system prune -a --volumes

# Remove old Mastodon images
docker images | grep mastodon
docker rmi <image-id>
```

**Asset changes not reflecting:**

```bash
# Rebuild with cleared webpack cache
docker compose exec web rm -rf public/packs
docker compose exec web yarn
docker compose restart web
```

### Development Workflow with Docker

1. **Make code changes** in your editor (files are mounted via volumes)
2. **Rails changes**: Restart web service: `docker compose restart web`
3. **Frontend changes**: Webpack dev server auto-reloads (if using `.devcontainer`)
4. **Database changes**: Run migrations: `docker compose exec web bundle exec rails db:migrate`
5. **Dependency changes**: Rebuild containers: `docker compose build && docker compose up -d`

### Network Architecture

Docker Compose creates two networks:

- `external_network`: For services that need internet access
- `internal_network`: Isolated network for database/redis (more secure)

This separation follows security best practices for production deployments.

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

## Upstream Sync Process

This fork regularly syncs with upstream Mastodon to incorporate bug fixes, security updates, and new features while preserving fork-specific customizations.

### Remote Configuration

Verify your git remotes are configured correctly:

```bash
git remote -v
# Should show:
# origin    https://github.com/pinfort/mastodon.git
# upstream  https://github.com/mastodon/mastodon.git
```

If `upstream` is not configured:

```bash
git remote add upstream https://github.com/mastodon/mastodon.git
```

### Sync Workflow

#### 1. Fetch Upstream Changes

```bash
# Fetch all upstream branches and tags
git fetch upstream

# Fetch tags specifically
git fetch upstream --tags

# View available upstream releases
git tag -l | grep -E "^v[0-9]" | tail -20
```

#### 2. Identify Target Version

Check the latest stable release:

```bash
# View upstream releases on GitHub
# https://github.com/mastodon/mastodon/releases

# Or check tags locally
git tag -l "v*" | sort -V | tail -10
```

This fork uses semantic versioning tags like `v4.3.4`. Target stable releases, not release candidates (`-rc`) or beta versions.

#### 3. Create Sync Branch

Always create a dedicated branch for upstream syncs:

```bash
# Start from hyogo-develop
git checkout hyogo-develop
git pull origin hyogo-develop

# Create sync branch (example: syncing v4.3.5)
git checkout -b sync-upstream-v4.3.5
```

#### 4. Merge Upstream Release

```bash
# Merge the specific upstream tag
git merge v4.3.5 --no-ff -m "Merge upstream v4.3.5"

# The --no-ff flag creates a merge commit for clear history
```

#### 5. Resolve Conflicts

Conflicts are common due to fork-specific changes. Focus on preserving custom features:

**Common Conflict Areas:**

- `app/javascript/area_settings.json` - Fork-specific, keep your version
- `app/models/area_feed.rb` - Fork-specific, keep your version
- Routes with `/areas/*` patterns - Preserve fork additions
- `docker-compose.yml` - Accept upstream version (fork-specific config is in docker-compose.override.yml)
- `docker-compose.override.yml` - Fork-specific image tags, keep your version
- Database migrations - May need careful ordering

**Conflict Resolution Strategy:**

```bash
# View conflicted files
git status

# For each conflict, choose the appropriate strategy:
# 1. Fork-specific files: Keep your version
git checkout --ours path/to/fork-specific-file

# 2. Upstream files: Accept upstream version
git checkout --theirs path/to/upstream-file

# 3. Mixed changes: Manually edit to merge both
nano path/to/file  # Manually resolve conflicts
```

**Critical Files to Preserve:**

- `app/javascript/area_settings.json` - Always keep fork version
- `app/models/area_feed.rb` - Fork-specific model
- `docker-compose.override.yml` - Fork-specific Docker image tags
- Controllers/routes for area timelines - Preserve fork logic
- Any files with "hyogo" or "area" in the name

After resolving each conflict:

```bash
git add path/to/resolved-file
```

Once all conflicts are resolved:

```bash
git merge --continue
```

#### 6. Update Dependencies

After merging, update Ruby and JavaScript dependencies:

```bash
# Update Ruby gems
bundle install

# Update JavaScript packages
yarn install

# Check for dependency vulnerabilities
bundle audit
yarn audit
```

#### 7. Run Database Migrations

Upstream releases often include new migrations:

```bash
# Check for pending migrations
bin/rails db:migrate:status

# Run migrations in development
bin/rails db:migrate

# Check migration output for errors or warnings
```

#### 8. Test Thoroughly

**Critical Testing Areas:**

```bash
# 1. Run Ruby test suite
bin/rspec

# 2. Run JavaScript tests
yarn test

# 3. Run linters
yarn lint
bundle exec rubocop
yarn typecheck

# 4. Test area timeline features manually
bin/dev
# - Visit http://localhost:3000/areas/kobe
# - Verify area filtering works
# - Test each area in area_settings.json
# - Check federated instance timelines

# 5. Test core Mastodon functionality
# - User registration/login
# - Post creation
# - Timeline viewing (home, local, federated)
# - Notifications
# - Media uploads
# - Federation (if test instances available)

# 6. Check for console errors
# - Open browser DevTools
# - Navigate through app
# - Watch for JavaScript errors
```

#### 9. Build and Test Assets

```bash
# Precompile assets
RAILS_ENV=production bundle exec rails assets:precompile

# Test production build
RAILS_ENV=production NODE_ENV=production bin/webpack

# Clear webpack cache if issues occur
rm -rf public/packs
yarn
```

#### 10. Commit and Push

```bash
# Review all changes
git log --oneline --graph -20

# Push sync branch
git push origin sync-upstream-v4.3.5
```

#### 11. Create Pull Request

Create a PR from `sync-upstream-v4.3.5` to `hyogo-develop`:

- Title: `Sync upstream v4.3.5`
- Description should include:
  - Upstream version being merged
  - Link to upstream release notes
  - Summary of major changes
  - List of conflicts resolved
  - Testing performed
  - Any breaking changes or action items

#### 12. Tag After Merge

After merging to `hyogo-develop` and then to `hyogo-master`, create a fork-specific tag:

```bash
git checkout hyogo-master
git pull origin hyogo-master

# Tag format: hyogo_<merged-upstream-tag>_<fork-specific-version-number>
git tag -a hyogo_v4.3.4_v4.3.5 -m "Merge upstream v4.3.5 into Hyogo fork"
git push origin hyogo_v4.3.4_v4.3.5
```

### Sync Schedule

**Recommended frequency:**

- **Security releases**: Sync immediately (within 24-48 hours)
- **Minor releases** (e.g., v4.3.x → v4.3.y): Sync within 1-2 weeks
- **Major releases** (e.g., v4.3.x → v4.4.0): Plan carefully, may require significant testing

**Monitor upstream:**

- Watch https://github.com/mastodon/mastodon/releases
- Subscribe to Mastodon security announcements
- Check https://github.com/mastodon/mastodon/security/advisories

### Conflict Prevention Strategies

To minimize merge conflicts in future syncs:

1. **Isolate fork-specific code**: Keep custom features in separate files when possible
2. **Follow upstream patterns**: Structure custom code similarly to upstream conventions
3. **Document modifications**: Comment fork-specific changes clearly
4. **Minimize core changes**: Prefer extending existing classes over modifying them
5. **Use concerns/modules**: Extract custom logic into mixins when feasible

### Troubleshooting Upstream Syncs

**Problem: Too many conflicts**

```bash
# Abort the merge and try cherry-picking specific commits instead
git merge --abort

# View upstream commits
git log upstream/main --oneline -20

# Cherry-pick specific fixes
git cherry-pick <commit-hash>
```

**Problem: Tests failing after merge**

```bash
# Check what changed in test setup
git diff upstream/v4.3.4..upstream/v4.3.5 spec/

# Common issues:
# - New required environment variables
# - Updated test factories (check spec/fabricators/)
# - Changed test helpers
```

**Problem: Assets not compiling**

```bash
# Clear all caches
rm -rf tmp/cache
rm -rf public/packs
rm -rf node_modules/.cache

# Reinstall dependencies
bundle install
yarn install --force

# Rebuild
bin/webpack
```

**Problem: Database migration conflicts**

```bash
# Check migration timestamps
ls db/migrate/ | tail -20

# If migration numbers conflict, renumber your fork migrations
# Example: Rename migration file to use a later timestamp
mv db/migrate/20250101000000_your_migration.rb \
   db/migrate/20250102000000_your_migration.rb

# Update the migration class name timestamp if needed
```

### Rollback Plan

If the sync introduces critical issues:

```bash
# On hyogo-develop branch
git revert -m 1 <merge-commit-hash>

# Or reset to before the merge (loses commit history)
git reset --hard origin/hyogo-develop

# Force push if necessary (use with caution)
git push origin hyogo-develop --force-with-lease
```

## Important Notes

- **ActivityPub Federation:** When making changes to models like `Account` or `Status`, consider federation implications. Changes may need corresponding updates to ActivityPub serializers and delivery workers.
- **Database Migrations:** Always use `StrongMigrations` guidelines. The gem will raise errors for unsafe migrations.
- **I18n:** New user-facing strings need translation keys. Run `yarn i18n:extract` to update locale files.
- **Normalization:** Use `i18n-tasks normalize` before committing locale changes.
- **Streaming Server:** Changes to real-time features require updates to both Rails and Node.js streaming code.
- **Breaking API Changes:** This fork maintains compatibility with upstream Mastodon. Avoid breaking changes to standard API endpoints.
