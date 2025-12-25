import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@shared/components/ToastProvider';
import { Button } from '@shared/components/ui/Button';
import { Modal } from '@shared/components/ui/Modal';
import { ProposalForm } from '@shared/components/proposals/ProposalForm';
import { api } from '../../lib/api';

interface ProposalSubmitButtonProps {
  onProposalCreated?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function ProposalSubmitButton({
  onProposalCreated,
  variant = 'primary',
  size = 'md'
}: ProposalSubmitButtonProps) {
  const { session, user } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = () => {
    if (!session || !user) {
      showError('Authentication Required', 'Please sign in to submit a proposal');
      return;
    }

    setShowForm(true);
  };

  const handleSubmit = async (title: string, summary: string) => {
    if (!session) {
      showError('Session Expired', 'Please sign in again to submit your proposal');
      throw new Error('No active session');
    }

    try {
      await api.createProposal(title, summary, session.access_token);

      showSuccess(
        'Proposal Submitted!',
        'Your proposal has been submitted and is now in the queue for review'
      );

      setShowForm(false);

      if (onProposalCreated) {
        onProposalCreated();
      }
    } catch (error) {
      showError(
        'Submission Failed',
        error instanceof Error ? error.message : 'Failed to submit proposal. Please try again.'
      );
      throw error;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <>
      <Button
        onClick={handleOpenForm}
        variant={variant}
        size={size}
        className="inline-flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Submit Proposal
      </Button>

      <Modal
        isOpen={showForm}
        onClose={handleCancel}
        size="lg"
        variant="dark"
      >
        <ProposalForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          variant="dark"
          enableDrafts
        />
      </Modal>
    </>
  );
}
