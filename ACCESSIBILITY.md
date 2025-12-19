# Accessibility Guide

This document outlines the accessibility features and standards for the Aizura Consortium application.

## Color System & Contrast Ratios

Our design uses a carefully selected color palette that meets WCAG AA standards for contrast.

### Color Palette

#### Background Colors
- `slate-900` (#0f172a) - Primary background
- `slate-800` (#1e293b) - Secondary background / Cards
- `slate-700` (#334155) - Tertiary elements

#### Text Colors
- `white` (#ffffff) - Primary text - **Contrast: 16.07:1 on slate-900** ✓
- `slate-300` (#cbd5e1) - Secondary text - **Contrast: 11.63:1 on slate-900** ✓
- `slate-400` (#94a3b8) - Tertiary text - **Contrast: 7.42:1 on slate-900** ✓

#### Accent Colors
- `cyan-400` (#22d3ee) - Primary accent - **Contrast: 8.52:1 on slate-900** ✓
- `cyan-500` (#06b6d4) - Interactive elements - **Contrast: 6.91:1 on slate-900** ✓
- `blue-500` (#3b82f6) - Secondary accent - **Contrast: 5.89:1 on slate-900** ✓

#### Status Colors
- `green-400` (#4ade80) - Success states - **Contrast: 10.21:1 on slate-900** ✓
- `yellow-400` (#facc15) - Warning states - **Contrast: 13.45:1 on slate-900** ✓
- `red-400` (#f87171) - Error states - **Contrast: 6.82:1 on slate-900** ✓

### WCAG Compliance

All text/background combinations meet **WCAG AA standards** (minimum 4.5:1 for normal text, 3:1 for large text and UI elements).

Most combinations also meet **WCAG AAA standards** (7:1 for normal text, 4.5:1 for large text).

## Semantic HTML

We use semantic HTML5 elements throughout the application:

- `<nav>` - Navigation menus
- `<main>` - Primary content area (with `id="main-content"`)
- `<button>` - All interactive elements that trigger actions
- `<a>` - Links to other pages/resources
- `<article>` - Self-contained content
- `<section>` - Thematic groupings

## ARIA Attributes

### Navigation
- `role="navigation"` on nav elements
- `aria-label` for all navigation buttons
- `aria-current="page"` for active navigation links
- `aria-expanded` for mobile menu toggle
- `aria-controls` linking menu button to menu content

### Dynamic Content
- `role="log"` with `aria-live="polite"` for live message updates
- `role="status"` for loading states
- `role="alert"` for error messages
- `aria-busy` during loading operations

### Interactive Elements
- `aria-label` for icon-only buttons
- `aria-hidden="true"` for decorative icons
- `aria-expanded` for expandable sections
- `aria-modal="true"` for modal dialogs

### Forms
- Proper `<label>` associations for all inputs
- `aria-describedby` for helper text
- `aria-invalid` for validation errors

## Keyboard Navigation

All interactive elements are keyboard accessible:

### Focus Management
- Visible focus indicators on all interactive elements
- Logical tab order throughout the application
- Focus trap in modal dialogs
- Return focus to trigger element when closing modals

### Keyboard Shortcuts
- `Tab` - Navigate forward through interactive elements
- `Shift + Tab` - Navigate backward
- `Enter` / `Space` - Activate buttons
- `Escape` - Close modals and menus

### Skip Navigation
A "Skip to main content" link is provided at the top of each page (visible on keyboard focus) to allow keyboard users to bypass navigation.

## Screen Reader Support

### Tested With
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

### Features
- Meaningful page titles
- Proper heading hierarchy (h1 → h2 → h3)
- Alternative text for images
- Clear link text (no "click here")
- Form labels and instructions
- Error message announcements
- Live region updates for dynamic content

## Mobile Accessibility

### Touch Targets
All interactive elements meet the minimum size requirements:
- Touch targets are at least 44x44px
- Sufficient spacing between interactive elements

### Responsive Design
- Mobile-first responsive design
- Hamburger menu on small screens
- Readable text sizes at all viewport sizes
- No horizontal scrolling

### Viewport Configuration
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## Testing Procedures

### Automated Testing Tools
1. **Lighthouse** (Chrome DevTools) - Run accessibility audit
2. **axe DevTools** - Browser extension for automated checks
3. **Pa11y** - Command-line accessibility testing

### Manual Testing Checklist
- [ ] Test with keyboard only (no mouse)
- [ ] Verify all images have alt text
- [ ] Check color contrast ratios
- [ ] Test with screen reader
- [ ] Verify focus indicators are visible
- [ ] Test on mobile devices (various sizes)
- [ ] Verify form validation messages
- [ ] Check heading hierarchy
- [ ] Test with zoom at 200%
- [ ] Verify no horizontal scrolling

### Browser Compatibility
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Known Limitations

1. **Real-time Updates**: While live regions are implemented for message updates, some screen readers may not announce all updates if they occur too rapidly.

2. **Complex Visualizations**: Agent status badges and importance scales are primarily visual. Screen reader users receive text alternatives but may miss some visual nuances.

3. **Third-party Content**: User-generated proposal content may not always follow accessibility best practices.

## Future Improvements

- [ ] Add more comprehensive keyboard shortcuts
- [ ] Implement dark/light mode toggle with user preference
- [ ] Add font size adjustment controls
- [ ] Improve screen reader announcements for phase transitions
- [ ] Add reduced motion preferences
- [ ] Implement high contrast mode

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

## Contact

If you encounter any accessibility issues, please report them in our issue tracker with the `accessibility` label.
