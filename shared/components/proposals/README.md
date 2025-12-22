# Proposal Components Documentation

This directory contains proposal-related components used across the Aizura Consortium applications. These components provide consistent UI for creating, viewing, and managing proposals.

## Components

### ProposalCard

**Location:** `shared/components/proposals/ProposalCard.tsx`

Displays a proposal summary in a card format with status, voting info, and actions.

**Props:**
```typescript
interface ProposalCardProps {
  proposal: Proposal;
  onViewDetails?: (proposalId: string) => void;
  onVote?: (proposalId: string, vote: 'for' | 'against') => void;
  showVoteButtons?: boolean;
  className?: string;
}
```

**Features:**
- Proposal title, summary, and status
- Vote count display with progress bars
- Status badge (pending, active, adopted, rejected)
- Optional vote buttons
- Click to view details
- Responsive layout

**Usage:**
```typescript
import { ProposalCard } from '@shared/components/proposals';

<ProposalCard
  proposal={proposal}
  onViewDetails={(id) => navigate(`/proposals/${id}`)}
  onVote={handleVote}
  showVoteButtons
/>
```

---

### ProposalForm

**Location:** `shared/components/proposals/ProposalForm.tsx`

A form for creating new proposals with validation and error handling.

**Props:**
```typescript
interface ProposalFormProps {
  onSubmit: (data: ProposalFormData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  initialValues?: Partial<ProposalFormData>;
  className?: string;
}

interface ProposalFormData {
  title: string;
  summary: string;
}
```

**Features:**
- Title and summary inputs
- Real-time validation
- Character count for summary
- Error display
- Loading state
- Draft auto-save integration

**Usage:**
```typescript
import { ProposalForm } from '@shared/components/proposals';

function CreateProposal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ProposalFormData) => {
    setLoading(true);
    setError(null);

    try {
      await api.createProposal(data);
      navigate('/proposals');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProposalForm
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
```

---

### ProposalList

**Location:** `shared/components/proposals/ProposalList.tsx`

Displays a list of proposals with filtering, sorting, and pagination.

**Props:**
```typescript
interface ProposalListProps {
  proposals: Proposal[];
  loading?: boolean;
  error?: string | null;
  onViewDetails?: (proposalId: string) => void;
  onVote?: (proposalId: string, vote: 'for' | 'against') => void;
  emptyMessage?: string;
  showVoteButtons?: boolean;
  className?: string;
}
```

**Features:**
- Renders list of ProposalCards
- Loading skeleton states
- Error display
- Empty state message
- Grid/list layout options
- Responsive design

**Usage:**
```typescript
import { ProposalList } from '@shared/components/proposals';
import { useDataFetch } from '@shared/hooks';

function ProposalsDashboard() {
  const { data, loading, error } = useDataFetch(() => api.getProposals());

  return (
    <ProposalList
      proposals={data || []}
      loading={loading}
      error={error}
      onViewDetails={(id) => navigate(`/proposals/${id}`)}
      onVote={handleVote}
      showVoteButtons
      emptyMessage="No proposals yet. Create one to get started!"
    />
  );
}
```

---

## Usage Examples

### Example 1: Dashboard with Proposals

```typescript
import { ProposalList } from '@shared/components/proposals';
import { useDataFetch } from '@shared/hooks';
import { Button } from '@shared/components';

function Dashboard() {
  const { data: proposals, loading, error, refetch } = useDataFetch(
    () => api.getProposals({ status: 'active' })
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Active Proposals</h1>
        <Button onClick={() => navigate('/proposals/new')}>
          Create Proposal
        </Button>
      </div>

      <ProposalList
        proposals={proposals || []}
        loading={loading}
        error={error}
        onViewDetails={(id) => navigate(`/proposals/${id}`)}
        showVoteButtons
      />
    </div>
  );
}
```

---

### Example 2: My Proposals Page

```typescript
import { ProposalList } from '@shared/components/proposals';
import { useAuth, useDataFetch } from '@shared/hooks';

function MyProposals() {
  const { user } = useAuth();
  const { data, loading, error } = useDataFetch(
    () => api.getProposalsByUser(user.id),
    [user.id]
  );

  return (
    <div>
      <h1>My Proposals</h1>

      <ProposalList
        proposals={data || []}
        loading={loading}
        error={error}
        onViewDetails={(id) => navigate(`/proposals/${id}`)}
        showVoteButtons={false}
        emptyMessage="You haven't created any proposals yet."
      />
    </div>
  );
}
```

