# SaaS Companion App

A Next.js application for creating and managing AI voice companions for educational purposes.

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# VAPI Configuration
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token_here

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Sentry Configuration (optional)
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_sentry_org_here
SENTRY_PROJECT=your_sentry_project_here
SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
```

### 2. Required Services

- **Supabase**: Database and authentication
- **Clerk**: User authentication
- **VAPI**: Voice AI integration
- **Sentry**: Error monitoring (optional)

### 3. Installation

```bash
npm install
npm run dev
```

### 4. Common Issues Fixed

- ✅ Fixed 400 errors from missing environment variables
- ✅ Fixed VAPI configuration issues
- ✅ Fixed Supabase connection errors
- ✅ Removed intentionally failing Sentry API
- ✅ Added proper error handling for missing services

## Features

- Dynamic companion cards with real database data
- User-specific bookmark functionality
- Voice AI integration with VAPI
- Authentication with Clerk
- Error monitoring with Sentry
- Responsive design with Tailwind CSS
