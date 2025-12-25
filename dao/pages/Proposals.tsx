import { FileText } from 'lucide-react';

export default function Proposals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Proposals</h1>
        <p className="text-slate-400">
          View and track all governance proposals
        </p>
      </div>

      <div className="bg-slate-900 rounded-lg p-12 border border-slate-800 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Proposals View</h3>
        <p className="text-slate-400 max-w-md mx-auto">
          This section will display all governance proposals with filtering and status tracking.
        </p>
      </div>
    </div>
  );
}
