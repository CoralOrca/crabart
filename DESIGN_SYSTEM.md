# CrabArt Design System

This design system provides a consistent visual language for the CrabArt platform, with support for both light and dark themes.

## Colors

### Primary Colors
- **Primary Accent** (`--primary-accent`): #FF4D4D - Main brand color
- **Deep Background** (`--deep-background`): Theme-aware background
- **Surface** (`--surface`): Elevated surface color
- **Highlight** (`--highlight`): Accent color for emphasis

### Secondary Colors
- **Warm Gray** (`--warm-gray`): Neutral tone
- **Soft White** (`--soft-white`): Theme-aware text color
- **Warning** (`--warning`): Warning states
- **Error** (`--error`): Error states
- **Success** (`--success`): Success states

## Typography

### Font Families
- **Primary**: Geist (sans-serif)
- **Secondary**: Geist Mono (monospace)

### Type Scale
- **H1**: 48px / 700 / 1.2 line-height / -0.02em letter-spacing
- **H2**: 32px / 700 / 1.3 line-height / -0.01em letter-spacing
- **H3**: 24px / 600 / 1.4 line-height
- **H4**: 18px / 600 / 1.4 line-height
- **Body**: 16px / 400 / 1.5 line-height
- **Caption**: 13px / 400 / 1.5 line-height / 0.01em letter-spacing
- **Mono Data**: 14px / 500 / 1.6 line-height

## Spacing
- **micro**: 4px
- **tight**: 8px  
- **standard**: 16px
- **section**: 24px
- **card**: 32px
- **major**: 64px

## Appearance
- **Border Radius**: 10px
- **Border Width**: 1px
- **Shadow**: 10px blur with 15% opacity
- **Transition Duration**: 150ms
- **Disabled Opacity**: 50%
- **Focus Ring**: 3px width

## Usage

### CSS Variables
```css
/* Colors */
background-color: var(--primary-accent);
color: var(--soft-white);

/* Spacing */
padding: var(--space-standard);
margin-bottom: var(--space-section);

/* Typography */
font-size: var(--text-h2);
line-height: var(--line-h2);
```

### Tailwind Classes
```jsx
// Colors
<div className="bg-primary-accent text-soft-white">

// Typography  
<h1 className="text-h1">Title</h1>
<p className="text-body">Body text</p>

// Spacing
<div className="p-standard mb-section">

// Utilities
<button className="rounded-default shadow-default transition-default">
```

### TypeScript Constants
```typescript
import { DesignTokens, ColorScheme } from '@/lib/design-system';

// Access design tokens
const primaryFont = DesignTokens.fonts.primary;
const cardSpacing = DesignTokens.spacing.card;

// Get theme-aware colors
const colors = getColorScheme(isDarkMode);
const accentColor = colors.primary.accent;
```

## Theme Support

The design system automatically adapts to the user's color scheme preference. Light mode uses lighter backgrounds with dark text, while dark mode uses darker backgrounds with light text.

Colors automatically switch based on `prefers-color-scheme` media query, but can be overridden programmatically.