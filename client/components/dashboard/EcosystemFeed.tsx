import { CheckCircle, Rocket, Vote, TrendingUp } from 'lucide-react';

interface FeedItem {
  id: string;
  type: 'proposal' | 'business' | 'governance';
  title: string;
  timestamp: string;
}

interface EcosystemFeedProps {
  items: FeedItem[];
}

export function EcosystemFeed({ items }: EcosystemFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'proposal':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'business':
        return <Rocket className="w-5 h-5 text-cyan-400" />;
      case 'governance':
        return <Vote className="w-5 h-5 text-blue-400" />;
      default:
        return <TrendingUp className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-cyan-400" />
        <h3 className="text-lg font-bold text-white">Ecosystem Activity</h3>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 pb-4 border-b border-slate-700 last:border-0 last:pb-0"
          >
            <div className="flex-shrink-0 mt-1">{getIcon(item.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium">{item.title}</p>
              <p className="text-xs text-slate-500 mt-1">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <a
          href="/room"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
        >
          Watch AI Consortium Live →
        </a>
      </div>
    </div>
  );
}
