interface DevBannerProps {
  environment: 'development' | 'staging' | 'production';
  tenant: 'admin' | 'client' | 'website';
}

export function DevBanner({ environment, tenant }: DevBannerProps) {
  if (environment === 'production') {
    return null;
  }

  const envColors = {
    development: 'bg-blue-600',
    staging: 'bg-yellow-600',
    production: 'bg-green-600',
  };

  const tenantLabels = {
    admin: 'Admin Portal',
    client: 'Client Portal',
    website: 'Public Website',
  };

  return (
    <div
      className={`${envColors[environment]} text-white text-xs font-medium px-4 py-1 text-center`}
      role="banner"
    >
      <span className="uppercase tracking-wide">{environment}</span>
      <span className="mx-2">•</span>
      <span>{tenantLabels[tenant]}</span>
    </div>
  );
}
