# Website Backend

Public-facing API endpoints for the Aizura Consortium website.

## Security Model

This backend uses the Supabase ANON_KEY for all database access, ensuring:
- Read-only operations
- Row Level Security (RLS) enforcement
- No privilege escalation
- Public access (no authentication required)

## Architecture

### Layer Structure
- **Routes** (`/routes/`) - Express route definitions, rate limiting
- **Controllers** (`/controllers/`) - Request/response handling, error management
- **Services** (`/services/`) - Business logic, data orchestration
- **Repositories** (`/repositories/`) - Database access with ANON_KEY client

### Repository Pattern

All database queries must go through the repository layer:

```typescript
// ✅ CORRECT - Uses website repository
import * as TopicsRepo from '../repositories/topics.js';
const topic = await TopicsRepo.getCurrentTopic();

// ❌ WRONG - Direct Supabase client usage
import { supabase } from '../../shared/services/supabase/client.js';
const { data } = await supabase.from('topics').select('*');

// ❌ WRONG - Uses shared repository (SERVICE_ROLE_KEY)
import { getCurrentTopic } from '../../shared/services/supabase/repositories/topics.js';
const topic = await getCurrentTopic();
```

## Security Checklist

Before creating new endpoints:

- [ ] Uses website repositories only
- [ ] No authentication middleware
- [ ] Rate limiting applied
- [ ] Read-only operations only
- [ ] Proper error handling (404, 500)
- [ ] Input validation where needed

## Adding New Features

1. Create repository function in `/repositories/`
2. Add service method in `/services/`
3. Create controller method in `/controllers/`
4. Define route in `/routes/`
5. Add rate limit config in `/backend/shared/config/rateLimits.ts`
6. Update API documentation in `/backend/API.md`

## Testing

```bash
# Test a public endpoint
curl http://localhost:3001/api/website/topics/current

# Test rate limiting
for i in {1..100}; do curl http://localhost:3001/api/website/topics/current; done
```

## Important Notes

- NEVER import from `../../shared/services/supabase/repositories/`
- NEVER use direct Supabase client access in services
- NEVER add authentication middleware to website routes
- ALWAYS use website-specific repositories
- ALWAYS apply rate limiting to routes
- ALWAYS handle errors with try/catch in controllers
