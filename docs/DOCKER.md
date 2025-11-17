# Docker Setup

## Quick Start

```bash
# 1. Setup environment files
make env-setup

# 2. Update .env.dev and .env.prod with generated secret
# The secret is automatically generated and shown when you run env-setup

# 3. Start development
make dev

# 4. Initialize database
make db-migrate

# 5. (Optional) Seed database with sample data
# Note: Seeding requires development dependencies
# If you get an error, you can skip this step
# The application will work without seed data
make db-seed
```

## Environment Files

This project uses separate environment files for development and production:

- **`.env.dev`** - Development environment
- **`.env.prod`** - Production environment

### Creating Environment Files

```bash
# Create both .env.dev and .env.prod from examples
make env-setup

# Or manually
cp .env.dev.example .env.dev
cp .env.prod.example .env.prod

# Generate secret for NEXTAUTH_SECRET
make env-secret
```

## Common Commands

```bash
# Development
make dev              # Start development (uses .env.dev)
make build            # Build dev images (uses .env.dev)
make build env=prod   # Build prod images (uses .env.prod)

# Production
make prod             # Start production (uses .env.prod)

# Container Management
make logs             # View logs
make logs f=1         # Follow logs
make status           # Container status
make restart          # Restart dev containers
make restart env=prod # Restart prod containers
make down             # Stop containers

# Database
make db-migrate       # Run migrations (REQUIRED)
make db-seed          # Seed database (OPTIONAL - may not work in production build)
make db-shell         # Open database shell
make db-backup        # Backup database
make db-reset         # Reset database

# Development
make shell            # Open app shell
make test             # Run tests
make lint             # Run linter

# Cleanup
make clean            # Remove containers & volumes
make prune            # Prune Docker system

# Utilities
make health           # Check app health
make env-setup        # Create env files
make env-secret       # Generate NEXTAUTH_SECRET
make help             # Show all commands
```

## Access Points

- **Application**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **Database**: localhost:5432

## Environment Variables

### Development (.env.dev)
```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/se_project?schema=public"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=se_project
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
APP_PORT=3000
```

### Production (.env.prod)
```env
DATABASE_URL="postgresql://postgres:strong-password@postgres:5432/se_project?schema=public"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=strong-password
POSTGRES_DB=se_project
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
APP_PORT=3000
```

## Full Setup (First Time)

```bash
# 1. Create environment files
make env-setup

# 2. Copy the generated secret and update both .env.dev and .env.prod
#    Edit the files and replace NEXTAUTH_SECRET with the generated value

# 3. Build and start development
make build
make dev

# 4. Initialize database
make db-migrate

# 5. (Optional) Seed with sample data
# Note: This may fail in production builds - it's optional
make db-seed

# Access at http://localhost:3000
```

## Production Deployment

```bash
# 1. Ensure .env.prod is configured with production values
#    - Strong database password
#    - Production domain in NEXTAUTH_URL
#    - Secure NEXTAUTH_SECRET

# 2. Build production images
make build env=prod

# 3. Start production
make prod

# 4. Run migrations
make db-migrate
```

## Switching Between Environments

```bash
# Stop current environment
make down

# Start development
make dev

# Or start production
make prod
```

## Troubleshooting

```bash
# Port already in use
lsof -i :3000
kill -9 <PID>

# Environment file missing
make env-setup

# Clean restart
make down
make clean
make dev

# View logs
make logs f=1

# Check health
make health
curl http://localhost:3000/api/health

# Rebuild images
make build            # Development
make build env=prod   # Production
```

## Important Notes

- **Never commit** `.env.dev` or `.env.prod` files to version control
- Use different `NEXTAUTH_SECRET` for dev and prod
- Use strong passwords in `.env.prod`
- Always use HTTPS (https://) for production `NEXTAUTH_URL`
- The `.env` file (if exists) is ignored - use `.env.dev` and `.env.prod` instead
- **Database seeding** (`make db-seed`) is optional and may not work in production builds
- The application works without seed data - you can add data through the UI
- **Always run migrations** (`make db-migrate`) after starting containers for the first time