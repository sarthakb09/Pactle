# Custom Color Palette System

This document outlines the custom color palette that has been implemented throughout the website using the specified colors: `#113F67`, `#34699A`, `#58A0C8`, and `#FDF5AA`.

## 🎨 Color Palette

### Primary Colors
- **Primary Dark**: `#113F67` - Deep blue for main brand elements
- **Primary Main**: `#34699A` - Medium blue for primary actions and buttons
- **Primary Light**: `#58A0C8` - Light blue for accents and highlights

### Accent Color
- **Accent Main**: `#FDF5AA` - Light yellow for call-to-action elements and highlights

## 📁 File Structure

### Color Constants
- **Location**: `src/constants/colors.ts`
- **Purpose**: Centralized color definitions and utility functions
- **Usage**: Import and use throughout components

### Tailwind Configuration
- **Location**: `tailwind.config.js`
- **Purpose**: Extends Tailwind with custom color classes
- **Usage**: Use custom color classes in components

### CSS Enhancements
- **Location**: `src/index.css`
- **Purpose**: Custom CSS classes and animations using the color palette
- **Usage**: Apply utility classes for consistent styling

## 🎯 Usage Examples

### Using Color Constants
```typescript
import { COLORS } from '../constants/colors';

// Access specific colors
const primaryColor = COLORS.primary.main; // #34699A
const accentColor = COLORS.accent.main;   // #FDF5AA
```

### Using Tailwind Classes
```jsx
// Primary buttons
<button className="bg-primary-main text-white hover:bg-primary-dark">
  Primary Button
</button>

// Accent buttons
<button className="bg-accent-main text-primary-dark hover:bg-primary-main">
  Accent Button
</button>

// Text colors
<h1 className="text-text-primary">Primary Text</h1>
<p className="text-text-muted">Muted Text</p>

// Background colors
<div className="bg-background-primary">Light Background</div>
<div className="bg-background-secondary">White Background</div>
```

### Using CSS Utility Classes
```jsx
// Pre-defined button styles
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-accent">Accent Button</button>

// Card styles
<div className="card">Card with hover effects</div>
<div className="card-hover">Card with lift effect</div>

// Input styles
<input className="input-modern" placeholder="Modern input" />

// Link styles
<a className="link-modern">Modern link</a>
```

## 🎨 Color Applications

### Header Component
- **Logo**: Primary dark color with hover to primary main
- **Navigation**: Text primary with hover to primary main
- **Buttons**: Primary main background with dark hover
- **Cart Badge**: Error color for notifications

### Product Grid
- **Background**: Background primary (light gray)
- **Cards**: White background with custom shadows
- **Buttons**: Primary main for actions, background primary for secondary
- **Price Tags**: Primary main background
- **Status Badges**: Error color for out of stock

### Forms (Login/Register)
- **Background**: Background primary
- **Inputs**: Border medium with primary main focus
- **Buttons**: Primary main background
- **Links**: Primary main text with dark hover

### Order History
- **Background**: Background primary
- **Cards**: White background with custom shadows
- **Icons**: Primary light background with main color
- **Status Colors**: Semantic colors (success, warning, error)

## 🎨 Semantic Color Usage

### Success States
- **Color**: `#10B981` (Green)
- **Usage**: Order completion, successful actions

### Warning States
- **Color**: `#F59E0B` (Amber)
- **Usage**: Pending states, caution messages

### Error States
- **Color**: `#EF4444` (Red)
- **Usage**: Error messages, out of stock, failed actions

## 🎨 Animation Integration

### GSAP Animations
- **Shadows**: Custom shadow colors using primary color with opacity
- **Hover Effects**: Scale and color transitions using the palette
- **Loading States**: Primary color for spinners

### CSS Animations
- **Gradients**: Primary color gradients for text and backgrounds
- **Transitions**: Smooth color transitions throughout the interface

## 🎨 Responsive Design

### Mobile Optimizations
- **Touch Targets**: Larger buttons with primary colors
- **Readability**: High contrast text colors
- **Performance**: Optimized color usage for mobile devices

### Desktop Enhancements
- **Hover States**: Rich hover interactions with color transitions
- **Shadows**: Custom shadows using primary color palette
- **Gradients**: Subtle gradients for depth and visual interest

## 🔧 Customization

### Adding New Colors
1. Add to `src/constants/colors.ts`
2. Update `tailwind.config.js`
3. Create utility classes in `src/index.css`

### Modifying Existing Colors
1. Update the color values in `src/constants/colors.ts`
2. Rebuild the application to apply changes

### Creating New Components
1. Import color constants: `import { COLORS } from '../constants/colors'`
2. Use Tailwind classes: `className="bg-primary-main text-white"`
3. Use utility classes: `className="btn-primary"`

## 📱 Accessibility

### Color Contrast
- **Primary Text**: High contrast against light backgrounds
- **Secondary Text**: Medium contrast for supporting information
- **Interactive Elements**: Clear contrast for buttons and links

### Focus States
- **Focus Rings**: Primary main color for accessibility
- **Hover States**: Clear visual feedback with color changes
- **Active States**: Darker variants for pressed states

## 🎯 Best Practices

### Do's
- ✅ Use semantic color names (primary, accent, success, etc.)
- ✅ Maintain consistent color usage across components
- ✅ Use the color constants for dynamic styling
- ✅ Test color contrast for accessibility

### Don'ts
- ❌ Don't hardcode color values in components
- ❌ Don't use colors that aren't in the palette
- ❌ Don't forget to test on different screen sizes
- ❌ Don't ignore accessibility guidelines

## 📚 Resources

- [Color Palette Constants](../src/constants/colors.ts)
- [Tailwind Configuration](../tailwind.config.js)
- [CSS Enhancements](../src/index.css)
- [GSAP Animations](./GSAP_ANIMATIONS.md)

---

This color system provides a cohesive, modern, and accessible design that maintains brand consistency throughout the application while offering flexibility for future enhancements. 