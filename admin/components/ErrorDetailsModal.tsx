import { X } from 'lucide-react';
import { handleKeyboardClick } from '@shared/utils';

interface ErrorDetailsModalProps {
  error: {
    id: string;
    source: 'frontend' | 'backend' | 'agent';
    severity: 'info' | 'warning' | 'error' | 'critical';
    error_type: string;
    message: string;
    stack_trace?: string | null;
    request_path?: string | null;
    request_method?: string | null;
    user_id?: string | null;
    endpoint?: string | null;
    query_time_ms?: number | null;
    additional_context?: string | null;
    details_metadata_json?: any;
    created_at: string;
  };
  onClose: () => void;
}

export function ErrorDetailsModal({ error, onClose }: ErrorDetailsModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'error': return 'text-orange-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Error Details</h2>
          <button
            onClick={onClose}
            onKeyDown={(e) => handleKeyboardClick(e, onClose)}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Error ID</h3>
              <p className="text-sm text-gray-900 font-mono">{error.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Source</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {error.source}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Severity</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getSeverityColor(error.severity)}`}>
                  {error.severity}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Error Type</h3>
              <p className="text-sm text-gray-900 font-mono">{error.error_type}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{error.message}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Timestamp</h3>
              <p className="text-sm text-gray-900">{formatDate(error.created_at)}</p>
            </div>

            {error.request_path && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Request Path</h3>
                <p className="text-sm text-gray-900 font-mono">{error.request_path}</p>
              </div>
            )}

            {error.request_method && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Request Method</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {error.request_method}
                </span>
              </div>
            )}

            {error.endpoint && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Endpoint</h3>
                <p className="text-sm text-gray-900 font-mono">{error.endpoint}</p>
              </div>
            )}

            {error.user_id && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">User ID</h3>
                <p className="text-sm text-gray-900 font-mono">{error.user_id}</p>
              </div>
            )}

            {error.query_time_ms !== null && error.query_time_ms !== undefined && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Query Time</h3>
                <p className="text-sm text-gray-900">{error.query_time_ms}ms</p>
              </div>
            )}

            {error.additional_context && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Context</h3>
                <p className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {error.additional_context}
                </p>
              </div>
            )}

            {error.stack_trace && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Stack Trace</h3>
                <pre className="text-xs text-gray-900 bg-gray-50 p-4 rounded-lg overflow-x-auto font-mono max-h-60">
                  {error.stack_trace}
                </pre>
              </div>
            )}

            {error.details_metadata_json && Object.keys(error.details_metadata_json).length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Metadata</h3>
                <pre className="text-xs text-gray-900 bg-gray-50 p-4 rounded-lg overflow-x-auto font-mono">
                  {JSON.stringify(error.details_metadata_json, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
