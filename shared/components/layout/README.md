# Layout Components Documentation

This directory contains navigation and layout components used across the Aizura Consortium applications. These components provide consistent navigation patterns while allowing customization for different application needs.

## Components

### BaseNavigation

**Location:** `shared/components/layout/BaseNavigation.tsx`

A flexible base navigation component that provides core navigation functionality with responsive behavior and accessibility features.

**Props:**
```typescript
interface BaseNavigationProps {
  appName: string;
  logoHref?: string;
  links: NavigationLink[];
  userSection?: React.ReactNode;
  mobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
  className?: string;
}

interface NavigationLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  badge?: string | number;
}
```

**Features:**
- Responsive navigation (mobile hamburger, desktop horizontal)
- Active link highlighting
- Optional badges for counts/notifications
- User section for avatar/menu
- Keyboard navigation support
- ARIA landmarks and labels
- Smooth transitions

**Usage:**
```typescript
import { BaseNavigation } from '@shared/components/layout';

const links = [
  { label: 'Dashboard', href: '/dashboard', active: true },
  { label: 'Proposals', href: '/proposals', badge: 3 },
  { label: 'Settings', href: '/settings' }
];

<BaseNavigation
  appName="Client Portal"
  logoHref="/"
  links={links}
  userSection={<UserMenu />}
/>
```

---

### NavigationLink

**Location:** `shared/components/layout/NavigationLink.tsx`

An accessible navigation link component with active state styling and optional icon/badge support.

**Props:**
```typescript
interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  onClick?: () => void;
  className?: string;
}
```

**Features:**
- Active state styling
- Icon support with proper spacing
- Badge display for notifications
- Hover and focus states
- Keyboard navigation

**Usage:**
```typescript
import { NavigationLink } from '@shared/components/layout';
import { Home, FileText } from 'lucide-react';

<NavigationLink href="/dashboard" active icon={<Home />}>
  Dashboard
</NavigationLink>

<NavigationLink href="/proposals" badge={5} icon={<FileText />}>
  Proposals
</NavigationLink>
```

---

### MobileMenu

**Location:** `shared/components/layout/MobileMenu.tsx`

A mobile-optimized navigation menu with slide-in animation and overlay.

**Props:**
```typescript
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavigationLink[];
  userSection?: React.ReactNode;
  appName?: string;
}
```

**Features:**
- Slide-in animation from right
- Overlay background
- Focus trap when open
- Escape key to close
- Smooth transitions
- Full height scrollable

**Usage:**
```typescript
import { MobileMenu } from '@shared/components/layout';
import { useState } from 'react';

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button onClick={() => setMenuOpen(true)}>
        Menu
      </button>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navigationLinks}
        userSection={<UserProfile />}
        appName="My App"
      />
    </>
  );
}
```

---

## Usage Examples

### Example 1: Admin Navigation

```typescript
import { BaseNavigation } from '@shared/components/layout';
import { useLocation } from 'react-router-dom';
import { Shield, Users, Settings, BarChart } from 'lucide-react';

function AdminNavigation() {
  const location = useLocation();

  const links = [
    {
      label: 'Dashboard',
      href: '/admin',
      active: location.pathname === '/admin',
      icon: <BarChart size={18} />
    },
    {
      label: 'Users',
      href: '/admin/users',
      active: location.pathname === '/admin/users',
      icon: <Users size={18} />
    },
    {
      label: 'Error Monitor',
      href: '/admin/errors',
      active: location.pathname === '/admin/errors',
      icon: <Shield size={18} />,
      badge: errorCount > 0 ? errorCount : undefined
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      active: location.pathname === '/admin/settings',
      icon: <Settings size={18} />
    }
  ];

  return (
    <BaseNavigation
      appName="Admin Portal"
      logoHref="/admin"
      links={links}
      userSection={<AdminUserMenu />}
    />
  );
}
```

---

### Example 2: Client Navigation with Notifications

