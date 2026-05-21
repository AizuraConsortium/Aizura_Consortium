import { useState, useEffect } from 'react';
import { Twitter, MessageCircle, Github, Send, Check, Loader2, ExternalLink } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../../shared/components/ToastProvider';

interface SocialConnection {
  platform: 'twitter' | 'discord' | 'github' | 'telegram';
  connected: boolean;
  username?: string;
  verified: boolean;
  connectionPoints: number;
  verificationPoints: number;
}

interface SocialConnectionsProps {
  userId: string;
}

const PLATFORM_CONFIG = {
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    color: '#1DA1F2',
    connectionPoints: 150,
    verificationPoints: 75,
    verificationText: 'Follow @AizuraAI',
    connectText: 'Connect Twitter',
  },
  discord: {
    name: 'Discord',
    icon: MessageCircle,
    color: '#5865F2',
    connectionPoints: 150,
    verificationPoints: 50,
    verificationText: 'Join Server',
    connectText: 'Connect Discord',
  },
  github: {
    name: 'GitHub',
    icon: Github,
    color: '#333333',
    connectionPoints: 100,
    verificationPoints: 0,
    verificationText: '',
    connectText: 'Connect GitHub',
  },
  telegram: {
    name: 'Telegram',
    icon: Send,
    color: '#0088cc',
    connectionPoints: 100,
    verificationPoints: 50,
    verificationText: 'Subscribe Channel',
    connectText: 'Connect Telegram',
  },
};

export function SocialConnections({ userId }: SocialConnectionsProps) {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadConnections();
  }, [userId]);

  async function loadConnections() {
    try {
      const data = await api.get<{ connections: SocialConnection[] }>(`/client/airdrop/social/connections`);
      setConnections(data.connections || []);
    } catch (error) {
      console.error('Failed to load social connections:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect(platform: string) {
    setConnecting(platform);
    try {
      const data = await api.post<{ authUrl: string }>(`/client/airdrop/connect/${platform}/initiate`, {});
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Failed to connect:', error);
      showToast('Failed to connect to ' + platform, 'error');
    } finally {
      setConnecting(null);
    }
  }

  async function handleVerify(platform: string) {
    setVerifying(platform);
    try {
      const data = await api.post<{ verified: boolean; pointsAwarded: number }>(`/client/airdrop/verify/${platform}`, {});
      if (data.verified) {
        showToast(`${PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG].name} verification complete! +${data.pointsAwarded} points`, 'success');
        loadConnections();
      } else {
        showToast('Verification incomplete. Please complete the required actions.', 'warning');
      }
    } catch (error) {
      console.error('Failed to verify:', error);
      showToast('Verification failed', 'error');
    } finally {
      setVerifying(null);
    }
  }

  async function handleDisconnect(platform: string) {
    if (!confirm(`Disconnect ${PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG].name}? Your earned points will remain.`)) {
      return;
    }

    try {
      await api.post(`/client/airdrop/disconnect/${platform}`, {});
      showToast(`${PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG].name} disconnected`, 'success');
      loadConnections();
    } catch (error) {
      console.error('Failed to disconnect:', error);
      showToast('Failed to disconnect', 'error');
    }
  }

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Social Connections</h3>
      <p className="text-sm text-slate-400 mb-6">
        Connect your social accounts to earn points and verify your engagement with the Aizura community.
      </p>

      <div className="space-y-4">
        {Object.entries(PLATFORM_CONFIG).map(([key, config]) => {
          const connection = connections.find(c => c.platform === key);
          const Icon = config.icon;
          const isConnected = connection?.connected || false;
          const isVerified = connection?.verified || false;
          const isConnecting = connecting === key;
          const isVerifying = verifying === key;

          return (
            <div
              key={key}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-white">{config.name}</h4>
                    {isConnected && (
                      <Check className="w-4 h-4 text-green-400" />
                    )}
                  </div>

                  {isConnected && connection?.username ? (
                    <p className="text-xs text-slate-400 mb-3">
                      Connected as <span className="text-white font-medium">@{connection.username}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 mb-3">Not connected</p>
                  )}

                  <div className="space-y-2">
                    {!isConnected ? (
                      <button
                        onClick={() => handleConnect(key)}
                        disabled={isConnecting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            {config.connectText} (+{config.connectionPoints} pts)
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="space-y-2">
                        {config.verificationPoints > 0 && !isVerified && (
                          <button
                            onClick={() => handleVerify(key)}
                            disabled={isVerifying}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isVerifying ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                {config.verificationText} (+{config.verificationPoints} pts)
                              </>
                            )}
                          </button>
                        )}

                        {isVerified && config.verificationPoints > 0 && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 text-green-300 text-sm rounded-lg">
                            <Check className="w-4 h-4" />
                            Verified
                          </div>
                        )}

                        <button
                          onClick={() => handleDisconnect(key)}
                          className="w-full text-xs text-slate-400 hover:text-slate-300 transition-colors"
                        >
                          Disconnect
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-slate-300">
          <strong className="text-white">Tip:</strong> Connect all platforms and verify your engagement to maximize your airdrop allocation!
        </p>
      </div>
    </div>
  );
}
