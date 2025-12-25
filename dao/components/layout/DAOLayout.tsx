import { ReactNode } from 'react';
import { DAONavigation } from './DAONavigation';
import { DAOSidebar } from './DAOSidebar';

interface DAOLayoutProps {
  children: ReactNode;
}

export function DAOLayout({ children }: DAOLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <DAONavigation />
      <div className="flex">
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full" id="main-content">
          {children}
        </main>
        <DAOSidebar />
      </div>
    </div>
  );
}
