import { useState } from 'react';
import { X, FileText, Link, Upload, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../../shared/components/ToastProvider';

interface ContentSubmissionFormProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CONTENT_TYPES = [
  { value: 'ARTICLE', label: 'Article / Blog Post', points: 500 },
  { value: 'VIDEO', label: 'Video Content', points: 750 },
  { value: 'THREAD', label: 'Twitter Thread', points: 300 },
  { value: 'TUTORIAL', label: 'Tutorial / Guide', points: 600 },
  { value: 'RESEARCH', label: 'Research / Analysis', points: 800 },
  { value: 'COMMUNITY', label: 'Community Contribution', points: 400 },
];

export function ContentSubmissionForm({ userId, onClose, onSuccess }: ContentSubmissionFormProps) {
  const [contentType, setContentType] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const selectedType = CONTENT_TYPES.find(t => t.value === contentType);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!contentType || !title || !url || !description) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      showToast('Please enter a valid URL', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('contentType', contentType);
      formData.append('title', title);
      formData.append('url', url);
      formData.append('description', description);
      if (screenshot) {
        formData.append('screenshot', screenshot);
      }

      const response = await api.post('/client/airdrop/content/submit', formData, {
        headers: {},
      });

      if (response.ok) {
        showToast('Content submitted successfully! Pending review.', 'success');
        onSuccess();
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to submit content', 'error');
      }
    } catch (error) {
      console.error('Failed to submit content:', error);
      showToast('Failed to submit content', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        return;
      }
      if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
      }
      setScreenshot(file);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Submit Content</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Content Type <span className="text-red-400">*</span>
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full bg-slate-700 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select content type</option>
              {CONTENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {selectedType && (
              <p className="text-sm text-green-400 mt-2">
                Expected Points: {selectedType.points} (upon approval)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              className="w-full bg-slate-700 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              URL <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-700 border border-white/10 text-white pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                required
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Link to your content (article, video, tweet, etc.)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your content and how it contributes to the Aizura community..."
              rows={4}
              className="w-full bg-slate-700 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 resize-none"
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              {description.length} / 500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Screenshot (Optional)
            </label>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors">
              <input
                type="file"
                id="screenshot"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="screenshot"
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <Upload className="w-8 h-8 text-slate-400" />
                {screenshot ? (
                  <div className="text-center">
                    <p className="text-sm text-white">{screenshot.name}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {(screenshot.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-white">Click to upload screenshot</p>
                    <p className="text-xs text-slate-400 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-2">Submission Guidelines</h4>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• Content must be original or properly attributed</li>
              <li>• Content must be relevant to Aizura, AI, or blockchain</li>
              <li>• No spam, plagiarism, or low-quality content</li>
              <li>• Reviews typically take 24-48 hours</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !contentType || !title || !url || !description}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Submit Content
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
