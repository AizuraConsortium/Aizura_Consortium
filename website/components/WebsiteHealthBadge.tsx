import { SystemHealthBadge } from '@shared/components/SystemHealthBadge';

export function WebsiteHealthBadge() {
  return (
    <SystemHealthBadge
      endpoint="/admin/system/health"
      pollingInterval={60000}
      onError={(error) => {
        console.error('Failed to fetch system health:', error);
      }}
    />
  );
}
