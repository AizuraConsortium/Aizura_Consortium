# Validation Guide

## Overview

Our validation system is layered to provide type-safe, reusable validation
across frontend and backend with consistent error messages.

## Validation Layers

### 1. Base Validators (`@shared/utils/validation/base-validators`)

Primitive validation functions:

```typescript
import { isValidEmail, isValidUrl, hasMinLength } from '@shared/utils/validation';

if (!isValidEmail(email)) {
  // Handle invalid email
}
```

### 2. Field Validators (`@shared/utils/validation/field-validators`)

Field-level validation with error messages:

```typescript
import { validateEmail, validateRequired } from '@shared/utils/validation';

const emailValidation = validateEmail(userInput);
if (!emailValidation.isValid) {
  console.error(emailValidation.error);
}
```

### 3. Business Validators (`@shared/utils/validation/business-validators`)

Domain-specific validation:

```typescript
import { validateProposal, PROPOSAL_VALIDATION_RULES } from '@shared/utils/validation';

const validation = validateProposal(title, summary);
if (!validation.isValid) {
  // validation.errors.title
  // validation.errors.summary
}
```

### 4. Backend Schemas (`/backend/shared/validation/schemas`)

Zod schemas for API request validation:

```typescript
import { paginationSchema, errorLogSchema } from '@backend/shared/validation/schemas';

// In Express middleware
const result = paginationSchema.safeParse(req.query);
```

### 5. Service Validators (`/backend/shared/validators/serviceValidators`)

Business rule validation in services:

```typescript
import { proposalTitleRule, proposalSummaryRule } from '@backend/shared/validators/serviceValidators';

if (!proposalTitleRule.validate({ title })) {
  throw new ValidationError(proposalTitleRule.errorMessage);
}
```

## Usage Examples

### Frontend Form Validation

```typescript
import { validateProposal } from '@shared/utils/validation';

function ProposalForm() {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateProposal(title, summary);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Submit form
  };
}
```

### Backend API Validation

```typescript
import { createQueryValidator, paginationSchema } from '@backend/shared/validation/schemas';

router.get('/items',
  createQueryValidator(paginationSchema),
  async (req, res) => {
    // req.query is now validated and typed
    const { limit, offset } = req.query;
  }
);
```

### Custom Validators

```typescript
import { createValidator } from '@shared/utils/validation';

const validateUsername = createValidator(
  (username: string) => /^[a-zA-Z0-9_]{3,20}$/.test(username),
  'Username must be 3-20 alphanumeric characters'
);
```

## Validation Rules

All validation rules are exported as constants:

```typescript
import {
  PROPOSAL_VALIDATION_RULES,
  USER_VALIDATION_RULES
} from '@shared/utils/validation';

console.log(PROPOSAL_VALIDATION_RULES.TITLE_MAX_LENGTH); // 200
```

## Best Practices

1. **Use Shared Validators**: Always use validators from `@shared/utils/validation`
2. **Validate Early**: Validate on the frontend AND backend
3. **Consistent Messages**: Use the provided error messages
4. **Type Safety**: Leverage TypeScript for validation functions
5. **Compose Validators**: Use composition for complex validation
6. **Document Rules**: Keep validation rules as exported constants
