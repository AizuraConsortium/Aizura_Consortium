import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, TrendingUp, Users } from 'lucide-react';

interface EarningExample {
  user_label: string;
  business: string;
  category: string;
  total_earned: number;
  usage_count: number;
  avg_per_usage: number;
}

export function RealExamplesCarousel() {
  const [examples, setExamples] = useState<EarningExample[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExamples();
  }, []);

  useEffect(() => {
    if (!isPlaying || examples.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % examples.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, examples.length]);

  async function loadExamples() {
    try {
      const response = await fetch('/api/website/u2e/examples');
      if (!response.ok) throw new Error('Failed to fetch examples');

      const data = await response.json();
      setExamples(data.examples || []);
    } catch (error) {
      console.error('Failed to load earning examples:', error);
    } finally {
      setLoading(false);
    }
  }

  function nextExample() {
    setCurrentIndex((prev) => (prev + 1) % examples.length);
  }

  function prevExample() {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length);
  }

  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading examples...</div>
        </div>
      </div>
    );
  }

  if (examples.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              Real earning examples will appear here as users earn rewards
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentExample = examples[currentIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Real User Examples</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-8 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        {/* Content */}
        <div className="relative space-y-6">
          {/* User badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-medium text-sm">{currentExample.user_label}</span>
          </div>

          {/* Main message */}
          <div>
            <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
              Earned{' '}
              <span className="text-green-400">
                {currentExample.total_earned.toLocaleString()} AAIC
              </span>{' '}
              using{' '}
              <span className="text-cyan-400">{currentExample.business}</span>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Total Usage</div>
              <div className="text-2xl font-bold text-white">
                {currentExample.usage_count}
              </div>
              <div className="text-xs text-slate-500 mt-1">actions</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Per Action</div>
              <div className="text-2xl font-bold text-cyan-400">
                {currentExample.avg_per_usage.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1">AAIC</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 col-span-2 md:col-span-1">
              <div className="text-sm text-slate-400 mb-1">Category</div>
              <div className="text-lg font-bold text-white capitalize">
                {currentExample.category}
              </div>
            </div>
          </div>

          {/* Est. value */}
          <div className="text-sm text-slate-400">
            Estimated value: ~${(currentExample.total_earned * 0.10).toFixed(2)} USD
            <span className="text-slate-500"> (at $0.10/token)</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="relative flex items-center justify-between mt-6">
          <button
            onClick={prevExample}
            className="p-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            aria-label="Previous example"
          >
            <ChevronLeft className="w-5 h-5 text-slate-300" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {examples.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-cyan-400'
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
                aria-label={`Go to example ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextExample}
            className="p-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            aria-label="Next example"
          >
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Note */}
      <p className="text-xs text-slate-500 text-center">
        Examples are anonymized and aggregated from real user data over the last 30 days
      </p>
    </div>
  );
}
