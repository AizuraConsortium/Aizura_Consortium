import { useState, useEffect } from 'react';
import { Modal } from '@shared/components/ui/Modal';
import { ModalHeader } from '@shared/components/ui/ModalHeader';
import { ModalFooter } from '@shared/components/ui/ModalFooter';
import { FormField } from '@shared/components/ui/FormField';
import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import { useToast } from '@shared/components/ToastProvider';
import { useProfileUpdate } from '@shared/hooks/useProfileUpdate';
import { api } from '../../lib/api';
import type { UserProfile, UpdateProfileData } from '@shared/types/profile';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSuccess: (updatedProfile: UserProfile) => void;
  token?: string;
}

interface ValidationErrors {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
}

const MAX_DISPLAY_NAME_LENGTH = 50;
const MAX_BIO_LENGTH = 500;

function validateDisplayName(value: string): string | undefined {
  if (!value.trim()) {
    return undefined;
  }
  if (value.length > MAX_DISPLAY_NAME_LENGTH) {
    return `Display name must be ${MAX_DISPLAY_NAME_LENGTH} characters or less`;
  }
  if (value.length < 2) {
    return 'Display name must be at least 2 characters';
  }
  return undefined;
}

function validateBio(value: string): string | undefined {
  if (value.length > MAX_BIO_LENGTH) {
    return `Bio must be ${MAX_BIO_LENGTH} characters or less`;
  }
  return undefined;
}

function validateAvatarUrl(value: string): string | undefined {
  if (!value.trim()) {
    return undefined;
  }

  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'Avatar URL must use HTTP or HTTPS protocol';
    }
  } catch {
    return 'Please enter a valid URL';
  }

  return undefined;
}

export function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSuccess,
  token,
}: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(profile.display_name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { showToast } = useToast();
  const { updateProfile, loading } = useProfileUpdate(api, token);

  useEffect(() => {
    if (isOpen) {
      setDisplayName(profile.display_name || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
      setErrors({});
      setTouched({});
    }
  }, [isOpen, profile]);

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    const displayNameError = validateDisplayName(displayName);
    if (displayNameError) {
      newErrors.display_name = displayNameError;
    }

    const bioError = validateBio(bio);
    if (bioError) {
      newErrors.bio = bioError;
    }

    const avatarUrlError = validateAvatarUrl(avatarUrl);
    if (avatarUrlError) {
      newErrors.avatar_url = avatarUrlError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });

    const newErrors = { ...errors };

    if (field === 'display_name') {
      const error = validateDisplayName(displayName);
      if (error) {
        newErrors.display_name = error;
      } else {
        delete newErrors.display_name;
      }
    } else if (field === 'bio') {
      const error = validateBio(bio);
      if (error) {
        newErrors.bio = error;
      } else {
        delete newErrors.bio;
      }
    } else if (field === 'avatar_url') {
      const error = validateAvatarUrl(avatarUrl);
      if (error) {
        newErrors.avatar_url = error;
      } else {
        delete newErrors.avatar_url;
      }
    }

    setErrors(newErrors);
  };

  const handleSave = async () => {
    setTouched({
      display_name: true,
      bio: true,
      avatar_url: true,
    });

    if (!validate()) {
      showToast('Please fix the errors before saving', 'error');
      return;
    }

    try {
      const updateData: UpdateProfileData = {
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      };

      const updatedProfile = await updateProfile(updateData);
      showToast('Profile updated successfully!', 'success');
      onSuccess(updatedProfile);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      showToast(errorMessage, 'error');
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" variant="dark">
      <ModalHeader title="Edit Profile" onClose={onClose} variant="dark" />

      <div className="p-6 space-y-5">
        <FormField
          label="Display Name"
          htmlFor="display_name"
          error={touched.display_name ? errors.display_name : undefined}
          helperText="This is how others will see your name"
          characterCount={{
            current: displayName.length,
            max: MAX_DISPLAY_NAME_LENGTH,
          }}
        >
          <Input
            id="display_name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onBlur={() => handleBlur('display_name')}
            placeholder="Enter your display name"
            maxLength={MAX_DISPLAY_NAME_LENGTH}
            disabled={loading}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </FormField>

        <FormField
          label="Bio"
          htmlFor="bio"
          error={touched.bio ? errors.bio : undefined}
          helperText="Tell others about yourself"
          characterCount={{
            current: bio.length,
            max: MAX_BIO_LENGTH,
          }}
        >
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            onBlur={() => handleBlur('bio')}
            placeholder="Write a short bio..."
            maxLength={MAX_BIO_LENGTH}
            rows={4}
            disabled={loading}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </FormField>

        <FormField
          label="Avatar URL"
          htmlFor="avatar_url"
          error={touched.avatar_url ? errors.avatar_url : undefined}
          helperText="Link to your profile picture"
        >
          <Input
            id="avatar_url"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            onBlur={() => handleBlur('avatar_url')}
            placeholder="https://example.com/avatar.jpg"
            disabled={loading}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </FormField>
      </div>

      <ModalFooter variant="dark" align="right">
        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          loading={loading}
          disabled={loading}
        >
          Save Changes
        </Button>
      </ModalFooter>
    </Modal>
  );
}
