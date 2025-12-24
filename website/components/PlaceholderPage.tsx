import { PageLayout } from './layout/PageLayout';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  comingSoon?: boolean;
}

export function PlaceholderPage({ title, description, comingSoon = false }: PlaceholderPageProps) {
  return (
    <PageLayout title={title} description={description}>
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-12">
          <Construction className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">
            {comingSoon ? 'Coming Soon' : 'Content In Development'}
          </h2>
          <p className="text-slate-300">
            This section is currently being built. Check back soon for detailed information.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
