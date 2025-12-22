/**
 * Pagination Component
 *
 * Enhanced pagination component with:
 * - First/last page buttons
 * - Page numbers display
 * - Jump to page input
 * - Page size selector
 * - Different sizes and styling variants
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@shared/styles';

export interface PaginationProps {
  offset: number;
  limit: number;
  total: number;
  onPageChange: (offset: number) => void;
  onLimitChange?: (limit: number) => void;
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  showJumpToPage?: boolean;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
}

export function Pagination({
  offset,
  limit,
  total,
  onPageChange,
  onLimitChange,
  showFirstLast = false,
  showPageNumbers = true,
  showJumpToPage = false,
  showPageSizeSelector = false,
  pageSizeOptions = [10, 20, 50, 100],
  className = '',
  size = 'md',
  variant = 'default'
}: PaginationProps) {
  const [jumpToPageValue, setJumpToPageValue] = useState('');

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const start = offset + 1;
  const end = Math.min(offset + limit, total);

  const handleFirst = () => onPageChange(0);
  const handlePrevious = () => onPageChange(Math.max(0, offset - limit));
  const handleNext = () => onPageChange(offset + limit);
  const handleLast = () => onPageChange((totalPages - 1) * limit);

  const handleJumpToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange((page - 1) * limit);
      setJumpToPageValue('');
    }
  };

  const handleJumpToPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(jumpToPageValue, 10);
    if (!isNaN(page)) {
      handleJumpToPage(page);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    const currentPage = Math.floor(offset / limit) + 1;
    const newOffset = (currentPage - 1) * newLimit;
    onLimitChange?.(newLimit);
    onPageChange(Math.min(newOffset, Math.max(0, total - 1)));
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const buttonBaseClass = 'border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition';

  const variantClasses = {
    default: 'border-gray-300',
    minimal: 'border-transparent hover:border-gray-300'
  };

  const buttonClass = cn(buttonBaseClass, variantClasses[variant], sizeClasses[size]);

  const containerClass = cn(
    variant === 'default' && 'border-t border-gray-200',
    'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4',
    className
  );

  return (
    <div className={containerClass}>
      <div className="flex flex-wrap items-center gap-4">
        <div className={cn('text-gray-600', sizeClasses[size])}>
          {total > 0 ? (
            <>Showing {start}-{end} of {total}</>
          ) : (
            <>No items</>
          )}
        </div>

        {showPageSizeSelector && onLimitChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className={cn('text-gray-600', sizeClasses[size])}>
              Per page:
            </label>
            <select
              id="pageSize"
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className={cn(
                'border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                sizeClasses[size]
              )}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {showJumpToPage && (
          <form onSubmit={handleJumpToPageSubmit} className="flex items-center gap-2">
            <label htmlFor="jumpToPage" className={cn('text-gray-600', sizeClasses[size])}>
              Go to:
            </label>
            <input
              id="jumpToPage"
              type="number"
              min={1}
              max={totalPages}
              value={jumpToPageValue}
              onChange={(e) => setJumpToPageValue(e.target.value)}
              placeholder={String(currentPage)}
              className={cn(
                'w-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                sizeClasses[size]
              )}
            />
          </form>
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
          <span className={cn('text-gray-600 whitespace-nowrap', sizeClasses[size])}>
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
  onLimitChange?: (limit: number) => void;
  showFirstLast?: boolean;
  showJumpToPage?: boolean;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
}

export function PaginationControls({
  pagination,
  onPageChange,
  onLimitChange,
  showFirstLast,
  showJumpToPage,
  showPageSizeSelector,
  pageSizeOptions,
  size,
  variant
}: PaginationControlsProps) {
  return (
    <Pagination
      offset={pagination.offset}
      limit={pagination.limit}
      total={pagination.total}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      showFirstLast={showFirstLast}
      showJumpToPage={showJumpToPage}
      showPageSizeSelector={showPageSizeSelector}
      pageSizeOptions={pageSizeOptions}
      size={size}
      variant={variant}
    />
  );
}
