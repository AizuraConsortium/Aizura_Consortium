import { useState, useEffect } from 'react';
import { Copy, Share2, Twitter, MessageCircle, Check, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../../shared/components/ToastProvider';
import { MilestoneCard } from './MilestoneCard';
import { EnhancedReferralEntry } from './EnhancedReferralEntry';
import { ReferralDetailsModal } from './ReferralDetailsModal';

interface ReferralStats {
  referralCode: string;
  referralUrl: string;
  totalReferrals: number;
  qualifiedReferrals: number;
  pendingReferrals: number;
  totalPointsEarned: number;
  referrals: ReferralEntry[];
}

interface ReferralEntry {
  username: string;
  status: 'pending' | 'qualified' | 'active';
  points: number;
  progress: number;
  joinedAt: string;
  connectedSocials?: string[];
  milestonesAchieved?: string[];
}

interface ReferralCardProps {
  userId: string;
}

export function ReferralCard({ userId }: ReferralCardProps) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<ReferralEntry | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadReferralStats();
  }, [userId]);

  async function loadReferralStats() {
    try {
      const response = await api.get(`/client/airdrop/referrals/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load referral stats:', error);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, type: 'code' | 'url') {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
    showToast('Copied to clipboard!', 'success');
  }

  function shareToTwitter() {
    if (!stats) return;
    const text = `Join me on @AizuraAI's airdrop and earn AAIC tokens! 🚀\n\nUse my referral code: ${stats.referralCode}\n\n`;
    const url = stats.referralUrl;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  }

  function shareToDiscord() {
    if (!stats) return;
    const text = `Join me on Aizura's airdrop and earn AAIC tokens! 🚀\n\nUse my referral code: **${stats.referralCode}**\n${stats.referralUrl}`;
    copyToClipboard(text, 'code');
    showToast('Message copied! Paste it in Discord', 'success');
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'qualified':
      case 'active':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
    }
  }

  function checkMilestone(referrals: ReferralEntry[], milestone: string): number {
    return referrals.filter(r =>
      r.milestonesAchieved && r.milestonesAchieved.includes(milestone)
    ).length;
  }

  function calculateSocialProgress(referrals: ReferralEntry[]): number {
    const total = referrals.length;
    if (total === 0) return 0;
    const qualified = checkMilestone(referrals, '2_socials');
    return Math.round((qualified / total) * 100);
  }

  function calculatePointsProgress(referrals: ReferralEntry[], target: number): number {
    const total = referrals.length;
    if (total === 0) return 0;
    const qualified = referrals.filter(r => r.points >= target).length;
    return Math.round((qualified / total) * 100);
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

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <h3 className="text-xl font-bold text-white mb-6">Referral Program</h3>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6">
          <label className="text-sm font-medium text-slate-300 mb-2 block">
            Your Referral Code
          </label>
          <div className="flex items-center gap-2 mb-4">
            <code className="flex-1 text-2xl font-bold text-white bg-black/20 px-4 py-3 rounded-lg">
              {stats.referralCode}
            </code>
            <button
              onClick={() => copyToClipboard(stats.referralCode, 'code')}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors"
              title="Copy code"
            >
              {copiedCode ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>

          <label className="text-sm font-medium text-slate-300 mb-2 block">
            Referral URL
          </label>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={stats.referralUrl}
              readOnly
              className="flex-1 text-sm bg-black/20 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={() => copyToClipboard(stats.referralUrl, 'url')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors"
              title="Copy URL"
            >
              {copiedUrl ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={shareToTwitter}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-medium rounded-lg transition-colors"
            >
              <Twitter className="w-4 h-4" />
              Share on Twitter
            </button>
            <button
              onClick={shareToDiscord}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white font-medium rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Share on Discord
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white mb-1">
              {stats.totalReferrals}
            </div>
            <div className="text-xs text-slate-400">Total Referrals</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {stats.qualifiedReferrals}
            </div>
            <div className="text-xs text-slate-400">Qualified</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {stats.pendingReferrals}
            </div>
            <div className="text-xs text-slate-400">Pending</div>
          </div>
        </div>

        <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Points Earned from Referrals</span>
            <span className="text-2xl font-bold text-white">
              {stats.totalPointsEarned.toLocaleString()} pts
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-4">Referral Milestones</h4>
          <div className="space-y-3">
            <MilestoneCard
              title="2+ Social Accounts Connected"
              reward={100}
              achieved={checkMilestone(stats.referrals, '2_socials')}
              description="Referee connects Twitter + Discord"
              progress={calculateSocialProgress(stats.referrals)}
            />
            <MilestoneCard
              title="500 Points Reached"
              reward={200}
              achieved={checkMilestone(stats.referrals, '500_points')}
              description="Referee earns 500 points"
              progress={calculatePointsProgress(stats.referrals, 500)}
            />
            <MilestoneCard
              title="2000 Points Reached"
              reward={300}
              achieved={checkMilestone(stats.referrals, '2000_points')}
              description="Referee earns 2000 points"
              progress={calculatePointsProgress(stats.referrals, 2000)}
            />
          </div>
        </div>

        {stats.referrals.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">Your Referrals ({stats.referrals.length})</h4>
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {showAll ? 'Show Less' : 'Show All'}
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(showAll ? stats.referrals : stats.referrals.slice(0, 5)).map((referral, index) => (
                <EnhancedReferralEntry
                  key={index}
                  referral={referral}
                  onViewDetails={() => setSelectedReferral(referral)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-xs text-slate-300">
            <strong className="text-yellow-300">Earn 200 points</strong> for each qualified referral!
            Referrals become qualified after they earn 1,000 points through social connections and engagement.
          </p>
        </div>
      </div>

      {selectedReferral && (
        <ReferralDetailsModal
          referral={selectedReferral}
          onClose={() => setSelectedReferral(null)}
        />
      )}
    </div>
  );
}
