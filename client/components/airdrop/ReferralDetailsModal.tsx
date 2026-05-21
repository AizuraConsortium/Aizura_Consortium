import { X, CheckCircle, Twitter, MessageCircle, Send, Github } from 'lucide-react';
import { Modal } from '@shared/components/ui/Modal';

interface ReferralDetailsModalProps {
  referral: {
    username: string;
    status: string;
    points: number;
    progress: number;
    joinedAt: string;
    connectedSocials?: string[];
    milestonesAchieved?: Array<{
      milestone: string;
      achievedAt: string;
      pointsEarned: number;
    }>;
    activityLog?: Array<{
      date: string;
      action: string;
      points: number;
    }>;
  };
  onClose: () => void;
}

export function ReferralDetailsModal({ referral, onClose }: ReferralDetailsModalProps) {
  const getSocialIcon = (social: string) => {
    switch (social.toLowerCase()) {
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'discord': return <MessageCircle className="w-4 h-4" />;
      case 'telegram': return <Send className="w-4 h-4" />;
      case 'github': return <Github className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {referral.username}
            </h2>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span>Joined {new Date(referral.joinedAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="text-cyan-400">{referral.points} points earned</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Activity Progress</h3>
            <span className="text-2xl font-bold text-cyan-400">{referral.progress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              style={{ width: `${referral.progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">
            {referral.progress < 100
              ? `${100 - referral.progress}% to go for full qualification`
              : 'Fully qualified!'}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Connected Accounts</h3>
          <div className="grid grid-cols-2 gap-3">
            {referral.connectedSocials && referral.connectedSocials.length > 0 ? (
              referral.connectedSocials.map(social => (
                <div key={social} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-cyan-400">
                    {getSocialIcon(social)}
                  </div>
                  <span className="text-sm text-white capitalize">{social}</span>
                  <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 col-span-2">No socials connected yet</p>
            )}
          </div>
        </div>

        {referral.milestonesAchieved && referral.milestonesAchieved.length > 0 && (
          <div>
            <h3 className="font-semibold text-white mb-3">Milestones Achieved</h3>
            <div className="space-y-2">
              {referral.milestonesAchieved.map((milestone, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-sm font-medium text-white">{milestone.milestone}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(milestone.achievedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-green-400 font-bold">+{milestone.pointsEarned}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {referral.activityLog && referral.activityLog.length > 0 && (
          <div>
            <h3 className="font-semibold text-white mb-3">Recent Activity</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {referral.activityLog.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div>
                    <div className="text-sm text-white">{activity.action}</div>
                    <div className="text-xs text-slate-400">{new Date(activity.date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-sm font-semibold text-cyan-400">+{activity.points}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
