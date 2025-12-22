# Pull Request

## Description

Provide a clear and concise description of what this PR does.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Shared code changes

## Changes Made

List the main changes in this PR:

-
-
-

## Related Issues

Closes #
Relates to #

## Testing

Describe the tests you ran and how to reproduce them:

- [ ] Tested locally
- [ ] Added/updated unit tests
- [ ] Added/updated integration tests
- [ ] Tested in multiple browsers
- [ ] Tested on mobile devices

## Shared Code Changes

**If this PR modifies the `shared/` folder, complete this section:**

- [ ] Component/hook is used by 2+ apps OR is clearly reusable
- [ ] No imports from app folders (admin, client, website, backend)
- [ ] No hardcoded app-specific values
- [ ] Props allow customization for all use cases
- [ ] Full TypeScript types are defined
- [ ] JSDoc comments added with examples
- [ ] Tests added or updated
- [ ] Documentation updated in relevant README
- [ ] `npm run validate:shared` passes
- [ ] Integration tests pass in all target apps
- [ ] Verified no breaking changes to existing usages

**Apps using this shared code:**
- [ ] Admin
- [ ] Client
- [ ] Website
- [ ] Backend

**Justification for shared folder:**


## Screenshots (if applicable)

Add screenshots to help reviewers understand the changes visually.

## Database Changes

- [ ] This PR includes database migrations
- [ ] RLS policies have been reviewed and tested
- [ ] Data safety has been considered
- [ ] Migration tested locally
- [ ] Rollback plan documented

## Deployment Notes

Any special considerations for deployment:

-
-

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is commented where necessary
- [ ] Documentation has been updated
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] Build succeeds
- [ ] Validation scripts pass

## Reviewer Guidance

Areas that need special attention:

-
-

## Post-Merge Tasks

- [ ] Update related documentation
- [ ] Notify team of changes
- [ ] Monitor for issues
- [ ] Update related tickets
