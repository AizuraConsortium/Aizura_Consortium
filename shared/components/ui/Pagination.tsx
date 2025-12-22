/**
 * Pagination Component
 *
 * Reusable pagination component with customization options.
 * Supports first/last page buttons, page numbers, different sizes, and styling variants.
 */

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  offset: number;
  limit: number;
  total: number;
  onPageChange: (offset: number) => void;
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
}

export function Pagination({
  offset,
  limit,
  total,
  onPageChange,
  showFirstLast = false,
  showPageNumbers = true,
  className = '',
  size = 'md',
  variant = 'default'
}: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const start = offset + 1;
  const end = Math.min(offset + limit, total);

  const handleFirst = () => onPageChange(0);
  const handlePrevious = () => onPageChange(Math.max(0, offset - limit));
  const handleNext = () => onPageChange(offset + limit);
  const handleLast = () => onPageChange((totalPages - 1) * limit);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const buttonBaseClass = 'border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition';

  const variantClasses = {
    default: 'border-gray-300',
    minimal: 'border-transparent hover:border-gray-300'
  };

  const buttonClass = `${buttonBaseClass} ${variantClasses[variant]} ${sizeClasses[size]}`;

  const containerClass = variant === 'default'
    ? `flex items-center justify-between px-6 py-4 border-t border-gray-200 ${className}`
    : `flex items-center justify-between ${className}`;

  return (
    <div className={containerClass}>
      <div className={`text-gray-600 ${sizeClasses[size]}`}>
        {total > 0 ? (
          <>Showing {start}-{end} of {total}</>
        ) : (
          <>No items</>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {showFirstLast && (
          <button
            onClick={handleFirst}
            disabled={offset === 0}
            className={buttonClass}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={handlePrevious}
          disabled={offset === 0}
          className={buttonClass}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {showPageNumbers && (
          <span className={`text-gray-600 ${sizeClasses[size]}`}>
            Page {currentPage} of {totalPages || 1}
          </span>
        )}

        <button
          onClick={handleNext}
          disabled={offset + limit >= total}
          className={buttonClass}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {showFirstLast && (
          <button
            onClick={handleLast}
            disabled={offset + limit >= total}
            className={buttonClass}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Backwards compatibility export for admin
 * Adapts the Pagination component to the old PaginationControls interface
 */
export interface PaginationControlsProps {
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  onPageChange: (offset: number) => void;
  showFirstLast?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
}

export function PaginationControls({
  pagination,
  onPageChange,
  showFirstLast,
  size,
  variant
}: PaginationControlsProps) {
  return (
    <Pagination
      offset={pagination.offset}
      limit={pagination.limit}
      total={pagination.total}
      onPageChange={onPageChange}
      showFirstLast={showFirstLast}
      size={size}
      variant={variant}
    />
  );
}
