import { Home, FileText, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-slate-900">Client Portal</h1>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/proposals"
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
              >
                <FileText className="w-4 h-4" />
                <span>My Proposals</span>
              </Link>
              <Link
                to="/governance"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Governance</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
