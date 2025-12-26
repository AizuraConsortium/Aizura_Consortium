import { useState } from 'react';
import { Shield, Info } from 'lucide-react';

interface FoundationBadgeProps {
  variant?: 'full' | 'compact';
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function FoundationBadge({
  variant = 'compact',
  showTooltip = true,
  size = 'md'
}: FoundationBadgeProps) {
  const [showInfo, setShowInfo] = useState(false);

  if (variant === 'full') {
    return (
      <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-white text-sm mb-1">
              Foundation Business
            </h4>
            <p className="text-xs text-slate-300">
              Built pre-DAO to validate AI management model.
              All future businesses go through community voting.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="relative inline-flex">
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 font-medium ${sizeClasses[size]}`}>
        <Shield className={iconSizes[size]} />
        Foundation
        {showTooltip && (
          <Info
            className="w-3 h-3 cursor-help"
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
          />
        )}
      </span>

      {showInfo && showTooltip && (
        <div className="absolute z-10 bottom-full left-0 mb-2 w-64 p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-xl">
          <p className="text-xs text-slate-300">
            Foundation businesses were created before DAO governance to prove
            AI agents can manage profitable businesses. Future businesses require
            community voting.
          </p>
        </div>
      )}
    </div>
  );
}
