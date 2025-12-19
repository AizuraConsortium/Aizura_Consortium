import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { api } from '../lib/api';
import { PlanSkeleton } from '../components/skeletons/PlanSkeleton';
import { Navigation } from '../components/Navigation';

export default function PlanViewer() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topicId) {
      loadPlan();
    }
  }, [topicId]);

  const loadPlan = async () => {
    try {
      const data = await api.getPlan(topicId!);
      setPlan(data.plan);
      setSteps(data.steps);
    } catch (error) {
      console.error('Failed to load plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'blocked':
        return <Circle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-slate-500" />;
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

  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Plan not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation variant="internal" />

      <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{plan.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              plan.status === 'adopted'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : plan.status === 'final'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
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
                <h3 className="text-xl font-bold mb-4">Implementation Steps</h3>
                <div className="space-y-3">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-start space-x-3 p-3 bg-slate-900/50 rounded-lg"
                    >
                      {getStatusIcon(step.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{step.title}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {step.owner_agent_role.replace('-', ' ')}
                        </p>
                        {step.eta_days && (
                          <p className="text-xs text-slate-500 mt-1">
                            ETA: {step.eta_days} days
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
