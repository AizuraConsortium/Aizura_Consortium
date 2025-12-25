import { Avatar } from '@shared/components/ui/Avatar';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import { Edit2, Copy, Twitter, MessageCircle, Github, Send, Check, Wallet, Calendar } from 'lucide-react';
import { useState } from 'react';
import type { UserProfile } from '@shared/types/profile';
import { useToast } from '@shared/components/ToastProvider';

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile: boolean;
  onEdit?: () => void;
}

function getTierNumber(tier: string | null): 1 | 2 | 3 | undefined {
  if (!tier) return undefined;
  if (tier.includes('1') || tier.toLowerCase().includes('gold')) return 1;
  if (tier.includes('2') || tier.toLowerCase().includes('silver')) return 2;
  if (tier.includes('3') || tier.toLowerCase().includes('bronze')) return 3;
  return undefined;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

function truncateAddress(address: string): string {
  if (address.length <= 13) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ProfileHeader({ profile, isOwnProfile, onEdit }: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const tierNumber = getTierNumber(profile.tier);

  const handleCopyAddress = async () => {
    if (!profile.wallet_address) return;

    try {
      await navigator.clipboard.writeText(profile.wallet_address);
      setCopied(true);
      showToast('Wallet address copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy address', 'error');
    }
  };

  const socialLinks = [
    {
      platform: 'twitter',
      icon: Twitter,
      username: profile.social_connections.twitter?.username,
      connected: profile.social_connections.twitter?.connected,
      color: 'text-[#1DA1F2]',
      url: profile.social_connections.twitter?.username
        ? `https://twitter.com/${profile.social_connections.twitter.username}`
        : null,
    },
    {
      platform: 'discord',
      icon: MessageCircle,
      username: profile.social_connections.discord?.username,
      connected: profile.social_connections.discord?.connected,
      color: 'text-[#5865F2]',
      url: null,
    },
    {
      platform: 'github',
      icon: Github,
      username: profile.social_connections.github?.username,
      connected: profile.social_connections.github?.connected,
      color: 'text-gray-800 dark:text-gray-200',
      url: profile.social_connections.github?.username
        ? `https://github.com/${profile.social_connections.github.username}`
        : null,
    },
    {
      platform: 'telegram',
      icon: Send,
      username: profile.social_connections.telegram?.username,
      connected: profile.social_connections.telegram?.connected,
      color: 'text-[#0088cc]',
      url: null,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-shrink-0">
          <Avatar
            src={profile.avatar_url}
            alt={profile.display_name || profile.email}
            fallback={profile.display_name || profile.email}
            size="xl"
            badge={
              tierNumber ? (
                <Badge variant="tier" tier={tierNumber} size="sm" />
              ) : undefined
            }
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white truncate">
                  {profile.display_name || 'Anonymous User'}
                </h1>
                {tierNumber && (
                  <Badge variant="tier" tier={tierNumber} size="md" />
                )}
              </div>
              {profile.bio && (
                <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
                  {profile.bio}
                </p>
              )}
            </div>
            {isOwnProfile && onEdit && (
              <Button
                variant="secondary"
                size="md"
                onClick={onEdit}
                className="flex-shrink-0"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
              {profile.wallet_address && (
                <div className="flex items-center gap-2 text-sm">
                  <Wallet className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300 font-mono">
                    {truncateAddress(profile.wallet_address)}
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label="Copy wallet address"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">
                  Joined {formatDate(profile.created_at)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                if (!social.connected) return null;

                const Icon = social.icon;
                const content = (
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors ${social.color}`}
                    title={social.username || social.platform}
                  >
                    <Icon className="w-4 h-4" />
                    {social.username && (
                      <span className="text-sm text-slate-300">
                        {social.username}
                      </span>
                    )}
                  </div>
                );

                if (social.url) {
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {content}
                    </a>
                  );
                }

                return <div key={social.platform}>{content}</div>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
