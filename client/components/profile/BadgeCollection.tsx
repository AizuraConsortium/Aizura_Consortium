import { Badge } from '@shared/components/ui/Badge';
import {
  Crown,
  Star,
  Shield,
  Zap,
  Users,
  CheckCircle,
  FileText,
  UserPlus,
  Trophy,
  LucideIcon,
} from 'lucide-react';
import type { UserProfile } from '@shared/types/profile';

interface Achievement {
  id: string;
  type: 'tier' | 'achievement';
  title: string;
  description: string;
  icon: LucideIcon;
  unlocked: boolean;
  progress?: number;
  tier?: 1 | 2 | 3;
}

interface BadgeCollectionProps {
  profile: UserProfile;
}

const LAUNCH_DATE = new Date('2024-01-01');

function getTierFromProfile(profile: UserProfile): 1 | 2 | 3 | null {
  if (!profile.tier) return null;

  const tier = profile.tier.toLowerCase();
  if (tier.includes('1') || tier.includes('gold')) return 1;
  if (tier.includes('2') || tier.includes('silver')) return 2;
  if (tier.includes('3') || tier.includes('bronze')) return 3;

  if (profile.total_points >= 1000) return 1;
  if (profile.total_points >= 500) return 2;
  if (profile.total_points >= 0) return 3;

  return null;
}

function getTierName(tier: 1 | 2 | 3 | null): string {
  switch (tier) {
    case 1:
      return 'Gold Tier';
    case 2:
      return 'Silver Tier';
    case 3:
      return 'Bronze Tier';
    default:
      return 'No Tier';
  }
}

function getTierIcon(tier: 1 | 2 | 3 | null): LucideIcon {
  switch (tier) {
    case 1:
      return Crown;
    case 2:
      return Star;
    case 3:
      return Shield;
    default:
      return Trophy;
  }
}

function allSocialsConnected(profile: UserProfile): boolean {
  const { twitter, discord, github, telegram } = profile.social_connections;
  return !!(
    twitter?.connected &&
    discord?.connected &&
    github?.connected &&
    telegram?.connected
  );
}

function calculateAchievements(profile: UserProfile): Achievement[] {
  const tier = getTierFromProfile(profile);
  const createdAt = new Date(profile.created_at);
  const isEarlyAdopter = createdAt < LAUNCH_DATE;

  const achievements: Achievement[] = [];

  if (tier) {
    achievements.push({
      id: 'tier',
      type: 'tier',
      tier: tier,
      title: getTierName(tier),
      description: `Reached ${getTierName(tier)} with ${profile.total_points.toLocaleString()} points`,
      icon: getTierIcon(tier),
      unlocked: true,
    });
  }

  achievements.push({
    id: 'early_adopter',
    type: 'achievement',
    title: 'Early Adopter',
    description: 'Joined during the early access period',
    icon: Zap,
    unlocked: isEarlyAdopter,
  });

  const allSocials = allSocialsConnected(profile);
  achievements.push({
    id: 'social_butterfly',
    type: 'achievement',
    title: 'Social Butterfly',
    description: 'Connected all 4 social media accounts',
    icon: Users,
    unlocked: allSocials,
    progress: allSocials ? 100 : (
      [
        profile.social_connections.twitter?.connected,
        profile.social_connections.discord?.connected,
        profile.social_connections.github?.connected,
        profile.social_connections.telegram?.connected,
      ].filter(Boolean).length / 4 * 100
    ),
  });

  const topVoter = profile.activity.total_votes >= 50;
  achievements.push({
    id: 'top_voter',
    type: 'achievement',
    title: 'Top Voter',
    description: 'Cast 50 or more governance votes',
    icon: CheckCircle,
    unlocked: topVoter,
    progress: Math.min(100, (profile.activity.total_votes / 50) * 100),
  });

  const contentCreator = profile.activity.total_content_approved >= 10;
  achievements.push({
    id: 'content_creator',
    type: 'achievement',
    title: 'Content Creator',
    description: 'Had 10 or more content submissions approved',
    icon: FileText,
    unlocked: contentCreator,
    progress: Math.min(100, (profile.activity.total_content_approved / 10) * 100),
  });

  const referralChampion = profile.referral_count >= 10;
  achievements.push({
    id: 'referral_champion',
    type: 'achievement',
    title: 'Referral Champion',
    description: 'Referred 10 or more users to the platform',
    icon: UserPlus,
    unlocked: referralChampion,
    progress: Math.min(100, (profile.referral_count / 10) * 100),
  });

  return achievements;
}

export function BadgeCollection({ profile }: BadgeCollectionProps) {
  const achievements = calculateAchievements(profile);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Achievements
        </h3>
        <span className="text-sm text-slate-400">
          {unlockedCount} of {achievements.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;

          return (
            <div
              key={achievement.id}
              className={`
                relative p-4 rounded-xl border transition-all
                ${achievement.unlocked
                  ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10 hover:border-white/20'
                  : 'bg-slate-900/30 border-slate-800/50 opacity-60'
                }
              `}
              title={achievement.description}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`
                    flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                    ${achievement.unlocked
                      ? achievement.type === 'tier' && achievement.tier === 1
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : achievement.type === 'tier' && achievement.tier === 2
                        ? 'bg-gray-400/20 text-gray-400'
                        : achievement.type === 'tier' && achievement.tier === 3
                        ? 'bg-amber-700/20 text-amber-700'
                        : 'bg-blue-500/20 text-blue-500'
                      : 'bg-slate-800/50 text-slate-600'
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-slate-400 leading-snug">
                    {achievement.description}
                  </p>

                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Progress</span>
                        <span className="text-xs font-medium text-slate-400">
                          {Math.round(achievement.progress)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full transition-all duration-500"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {achievement.unlocked && achievement.type === 'tier' && (
                    <div className="mt-2">
                      <Badge
                        variant="tier"
                        tier={achievement.tier}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {achievement.unlocked && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {unlockedCount === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No achievements unlocked yet</p>
          <p className="text-sm mt-2">
            Keep participating to unlock achievements and climb the tiers!
          </p>
        </div>
      )}
    </div>
  );
}
