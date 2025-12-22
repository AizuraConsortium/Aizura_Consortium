import { Home, FileText, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BaseNavigation } from '@shared/components/layout';
import type { NavigationLink } from '@shared/types/navigation';

export function Navigation() {
  const navigate = useNavigate();

  const links: NavigationLink[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/',
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'proposals',
      label: 'My Proposals',
      path: '/proposals',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'governance',
      label: 'Governance',
      path: '/governance',
      icon: <ThumbsUp className="w-4 h-4" />,
      highlighted: true,
    },
  ];

  return (
    <BaseNavigation
      brand={{
        name: 'Client Portal',
      }}
      links={links}
      variant="light"
      mobileBreakpoint="md"
      activeIndicator="background"
    />
  );
}
