# Utility Functions

This folder contains reusable utility functions for the Real Estate Analytics & Property Management Platform.

## Structure

```
src/app/utils/
├── date.utils.ts       # Date formatting and manipulation functions
├── number.utils.ts     # Number formatting and calculation functions
├── validation.utils.ts # Validation functions for common data types
└── index.ts           # Central export point for all utilities
```

## Usage

Import utilities from the central index:

```typescript
import {
  formatDate,
  formatCurrency,
  isValidEmail,
  validatePasswordStrength
} from '@app/utils';
```

Or import specific utilities:

```typescript
import { formatCurrency } from '@app/utils/number.utils';
import { isValidEmail } from '@app/utils/validation.utils';
```

## Available Functions

### Date Utilities (`date.utils.ts`)

- `formatDate(date, locale?, options?)` - Format date with locale support
- `formatShortDate(date, locale?)` - Format as MM/DD/YYYY
- `formatLongDate(date, locale?)` - Format as "January 15, 2024"
- `daysBetween(startDate, endDate)` - Calculate days between dates
- `isWithinDays(date, days)` - Check if date is within N days
- `isPastDate(date)` - Check if date is in the past
- `getRelativeTime(date, locale?)` - Get relative time string (e.g., "2 days ago")

### Number Utilities (`number.utils.ts`)

- `formatCurrency(value, locale?, currency?)` - Format as currency
- `formatNumber(value, locale?)` - Format with thousand separators
- `formatPercentage(value, locale?, decimals?, isDecimal?)` - Format as percentage
- `formatCompactNumber(value, locale?)` - Format with compact notation (1.2K, 3.5M)
- `roundTo(value, decimals?)` - Round to specified decimal places
- `calculatePercentageChange(oldValue, newValue)` - Calculate percentage change
- `clamp(value, min, max)` - Clamp value between min and max
- `isValidNumber(value)` - Check if value is a valid number

### Validation Utilities (`validation.utils.ts`)

- `isValidEmail(email)` - Validate email format
- `isValidPhone(phone)` - Validate phone number (US format)
- `isValidZipCode(zipCode)` - Validate ZIP code (US format)
- `isValidUrl(url)` - Validate URL format
- `isEmpty(value)` - Check if string is empty or whitespace
- `isInRange(value, min, max)` - Check if value is within range
- `isFutureDate(date)` - Check if date is today or in future
- `isValidYear(year, minYear?, maxYear?)` - Validate year range
- `sanitizeHtml(value)` - Remove HTML tags from string
- `validatePasswordStrength(password)` - Validate password strength
- `validateRequiredFields(obj, requiredFields)` - Validate required fields in object

## Examples

### Date Formatting

```typescript
import { formatDate, formatCurrency, getRelativeTime } from '@app/utils';

const date = new Date('2024-01-15');
console.log(formatDate(date, 'en-US')); // "Jan 15, 2024"
console.log(formatDate(date, 'ar-SA')); // Arabic format
console.log(getRelativeTime(date)); // "2 months ago"
```

### Number Formatting

```typescript
import { formatCurrency, formatPercentage, roundTo } from '@app/utils';

console.log(formatCurrency(1500, 'en-US', 'USD')); // "$1,500"
console.log(formatPercentage(85.5)); // "85.5%"
console.log(roundTo(3.14159, 2)); // 3.14
```

### Validation

```typescript
import { isValidEmail, validatePasswordStrength, validateRequiredFields } from '@app/utils';

console.log(isValidEmail('user@example.com')); // true
console.log(validatePasswordStrength('Pass123!')); // { isValid: true, message: "..." }

const user = { name: 'John', email: '' };
console.log(validateRequiredFields(user, ['name', 'email'])); // ['email']
```

## Locale Support

Most functions support locale-specific formatting:

```typescript
import { formatDate, formatCurrency } from '@app/utils';

// English (US)
formatDate(new Date(), 'en-US'); // "Jan 15, 2024"
formatCurrency(1500, 'en-US', 'USD'); // "$1,500"

// Arabic (Saudi Arabia)
formatDate(new Date(), 'ar-SA'); // Arabic format
formatCurrency(1500, 'ar-SA', 'SAR'); // Arabic format with SAR
```

## Best Practices

1. **Use the index export** - Import from `@app/utils` for cleaner imports
2. **Locale awareness** - Always consider locale when formatting for international users
3. **Type safety** - All functions are fully typed with TypeScript
4. **Error handling** - Validation functions return boolean or objects with error messages
5. **Performance** - Utility functions are pure and optimized for performance
