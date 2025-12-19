# Shared Theme Configuration

Centralized theme and styling configuration for all applications in the Aizura Consortium monorepo.

## Overview

This directory contains:
- **theme.ts**: Color constants, theme classes, spacing, animations, and the `cn()` utility
- **tailwind.preset.js**: Shared Tailwind configuration preset
- **index.ts**: Main exports

## Usage

### Import Theme Classes

```typescript
import { themeClasses, cn, spacing, colors } from '@shared/styles';

// Use predefined button styles
<button className={themeClasses.button.primary}>
  Click me
</button>

// Combine with custom classes using cn()
<div className={cn(themeClasses.card.default, "my-custom-class")}>
  Card content
</div>

// Use spacing constants
<div className={spacing.page}>
  Page content
</div>
```

### Theme Classes

#### Buttons
- `themeClasses.button.primary` - Primary action button
- `themeClasses.button.secondary` - Secondary button
- `themeClasses.button.outline` - Outlined button
- `themeClasses.button.ghost` - Ghost button (no background)
- `themeClasses.button.danger` - Destructive action button
- `themeClasses.button.sizes.{sm|md|lg}` - Size variants

#### Cards
- `themeClasses.card.default` - Standard card
- `themeClasses.card.interactive` - Clickable card with hover effect
- `themeClasses.card.elevated` - Card with stronger shadow

#### Inputs
- `themeClasses.input.base` - Base input styles
- `themeClasses.input.error` - Error state styles

#### Badges
- `themeClasses.badge.{primary|success|warning|error|neutral}` - Colored badges

#### Text
- `themeClasses.text.heading.{h1|h2|h3|h4}` - Heading styles
- `themeClasses.text.body.{default|small|muted}` - Body text styles

### Colors

Access color constants directly:

```typescript
import { colors } from '@shared/styles';

const primaryColor = colors.primary[600]; // '#2563eb'
```

### Spacing

Pre-defined spacing utilities:

```typescript
import { spacing } from '@shared/styles';

// spacing.page: 'px-4 sm:px-6 lg:px-8'
// spacing.section: 'py-8 sm:py-12 lg:py-16'
// spacing.card: 'p-4 sm:p-6'
// spacing.container: 'max-w-7xl mx-auto'
```

### cn() Utility

The `cn()` function is a utility for conditionally combining class names:

```typescript
import { cn } from '@shared/styles';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  isFocused ? 'focused' : 'unfocused'
)}>
  Content
</div>
```

## Tailwind Configuration

All apps should extend the shared preset:

```javascript
import sharedPreset from '../shared/styles/tailwind.preset.js';

export default {
  presets: [sharedPreset],
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "../shared/**/*.{js,ts,jsx,tsx}",
  ],
  // App-specific overrides
};
```

## Benefits

1. **Consistency**: All apps use the same color palette and design tokens
2. **Maintainability**: Update styles in one place
3. **Type Safety**: TypeScript autocomplete for theme classes
4. **Flexibility**: Can override with custom classes when needed
5. **Performance**: Shared configuration reduces bundle duplication

## Best Practices

1. **Prefer theme classes over inline Tailwind**: Use `themeClasses` when possible
2. **Use cn() for conditional classes**: Cleaner than string concatenation
3. **Don't override core colors**: Extend the theme instead
4. **Document custom additions**: Add comments for app-specific extensions
