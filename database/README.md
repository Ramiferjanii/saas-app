# Database Migrations

This directory contains SQL migration files for the Supabase database.

## How to Apply Migrations

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of the migration file
4. Run the SQL script

### Option 2: Using Supabase CLI
```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
supabase db push
```

### Option 3: Using psql
```bash
# Connect to your database
psql -h YOUR_DB_HOST -p 5432 -d postgres -U postgres

# Run the migration
\i database/migrations/001_create_bookmarks_table.sql
```

## Migration Files

- `001_create_bookmarks_table.sql` - Creates the bookmarks table with proper indexes, RLS policies, and triggers
