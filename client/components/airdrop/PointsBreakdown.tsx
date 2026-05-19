import { useState, useEffect } from 'react';
import { Users, Share2, FileText, Heart, TrendingUp, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

interface PointCategory {
  category: string;
  points: number;
  percentage: number;
  color: string;
  icon: typeof Users;
}

interface PointsBreakdownProps {
  userId: string;
}

const CATEGORY_CONFIG = {
  social: { label: 'Social', color: '#3b82f6', icon: Users },
  referrals: { label: 'Referrals', color: '#10b981', icon: Share2 },
  content: { label: 'Content', color: '#8b5cf6', icon: FileText },
  engagement: { label: 'Engagement', color: '#f59e0b', icon: Heart },
  other: { label: 'Other', color: '#6b7280', icon: TrendingUp },
};

export function PointsBreakdown({ userId }: PointsBreakdownProps) {
  const [breakdown, setBreakdown] = useState<PointCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    loadBreakdown();
  }, [userId]);

  async function loadBreakdown() {
    try {
      const response = await api.get(`/client/airdrop/points/breakdown`);
      if (response.ok) {
        const data = await response.json();
        const categories: PointCategory[] = Object.entries(data.breakdown || {}).map(
          ([key, value]: [string, any]) => {
            const config = CATEGORY_CONFIG[key as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.other;
            return {
              category: config.label,
              points: value.points,
              percentage: value.percentage,
              color: config.color,
              icon: config.icon,
            };
          }
        );
        setBreakdown(categories);
      }
    } catch (error) {
      console.error('Failed to load points breakdown:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  const totalPoints = breakdown.reduce((sum, cat) => sum + cat.points, 0);
  const maxPoints = Math.max(...breakdown.map(cat => cat.points), 1);

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Points Breakdown</h3>
        <span className="text-sm text-slate-400">
          Total: {totalPoints.toLocaleString()} pts
        </span>
      </div>

      <div className="space-y-6">
        {breakdown.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No points earned yet</p>
            <p className="text-sm text-slate-500 mt-2">
              Start by connecting your social accounts and completing tasks
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {breakdown.map((category) => {
                const Icon = category.icon;
                const widthPercent = (category.points / maxPoints) * 100;
                const isHovered = hoveredCategory === category.category;

                return (
                  <div
                    key={category.category}
                    className="group"
                    onMouseEnter={() => setHoveredCategory(category.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: category.color }} />
                        <span className="text-sm font-medium text-white">
                          {category.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">
                          {category.percentage.toFixed(1)}%
                        </span>
                        <span className="text-sm font-medium text-white min-w-[80px] text-right">
                          {category.points.toLocaleString()} pts
                        </span>
                      </div>
                    </div>
                    <div className="h-8 bg-slate-700/30 rounded-lg overflow-hidden relative">
                      <div
                        className="h-full rounded-lg transition-all duration-500 ease-out relative"
                        style={{
                          width: `${widthPercent}%`,
                          backgroundColor: category.color,
                          opacity: isHovered ? 1 : 0.8,
                        }}
                      >
                        {isHovered && (
                          <div className="absolute inset-0 bg-white/10 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Points Distribution</span>
                <button
                  onClick={() => window.location.href = '/dashboard/airdrop?tab=history'}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View Transaction History →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
