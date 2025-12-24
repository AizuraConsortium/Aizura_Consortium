import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  fullWidth?: boolean;
  onConnectWallet?: () => void;
}

export function PageLayout({ children, title, description, fullWidth = false, onConnectWallet }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative flex flex-col flex-1">
        <Navigation onConnectWallet={onConnectWallet} />

        <main id="main-content" className={`flex-1 ${fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} py-12`}>
          {title && (
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{title}</h1>
              {description && <p className="text-lg text-slate-300 max-w-3xl">{description}</p>}
            </div>
          )}
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