```typescript
import { BaseNavigation } from '@shared/components/layout';
import { useAuth } from '@shared/hooks';
import { Bell } from 'lucide-react';

function ClientNavigation() {
  const { user } = useAuth();
  const { data: notifications } = useNotifications();

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const links = [
    { label: 'Dashboard', href: '/dashboard', active: true },
    { label: 'My Proposals', href: '/proposals' },
    { label: 'Governance', href: '/governance' },
    {
      label: 'Notifications',
      href: '/notifications',
      icon: <Bell size={18} />,
      badge: unreadCount > 0 ? unreadCount : undefined
    }
  ];

  const userSection = (
    <div className="flex items-center gap-3">
      <span className="text-sm">{user?.email}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );

  return (
    <BaseNavigation
      appName="Consortium Client"
      links={links}
      userSection={userSection}
    />
  );
}
```

---

### Example 3: Website Public Navigation

```typescript
import { BaseNavigation } from '@shared/components/layout';
import { Link } from 'react-router-dom';

function WebsiteNavigation() {
  const links = [
    { label: 'Home', href: '/', active: true },
    { label: 'About', href: '/about' },
    { label: 'Governance', href: '/governance' },
    { label: 'Plans', href: '/plans' }
  ];

  const userSection = (
    <div className="flex gap-2">
      <Link
        to="/login"
        className="px-4 py-2 text-gray-700 hover:text-gray-900"
      >
        Sign In
      </Link>
      <Link
        to="/signup"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Get Started
      </Link>
    </div>
  );

  return (
    <BaseNavigation
      appName="Aizura Consortium"
      logoHref="/"
      links={links}
      userSection={userSection}
    />
  );
}
```

---

### Example 4: Responsive Navigation with Mobile Menu

```typescript
import { BaseNavigation, MobileMenu } from '@shared/components/layout';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

function ResponsiveNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { label: 'Dashboard', href: '/dashboard', active: true },
    { label: 'Proposals', href: '/proposals' },
    { label: 'Settings', href: '/settings' }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <BaseNavigation
          appName="My App"
          links={links}
          userSection={<UserMenu />}
        />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-bold">My App</h1>
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>

        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          links={links}
          userSection={<UserMenu />}
          appName="My App"
        />
      </div>
    </>
  );
}
```

---

## Customization

### Custom Styling

```typescript
<BaseNavigation
  appName="My App"
  links={links}
  className="bg-gray-900 text-white"
/>
```

### Custom Logo

```typescript
<BaseNavigation
  appName={
    <img src="/logo.png" alt="Company Logo" className="h-8" />
  }
  links={links}
/>
```

### Custom Link Rendering

```typescript
import { NavigationLink } from '@shared/components/layout';

const links = [
  {
    label: 'Custom Link',
    href: '/custom',
    render: (link) => (
      <NavigationLink
        href={link.href}
        active={link.active}
        className="custom-nav-link"
      >
        <CustomIcon />
        {link.label}
      </NavigationLink>
    )
  }
];
```

---

## Accessibility

### Keyboard Navigation

All navigation components support:
- Tab key to navigate between links
- Enter/Space to activate links
- Escape to close mobile menu
- Focus visible indicators

### Screen Readers

- Proper ARIA labels and roles
- `<nav>` landmark for navigation
- `aria-current="page"` for active links
- `aria-label` for icon-only buttons
- `aria-expanded` for mobile menu

### Focus Management

- Focus trap in mobile menu
- Returns focus to trigger after close
- Visible focus indicators
- Skip navigation link

---

## Best Practices

1. **Use BaseNavigation for consistency** across all applications
2. **Provide active state** for current page highlighting
3. **Use icons sparingly** - only when they add clarity
4. **Badge numbers should be concise** - use "99+" for large counts
5. **Test on mobile devices** - ensure touch targets are adequate
6. **Include skip navigation** for accessibility
7. **Keep navigation items to 5-7** for optimal UX
8. **Use responsive breakpoints** consistently across apps

## See Also

- [Shared Components Catalog](../README.md)
- [Navigation Patterns](../../hooks/useNavigation.ts)
- [WCAG Navigation Guidelines](https://www.w3.org/WAI/tutorials/menus/)
