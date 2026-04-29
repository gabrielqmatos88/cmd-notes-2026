---
trigger: always_on
---

# SCSS/Sass Style Guidelines for CMD-Notes

## Import Rules

### Use @use with Namespace for Component SCSS Files

Component SCSS files should use `@use` statements with explicit namespace prefixes to avoid variable conflicts.

**Correct Pattern:**

```scss
// ComponentSCSS.scss - CORRECT ✅
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

// Use prefixed references
.my-component {
  padding: $space-lg;
  color: $text-primary;
  background: $bg-secondary;
}

// Use mixins with prefix
@include flex-center;
```

OR

```scss
// ComponentSCSS.scss - CORRECT ✅
@use "../../styles/variables" as vars;
@use "../../styles/mixins" as *;

// Use prefixed references
.my-component {
  padding: vars.$space-lg;
  color: vars.$text-primary;
  background: vars.$bg-secondary;
}
```

**WRONG Pattern - Do NOT use @import:**

```scss
// WRONG ❌ - @import is deprecated and can cause issues
@import "../../styles/variables";
@import "../../styles/mixins";
```

### Variable Availability Rules

**IMPORTANT:** Only use variables that are explicitly defined in `_variables.scss`. Never invent or assume variable names.

**DO NOT use undefined variables:**

```scss
// WRONG ❌ - $font-family-mono does not exist
font-family: $font-family-mono;

// WRONG ❌ - $success-dark does not exist (it's $success for color, no -dark variant)
color: $success-dark;
```

**Always check `_variables.scss` first** before using any variable. If you need a variable that doesn't exist, either:

1. Use an existing similar variable (e.g., use `$font-family-base` instead of a non-existent mono variant)
2. Add the variable to `_variables.scss` first (coordinate with team)

## Common Variable References

### Colors

| Variable           | Reference          |
| ------------------ | ------------------ |
| `$primary`         | `$primary`         |
| `$primary-dark`    | `$primary-dark`    |
| `$primary-light`   | `$primary-light`   |
| `$secondary`       | `$secondary`       |
| `$secondary-dark`  | `$secondary-dark`  |
| `$secondary-light` | `$secondary-light` |
| `$accent`          | `$accent`          |
| `$accent-dark`     | `$accent-dark`     |
| `$accent-light`    | `$accent-light`    |
| `$success`         | `$success`         |
| `$success-dark`    | `$success-dark`    |
| `$danger`          | `$danger`          |
| `$danger-dark`     | `$danger-dark`     |
| `$warning`         | `$warning`         |
| `$warning-dark`    | `$warning-dark`    |
| `$text-primary`    | `$text-primary`    |
| `$text-secondary`  | `$text-secondary`  |
| `$text-muted`      | `$text-muted`      |
| `$text-inverse`    | `$text-inverse`    |
| `$bg-primary`      | `$bg-primary`      |
| `$bg-secondary`    | `$bg-secondary`    |
| `$bg-tertiary`     | `$bg-tertiary`     |
| `$bg-dark`         | `$bg-dark`         |
| `$bg-darker`       | `$bg-darker`       |
| `$border-light`    | `$border-light`    |
| `$border-medium`   | `$border-medium`   |
| `$border-dark`     | `$border-dark`     |

### Spacing

| Variable     | Reference             |
| ------------ | --------------------- |
| `$space-xs`  | `$space-xs` (0.25rem) |
| `$space-sm`  | `$space-sm` (0.5rem)  |
| `$space-md`  | `$space-md` (1rem)    |
| `$space-lg`  | `$space-lg` (1.5rem)  |
| `$space-xl`  | `$space-xl` (2rem)    |
| `$space-2xl` | `$space-2xl` (3rem)   |
| `$space-3xl` | `$space-3xl` (4rem)   |

### Typography

| Variable                | Reference                     |
| ----------------------- | ----------------------------- |
| `$font-size-xs`         | `$font-size-xs` (0.75rem)     |
| `$font-size-sm`         | `$font-size-sm` (0.875rem)    |
| `$font-size-base`       | `$font-size-base` (1rem)      |
| `$font-size-lg`         | `$font-size-lg` (1.125rem)    |
| `$font-size-xl`         | `$font-size-xl` (1.25rem)     |
| `$font-size-2xl`        | `$font-size-2xl` (1.5rem)     |
| `$font-size-3xl`        | `$font-size-3xl` (1.875rem)   |
| `$font-size-4xl`        | `$font-size-4xl` (2.25rem)    |
| `$font-weight-normal`   | `$font-weight-normal` (400)   |
| `$font-weight-medium`   | `$font-weight-medium` (500)   |
| `$font-weight-semibold` | `$font-weight-semibold` (600) |
| `$font-weight-bold`     | `$font-weight-bold` (700)     |
| `$font-family-base`     | `$font-family-base`           |
| `$line-height-tight`    | `$line-height-tight` (1.25)   |
| `$line-height-normal`   | `$line-height-normal` (1.5)   |
| `$line-height-relaxed`  | `$line-height-relaxed` (1.75) |

