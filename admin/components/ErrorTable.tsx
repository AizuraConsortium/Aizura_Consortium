import { Trash2, Info, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import { handleKeyboardClick } from '@shared/utils';
import type { ErrorLog } from '@shared/types';

interface ErrorTableProps {
  errors: ErrorLog[];
  onErrorClick: (error: ErrorLog) => void;
  onDelete: (id: string) => void;
}

export function ErrorTable({ errors, onErrorClick, onDelete }: ErrorTableProps) {
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'critical':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Message
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agent
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {errors.map((err) => (
            <tr
              key={err.id}
              className="hover:bg-gray-50 cursor-pointer focus-within:bg-gray-100"
              onClick={() => onErrorClick(err)}
              onKeyDown={(e) => handleKeyboardClick(e, () => onErrorClick(err))}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${err.error_type} error`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityColor(err.severity)}`}>
                  {getSeverityIcon(err.severity)}
                  <span className="capitalize">{err.severity}</span>
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900 capitalize">{err.source}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">{err.error_type}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-900 line-clamp-2">{err.message}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-500">{err.agent_id || '-'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-500">
                  {new Date(err.created_at).toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(err.id);
                  }}
                  aria-label={`Delete ${err.error_type} error`}
                  className="text-red-600 hover:text-red-700 transition"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
