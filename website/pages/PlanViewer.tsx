import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { api } from '../lib/api';
import { PlanSkeleton } from '@shared/components/skeletons/PlanSkeleton';
import { Navigation } from '../components/layout/Navigation';
import type { PlanData } from '@shared/types/api';

export default function PlanViewer() {
  const { topicId } = useParams();
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topicId) {
      loadPlan();
    }
  }, [topicId]);

  const loadPlan = async () => {
    try {
      const data = await api.getPlan(topicId!);
      setPlanData(data);
    } catch (error) {
      console.error('Failed to load plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navigation variant="internal" />

        <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <PlanSkeleton />
        </main>
      </div>
    );
  }

  if (!planData || !planData.plan) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Plan not found</div>
      </div>
    );
  }

  const { plan, topic, steps } = planData;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation variant="internal" />

      <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{topic?.title || 'Business Plan'}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              topic?.state === 'final'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {topic?.state ? topic.state.charAt(0).toUpperCase() + topic.state.slice(1) : 'Draft'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
              <div
                className="prose prose-invert prose-cyan max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(marked(plan.content_md || '') as string)
                }}
              />
            </div>
          </div>

          {steps.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Plan Structure</h3>
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-slate-900/50 rounded-lg"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        step.level === 1 ? 'bg-cyan-500/20 text-cyan-400' :
                        step.level === 2 ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {step.level}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{step.title}</p>
                        {step.content && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {step.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