### Layout

| Variable             | Reference                     |
| -------------------- | ----------------------------- |
| `$sidebar-width`     | `$sidebar-width` (280px)      |
| `$header-height`     | `$header-height` (64px)       |
| `$max-content-width` | `$max-content-width` (1200px) |

### Border Radius

| Variable       | Reference               |
| -------------- | ----------------------- |
| `$radius-sm`   | `$radius-sm` (0.25rem)  |
| `$radius-md`   | `$radius-md` (0.5rem)   |
| `$radius-lg`   | `$radius-lg` (0.75rem)  |
| `$radius-xl`   | `$radius-xl` (1rem)     |
| `$radius-full` | `$radius-full` (9999px) |

### Shadows

| Variable     | Reference    |
| ------------ | ------------ |
| `$shadow-sm` | `$shadow-sm` |
| `$shadow-md` | `$shadow-md` |
| `$shadow-lg` | `$shadow-lg` |
| `$shadow-xl` | `$shadow-xl` |

### Transitions

| Variable             | Reference                         |
| -------------------- | --------------------------------- |
| `$transition-fast`   | `$transition-fast` (150ms ease)   |
| `$transition-normal` | `$transition-normal` (250ms ease) |
| `$transition-slow`   | `$transition-slow` (350ms ease)   |

### Breakpoints

| Variable         | Reference                 |
| ---------------- | ------------------------- |
| `$breakpoint-sm` | `$breakpoint-sm` (640px)  |
| `$breakpoint-md` | `$breakpoint-md` (768px)  |
| `$breakpoint-lg` | `$breakpoint-lg` (1024px) |
| `$breakpoint-xl` | `$breakpoint-xl` (1280px) |

### Z-Index

| Variable            | Reference                 |
| ------------------- | ------------------------- |
| `$z-dropdown`       | `$z-dropdown` (100)       |
| `$z-sticky`         | `$z-sticky` (200)         |
| `$z-modal-backdrop` | `$z-modal-backdrop` (300) |
| `$z-modal`          | `$z-modal` (400)          |
| `$z-toast`          | `$z-toast` (500)          |
| `$z-tooltip`        | `$z-tooltip` (600)        |

### Mixin References

| Mixin              | Reference          |
| ------------------ | ------------------ |
| `flex-center`      | `flex-center`      |
| `flex-between`     | `flex-between`     |
| `flex-column`      | `flex-column`      |
| `flex-start`       | `flex-start`       |
| `flex-end`         | `flex-end`         |
| `button-base`      | `button-base`      |
| `button-reset`     | `button-reset`     |
| `button-primary`   | `button-primary`   |
| `button-secondary` | `button-secondary` |
| `button-danger`    | `button-danger`    |
| `input-base`       | `input-base`       |
| `card`             | `card`             |
| `custom-scrollbar` | `custom-scrollbar` |
| `truncate`         | `truncate`         |
| `visually-hidden`  | `visually-hidden`  |
| `mobile`           | `mobile`           |
| `tablet`           | `tablet`           |
| `desktop`          | `desktop`          |

## Example Component

```scss
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

.my-component {
  padding: $space-lg;
  background: $bg-secondary;
  border-radius: $radius-lg;

  &__title {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }

  &__button {
    @include button-primary;
    margin-top: $space-md;
  }
}

@include mobile {
  .my-component {
    padding: $space-md;
  }
}
```

## File Organization

1. **Global styles** (`src/styles/`):
   - `_variables.scss` - Design tokens and variables
   - `_mixins.scss` - Reusable mixins (includes variables internally)
   - `main.scss` - Global imports and base styles

2. **Component styles** (`src/components/*/`):
   - Each component has its own `ComponentName.scss`
   - Never use `@import` (deprecated)

## Troubleshooting

### "Undefined variable" Error

If you encounter an "Undefined variable" error:

1. Check if the variable is spelled correctly
2. Verify the variable exists in `_variables.scss`
3. Ensure `@use` statements are present at the top of the file
4. Use the variable reference table above to find the correct name

### Common Mistakes

| Wrong                | Correct                               | Notes                       |
| -------------------- | ------------------------------------- | --------------------------- |
| `$font-family-mono`  | `$font-family-base`                   | Mono variant doesn't exist  |
| `$success-light`     | Use rgba with `$success`              | Light variant doesn't exist |
| `$bg-tertiary-light` | Use `$bg-tertiary` or `$bg-secondary` | Variant doesn't exist       |
| `$space-lg-md`       | Use `$space-lg` or `$space-md`        | Hybrid sizes don't exist    |
