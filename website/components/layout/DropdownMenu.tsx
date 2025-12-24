import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export interface DropdownItem {
  label: string;
  path: string;
  description?: string;
}

export interface DropdownSection {
  title?: string;
  items: DropdownItem[];
}

interface DropdownMenuProps {
  label: string;
  sections: DropdownSection[];
  ctaStrip?: {
    items: Array<{
      label: string;
      path: string;
    }>;
  };
}

export function DropdownMenu({ label, sections, ctaStrip }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      <button
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
          {sections.map((section, idx) => (
            <div key={idx} className={idx > 0 ? 'border-t border-slate-700' : ''}>
              {section.title && (
                <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </div>
              )}
              <div className="py-2">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-slate-400 mt-0.5">{item.description}</div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {ctaStrip && (
            <div className="border-t border-slate-700 bg-slate-900/50 p-3">
              <div className="space-y-2">
                {ctaStrip.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label} →
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
