import { Link } from 'react-router-dom';
import { FileText, Shield } from 'lucide-react';

export function MethodologyLink({
  claim,
  section
}: {
  claim: string;
  section?: string;
}) {
  const href = section ? `/resources/methodology#${section}` : '/resources/methodology';

  return (
    <Link
      to={href}
      className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
    >
      <FileText className="w-3 h-3" />
      <span>View {claim} Methodology</span>
    </Link>
  );
}

export function DataSourceBadge() {
  return (
    <Link
      to="/resources/methodology"
      className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded text-xs hover:bg-cyan-500/20 transition-colors"
    >
      <Shield className="w-3 h-3" />
      <span>Verified Data</span>
    </Link>
  );
}
