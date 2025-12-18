import { X, Trash2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ErrorLog {
  id: string;
  source: 'frontend' | 'backend' | 'agent';
  severity: 'info' | 'warning' | 'error' | 'critical';
  agent_id: string | null;
  error_type: string;
  message: string;
  details: any;
  topic_id: string | null;
  created_at: string;
}

interface ErrorDetailsModalProps {
  error: ErrorLog;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function ErrorDetailsModal({ error, onClose, onDelete }: ErrorDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const errorData = JSON.stringify(error, null, 2);
    navigator.clipboard.writeText(errorData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Error Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Severity</label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(error.severity)}`}>
                {error.severity.toUpperCase()}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Source</label>
              <span className="text-sm text-gray-900 capitalize">{error.source}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Error Type</label>
              <span className="text-sm text-gray-900">{error.error_type}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Timestamp</label>
              <span className="text-sm text-gray-900">
                {new Date(error.created_at).toLocaleString()}
              </span>
            </div>

            {error.agent_id && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Agent ID</label>
                <span className="text-sm text-gray-900">{error.agent_id}</span>
              </div>
            )}

            {error.topic_id && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Topic ID</label>
                <span className="text-sm text-gray-900 font-mono text-xs">{error.topic_id}</span>
              </div>
            )}

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Error ID</label>
              <span className="text-sm text-gray-900 font-mono text-xs">{error.id}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Message</label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{error.message}</p>
            </div>
          </div>

          {error.details && Object.keys(error.details).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Details</label>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-green-400 font-mono">
                  {JSON.stringify(error.details, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onDelete(error.id)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