---

### Example 3: Proposal Creation with Draft Save

```typescript
import { ProposalForm } from '@shared/components/proposals';
import { useLocalStorage } from '@shared/hooks';
import { useState, useEffect } from 'react';

interface ProposalDraft {
  title: string;
  summary: string;
  lastSaved: number;
}

function CreateProposal() {
  const [draft, setDraft] = useLocalStorage<ProposalDraft | null>(
    'proposal-draft',
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ProposalFormData) => {
    setLoading(true);
    setError(null);

    try {
      await api.createProposal(data);
      setDraft(null);
      navigate('/proposals');
    } catch (err) {
      setError(err.message || 'Failed to create proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Proposal</h1>

      {draft && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            Draft saved {new Date(draft.lastSaved).toLocaleString()}
          </p>
          <button
            onClick={() => setDraft(null)}
            className="text-sm text-blue-600 underline"
          >
            Clear draft
          </button>
        </div>
      )}

      <ProposalForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        initialValues={draft || undefined}
      />
    </div>
  );
}
```

---

### Example 4: Proposal Details with Voting

```typescript
import { ProposalCard } from '@shared/components/proposals';
import { ProposalVoteDisplay } from '@shared/components/governance';
import { useDataFetch } from '@shared/hooks';
import { useParams } from 'react-router-dom';

function ProposalDetails() {
  const { id } = useParams();
  const { data: proposal, loading, refetch } = useDataFetch(
    () => api.getProposal(id),
    [id]
  );

  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (vote: 'for' | 'against') => {
    setIsVoting(true);
    try {
      await api.voteOnProposal(id, vote);
      await refetch();
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!proposal) return <ErrorAlert message="Proposal not found" />;

  return (
    <div className="space-y-6">
      <ProposalCard
        proposal={proposal}
        showVoteButtons={false}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Voting</h2>

        <ProposalVoteDisplay
          votesFor={proposal.votesFor}
          votesAgainst={proposal.votesAgainst}
          totalVotes={proposal.totalVotes}
        />

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => handleVote('for')}
            disabled={isVoting}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Vote For
          </button>
          <button
            onClick={() => handleVote('against')}
            disabled={isVoting}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Vote Against
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Discussion</h2>
        {/* Discussion thread component */}
      </div>
    </div>
  );
}
```

---

## Validation

### Title Validation

- Required
- Minimum 10 characters
- Maximum 200 characters
- No special characters in leading/trailing positions

### Summary Validation

- Required
- Minimum 50 characters
- Maximum 5000 characters
- Proper formatting

**Example:**
```typescript
import { validateProposal, PROPOSAL_VALIDATION_RULES } from '@shared/utils/validation';

const validation = validateProposal(title, summary);

if (!validation.isValid) {
  setErrors(validation.errors);
  return;
}

// Proceed with submission
```

---

## Styling

### Proposal Status Colors

- **Pending:** Yellow (`bg-yellow-100`, `text-yellow-800`)
- **Active:** Blue (`bg-blue-100`, `text-blue-800`)
- **Adopted:** Green (`bg-green-100`, `text-green-800`)
- **Rejected:** Red (`bg-red-100`, `text-red-800`)
- **Expired:** Gray (`bg-gray-100`, `text-gray-800`)

### Vote Progress Bars

- **For votes:** Green (`bg-green-500`)
- **Against votes:** Red (`bg-red-500`)
- **Background:** Light gray (`bg-gray-200`)

---

## Accessibility

All proposal components include:

- Proper semantic HTML
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Color contrast compliance

**Example:**
```typescript
<button
  onClick={handleVote}
  aria-label={`Vote for proposal: ${proposal.title}`}
  disabled={isVoting}
>
  Vote For
</button>
```

---

## Best Practices

1. **Always validate** proposal data before submission
2. **Show loading states** during async operations
3. **Handle errors gracefully** with user-friendly messages
4. **Auto-save drafts** to prevent data loss
5. **Confirm destructive actions** (delete, reject)
6. **Show vote counts** to encourage participation
7. **Make status clear** with badges and colors
8. **Enable keyboard navigation** for accessibility
9. **Test responsive behavior** on mobile devices
10. **Log important actions** for audit trail

## See Also

- [Governance Components](../governance/README.md)
- [Validation Guide](../../utils/validation/README.md)
- [Shared Components Catalog](../README.md)
