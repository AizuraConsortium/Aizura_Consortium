import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  onPageChange: (offset: number) => void;
}

export function PaginationControls({ pagination, onPageChange }: PaginationControlsProps) {
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const start = pagination.offset + 1;
  const end = Math.min(pagination.offset + pagination.limit, pagination.total);

  const handlePrevious = () => {
    onPageChange(Math.max(0, pagination.offset - pagination.limit));
  };

  const handleNext = () => {
    onPageChange(pagination.offset + pagination.limit);
  };

  return (
    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Showing {start}-{end} of {pagination.total}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={pagination.offset === 0}
          className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={handleNext}
          disabled={pagination.offset + pagination.limit >= pagination.total}
          className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
