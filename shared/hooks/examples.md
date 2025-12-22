# Shared Hooks Usage Examples

This guide provides practical, real-world examples of using shared hooks in the Aizura Consortium applications. Each example includes complete code with context and best practices.

## Table of Contents

- [useDebounce Examples](#usedebounce-examples)
- [useLocalStorage Examples](#uselocalstorage-examples)
- [useSupabaseAuth Examples](#usesupabaseauth-examples)
- [useDataFetch Examples](#usedatafetch-examples)
- [usePolling Examples](#usepolling-examples)
- [useModal Examples](#usemodal-examples)
- [Accessibility Hooks](#accessibility-hooks)
- [Advanced Patterns](#advanced-patterns)

## useDebounce Examples

### Example 1: Search with API Call

```typescript
import { useState, useEffect } from 'react';
import { useDebounce } from '@shared/hooks';
import { api } from '../lib/api';

function ProposalSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      return;
    }

    const searchProposals = async () => {
      setLoading(true);
      try {
        const data = await api.searchProposals(debouncedSearch);
        setResults(data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    searchProposals();
  }, [debouncedSearch]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search proposals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />

      {loading && <LoadingSpinner />}

      <ul>
        {results.map(proposal => (
          <li key={proposal.id}>{proposal.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Example 2: Form Validation

```typescript
import { useState, useEffect } from 'react';
import { useDebounce } from '@shared/hooks';
import { validateEmail } from '@shared/utils/validation';

function EmailInput() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const debouncedEmail = useDebounce(email, 500);

  useEffect(() => {
    if (!debouncedEmail) {
      setErrors([]);
      return;
    }

    setIsValidating(true);

    const validateAsync = async () => {
      const validation = await validateEmail(debouncedEmail);

      if (!validation.isValid) {
        setErrors(validation.errors);
      } else {
        setErrors([]);
      }

      setIsValidating(false);
    };

    validateAsync();
  }, [debouncedEmail]);

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
        className={errors.length > 0 ? 'border-red-500' : ''}
      />

      {isValidating && <span>Validating...</span>}

      {errors.length > 0 && (
        <div className="text-red-500 text-sm">
          {errors.map((error, i) => (
            <div key={i}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Example 3: Window Resize Handler

```typescript
import { useState, useEffect } from 'react';
import { useDebounce } from '@shared/hooks';

function ResponsiveGrid() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const debouncedWidth = useDebounce(windowWidth, 150);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const columns = debouncedWidth < 768 ? 1 : debouncedWidth < 1024 ? 2 : 3;

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {/* Grid items */}
    </div>
  );
}
```

## useLocalStorage Examples

### Example 1: Theme Preference

```typescript
import { useLocalStorage } from '@shared/hooks';
import { useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

function ThemeSelector() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }, [theme]);

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setTheme('light')}
        className={theme === 'light' ? 'font-bold' : ''}
      >
        Light
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={theme === 'dark' ? 'font-bold' : ''}
      >
        Dark
      </button>
      <button
        onClick={() => setTheme('system')}
        className={theme === 'system' ? 'font-bold' : ''}
      >
        System
      </button>
    </div>
  );
}
```

### Example 2: Draft Auto-Save

```typescript
import { useLocalStorage } from '@shared/hooks';
import { useEffect } from 'react';

interface ProposalDraft {
  title: string;
  summary: string;
  lastSaved: number;
}

function ProposalForm() {
  const [draft, setDraft] = useLocalStorage<ProposalDraft | null>(
    'proposal-draft',
    null
  );

  const [title, setTitle] = useState(draft?.title || '');
  const [summary, setSummary] = useState(draft?.summary || '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (title || summary) {
        setDraft({
          title,
          summary,
          lastSaved: Date.now()
        });
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, summary, setDraft]);

  const handleSubmit = async () => {
    await api.createProposal({ title, summary });
    setDraft(null);
  };

  const clearDraft = () => {
    setTitle('');
    setSummary('');
    setDraft(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      {draft && (
        <div className="text-sm text-gray-600">
          Draft saved {new Date(draft.lastSaved).toLocaleTimeString()}
          <button onClick={clearDraft}>Clear draft</button>
        </div>
      )}

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Summary"
      />

      <button type="submit">Submit Proposal</button>
    </form>
  );
}
```

### Example 3: Recent Items List

```typescript
import { useLocalStorage } from '@shared/hooks';

interface RecentItem {
  id: string;
  title: string;
  timestamp: number;
}

function useRecentItems(maxItems = 10) {
  const [recentItems, setRecentItems] = useLocalStorage<RecentItem[]>(
    'recent-items',
    []
  );

  const addRecentItem = (item: Omit<RecentItem, 'timestamp'>) => {
    setRecentItems(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      const newItems = [
        { ...item, timestamp: Date.now() },
        ...filtered
      ].slice(0, maxItems);

      return newItems;
    });
  };

  const clearRecentItems = () => {
    setRecentItems([]);
  };

  return { recentItems, addRecentItem, clearRecentItems };
}

function RecentProposals() {
  const { recentItems, addRecentItem, clearRecentItems } = useRecentItems(5);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3>Recent Proposals</h3>
        {recentItems.length > 0 && (
          <button onClick={clearRecentItems}>Clear</button>
        )}
      </div>

      {recentItems.length === 0 ? (
        <p>No recent items</p>
      ) : (
        <ul>
          {recentItems.map(item => (
            <li key={item.id}>
              <a href={`/proposals/${item.id}`}>
                {item.title}
              </a>
              <span className="text-sm text-gray-500">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## useSupabaseAuth Examples

### Example 1: Login Form

```typescript
import { useState } from 'react';
import { useSupabaseAuth } from '@shared/hooks';
import { Button, Input, ErrorAlert } from '@shared/components';

function LoginForm() {
  const { signIn, loading } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signIn(email, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" loading={loading} variant="primary">
        Sign In
      </Button>
    </form>
  );
}
```

### Example 2: Protected Dashboard

```typescript
import { useSupabaseAuth } from '@shared/hooks';
import { LoadingSpinner } from '@shared/components';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  const { user, loading, signOut } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <header className="flex justify-between items-center">
        <h1>Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user.email}</span>
          <button onClick={signOut}>Sign Out</button>
        </div>
      </header>

      <main>
        {/* Dashboard content */}
      </main>
    </div>
  );
}
```

### Example 3: Role-Based Access

```typescript
import { useSupabaseAuth } from '@shared/hooks';
import { useEffect, useState } from 'react';

interface UserRole {
  role: 'admin' | 'moderator' | 'user';
}

function useUserRole() {
  const { user } = useSupabaseAuth();
  const [role, setRole] = useState<UserRole['role'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        setRole(data?.role || 'user');
      } catch (error) {
        console.error('Failed to fetch role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  return { role, loading, isAdmin: role === 'admin', isModerator: role === 'moderator' };
}

function AdminPanel() {
  const { isAdmin, loading } = useUserRole();

  if (loading) return <LoadingSpinner />;

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Admin content */}
    </div>
  );
}
```

## useDataFetch Examples

### Example 1: Simple Data Fetching

```typescript
import { useDataFetch } from '@shared/hooks';
import { api } from '../lib/api';
import { LoadingSpinner, ErrorAlert } from '@shared/components';

function ProposalList() {
  const { data, loading, error, refetch } = useDataFetch(
    () => api.getProposals(),
    [],
    { retry: { maxAttempts: 3 } }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Proposals</h2>
        <button onClick={refetch}>Refresh</button>
      </div>

      <ul className="space-y-2">
        {data.map(proposal => (
          <li key={proposal.id}>{proposal.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Example 2: Cached Dashboard Data

```typescript
import { useDataFetch } from '@shared/hooks';
import { api } from '../lib/api';

function Dashboard() {
  const { data: stats, loading } = useDataFetch(
    () => api.getDashboardStats(),
    [],
    {
      cache: {
        enabled: true,
        ttl: 300000 // 5 minutes
      },
      retry: {
        maxAttempts: 3,
        baseDelay: 1000
      }
    }
  );

  if (loading) return <LoadingSpinner />;
  if (!stats) return null;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded shadow">
        <h3>Total Proposals</h3>
        <p className="text-3xl font-bold">{stats.totalProposals}</p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3>Active Votes</h3>
        <p className="text-3xl font-bold">{stats.activeVotes}</p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3>Participation Rate</h3>
        <p className="text-3xl font-bold">{stats.participationRate}%</p>
      </div>
    </div>
  );
}
```

### Example 3: Conditional Fetching

```typescript
import { useDataFetch } from '@shared/hooks';
import { api } from '../lib/api';
import { useState } from 'react';

function UserProfile({ userId }: { userId?: string }) {
  const [shouldFetch, setShouldFetch] = useState(!!userId);

  const { data: user, loading, error } = useDataFetch(
    () => api.getUser(userId!),
    [userId],
    {
      skip: !userId || !shouldFetch,
      onSuccess: (data) => {
        console.log('User loaded:', data);
      },
      onError: (err) => {
        console.error('Failed to load user:', err);
      }
    }
  );

  if (!userId) {
    return <p>Please select a user</p>;
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!user) return null;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## usePolling Examples

### Example 1: Real-Time Dashboard

```typescript
import { useState } from 'react';
import { usePolling } from '@shared/hooks';
import { api } from '../lib/api';

function SystemMonitor() {
  const [systemHealth, setSystemHealth] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { isPaused, pause, resume, errorCount } = usePolling(
    async () => {
      const health = await api.getSystemHealth();
      setSystemHealth(health);
    },
    5000,
    {
      enabled: autoRefresh,
      pauseWhenHidden: true,
      pauseWhenOffline: true,
      adaptivePolling: true
    }
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>System Monitor</h2>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh
          </label>

          <button onClick={isPaused ? resume : pause}>
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      {errorCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
          Connection issues detected: {errorCount} consecutive errors
        </div>
      )}

      {systemHealth && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3>Status</h3>
            <span className={`status-${systemHealth.status}`}>
              {systemHealth.status}
            </span>
          </div>

          <div>
            <h3>Last Updated</h3>
            <span>{new Date(systemHealth.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Example 2: Live Vote Counter

```typescript
import { useState } from 'react';
import { usePolling } from '@shared/hooks';
import { api } from '../lib/api';

function LiveVoteCounter({ proposalId }: { proposalId: string }) {
  const [votes, setVotes] = useState({ for: 0, against: 0 });

  usePolling(
    async () => {
      const voteData = await api.getProposalVotes(proposalId);
      setVotes(voteData);
    },
    3000,
    {
      immediate: true,
      pauseWhenHidden: true
    }
  );

  const total = votes.for + votes.against;
  const forPercentage = total > 0 ? (votes.for / total) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Live Vote Count</h3>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <span>For</span>
            <span className="font-bold">{votes.for}</span>
          </div>
          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className="bg-green-500 h-2 rounded"
              style={{ width: `${forPercentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>Against</span>
            <span className="font-bold">{votes.against}</span>
          </div>
          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className="bg-red-500 h-2 rounded"
              style={{ width: `${100 - forPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Updates every 3 seconds
      </div>
    </div>
  );
}
```

## useModal Examples

### Example 1: Confirmation Dialog

```typescript
import { useModal } from '@shared/hooks';
import { Modal, Button } from '@shared/components';

function DeleteProposalButton({ proposalId }: { proposalId: string }) {
  const { isOpen, open, close } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.deleteProposal(proposalId);
      close();
      // Show success message
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={open}>
        Delete Proposal
      </Button>

      <Modal isOpen={isOpen} onClose={close} title="Confirm Deletion">
        <p>Are you sure you want to delete this proposal?</p>
        <p className="text-sm text-gray-600">This action cannot be undone.</p>

        <div className="flex gap-2 mt-4">
          <Button onClick={close} variant="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="danger"
            loading={isDeleting}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
```

### Example 2: Form Modal

```typescript
import { useModal } from '@shared/hooks';
import { Modal, Button, Input } from '@shared/components';
import { useState } from 'react';

function CreateProposalButton() {
  const { isOpen, open, close } = useModal();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.createProposal({ title, summary });
      close();
      setTitle('');
      setSummary('');
      // Show success message
    } catch (error) {
      console.error('Failed to create proposal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={open} variant="primary">
        New Proposal
      </Button>

      <Modal isOpen={isOpen} onClose={close} title="Create Proposal">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Summary
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" onClick={close} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} variant="primary">
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
```

## Accessibility Hooks

### Example 1: Keyboard Navigation

```typescript
import { useKeyboardShortcut, useEscapeKey, useFocusTrap } from '@shared/hooks';

function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useFocusTrap(isOpen);

  useKeyboardShortcut('/', (e) => {
    e.preventDefault();
    setIsOpen(true);
  });

  useEscapeKey(() => setIsOpen(false), isOpen);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-title"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 id="search-title">Search</h2>
        <input
          type="text"
          placeholder="Type to search..."
          className="w-full px-4 py-2 border rounded"
        />
      </div>
    </div>
  );
}
```

### Example 2: Skip Navigation

```typescript
import { SkipNavigation } from '@shared/components';

function App() {
  return (
    <>
      <SkipNavigation
        links={[
          { href: '#main-content', label: 'Skip to main content' },
          { href: '#navigation', label: 'Skip to navigation' },
          { href: '#footer', label: 'Skip to footer' }
        ]}
      />

      <header id="navigation">
        {/* Navigation */}
      </header>

      <main id="main-content">
        {/* Main content */}
      </main>

      <footer id="footer">
        {/* Footer */}
      </footer>
    </>
  );
}
```

## Advanced Patterns

### Pattern 1: Combining Hooks for Smart Search

```typescript
import { useState, useEffect } from 'react';
import { useDebounce, useDataFetch, useLocalStorage } from '@shared/hooks';

function SmartSearch() {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(
    'search-history',
    []
  );

  const debouncedQuery = useDebounce(query, 300);

  const { data: results, loading } = useDataFetch(
    () => api.search(debouncedQuery),
    [debouncedQuery],
    {
      skip: !debouncedQuery || debouncedQuery.length < 2,
      cache: { enabled: true, ttl: 60000 }
    }
  );

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 2) {
      setSearchHistory(prev => {
        const filtered = prev.filter(q => q !== debouncedQuery);
        return [debouncedQuery, ...filtered].slice(0, 10);
      });
    }
  }, [debouncedQuery, setSearchHistory]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      {loading && <LoadingSpinner />}

      {!query && searchHistory.length > 0 && (
        <div>
          <h3>Recent Searches</h3>
          <ul>
            {searchHistory.map((item, i) => (
              <li key={i} onClick={() => setQuery(item)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {results && (
        <ul>
          {results.map(result => (
            <li key={result.id}>{result.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Pattern 2: Optimistic Updates with Polling

```typescript
import { useState } from 'react';
import { usePolling, useDataFetch } from '@shared/hooks';

function OptimisticVoting({ proposalId }: { proposalId: string }) {
  const [optimisticVote, setOptimisticVote] = useState<'for' | 'against' | null>(null);

  const { data: votes, refetch } = useDataFetch(
    () => api.getVotes(proposalId),
    [proposalId]
  );

  usePolling(refetch, 5000, {
    pauseWhenHidden: true
  });

  const handleVote = async (vote: 'for' | 'against') => {
    setOptimisticVote(vote);

    try {
      await api.submitVote(proposalId, vote);
      await refetch();
    } catch (error) {
      setOptimisticVote(null);
      console.error('Vote failed:', error);
    }
  };

  const displayVotes = optimisticVote
    ? {
        for: votes.for + (optimisticVote === 'for' ? 1 : 0),
        against: votes.against + (optimisticVote === 'against' ? 1 : 0)
      }
    : votes;

  return (
    <div>
      <div>For: {displayVotes.for}</div>
      <div>Against: {displayVotes.against}</div>

      <button
        onClick={() => handleVote('for')}
        disabled={!!optimisticVote}
      >
        Vote For
      </button>
      <button
        onClick={() => handleVote('against')}
        disabled={!!optimisticVote}
      >
        Vote Against
      </button>
    </div>
  );
}
```

## Best Practices Summary

1. **useDebounce**: Use for search inputs, form validation, and resize/scroll handlers
2. **useLocalStorage**: Use for user preferences, not sensitive data
3. **useSupabaseAuth**: Use once at app root, provide via context
4. **useDataFetch**: Enable caching for frequently accessed data
5. **usePolling**: Use visibility and offline detection for better performance
6. **Accessibility**: Always use focus trap and escape key handlers for modals
7. **Combine Hooks**: Hooks compose well for complex functionality
8. **Error Handling**: Always handle errors gracefully with user feedback
9. **Loading States**: Provide clear loading indicators
10. **Cleanup**: Hooks handle cleanup automatically, but be mindful of dependencies

## See Also

- [Hooks Catalog](./README.md)
- [Components Catalog](../components/README.md)
- [Shared Architecture](../README.md)
