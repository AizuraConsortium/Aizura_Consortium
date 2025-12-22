import { useNavigate } from 'react-router-dom';
import { Sparkles, Home, MessageSquare, Vote, Info } from 'lucide-react';
import { BaseNavigation } from '@shared/components/layout';
import type { NavigationLink } from '@shared/types/navigation';

interface NavigationProps {
  variant?: 'home' | 'internal';
}

export function Navigation({ variant = 'internal' }: NavigationProps) {
  const navigate = useNavigate();

  const links: NavigationLink[] = [
    ...(variant === 'internal'
      ? [
          {
            id: 'home',
            label: 'Home',
            path: '/',
            icon: <Home className="w-4 h-4" />,
            ariaLabel: 'Go to home page',
          },
        ]
      : []),
    {
      id: 'room',
      label: 'Live Room',
      path: '/room',
      icon: <MessageSquare className="w-4 h-4" />,
      ariaLabel: 'Go to live debate room',
    },
    {
      id: 'governance',
      label: 'Governance',
      path: '/governance',
      icon: <Vote className="w-4 h-4" />,
      ariaLabel: 'Go to governance page',
    },
    {
      id: 'about',
      label: 'About',
      path: '/about',
      icon: <Info className="w-4 h-4" />,
      ariaLabel: 'Learn about the system',
    },
  ];

  return (
    <BaseNavigation
      brand={{
        name: 'Aizura Consortium',
        icon: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />,
        onClick: () => navigate('/'),
        ariaLabel: 'Go to home page',
      }}
      links={links}
      variant="dark"
      mobileBreakpoint="md"
      activeIndicator="border"
      position="static"
    />
  );
}
