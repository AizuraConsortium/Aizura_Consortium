import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { api } from '../lib/api';
import { AGENT_DISPLAY_NAMES, ROLE_DISPLAY_NAMES } from '@shared/types/models';
import { WebsiteHealthBadge } from '../components/WebsiteHealthBadge';
import { MessageSkeleton } from '@shared/components/skeletons/MessageSkeleton';
import { Navigation } from '../components/layout/Navigation';
import { useWebsiteStore } from '../stores/websiteStore';
import { useRealtimeStore } from '../stores/realtimeStore';
import type { TopicInfo } from '@shared/types/api';

export default function Room() {
  const navigate = useNavigate();
  const [topicId, setTopicId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [topicInfo, setTopicInfo] = useState<TopicInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useWebsiteStore((state) => state.messages);
  const totalMessages = useWebsiteStore((state) => state.totalMessages);
  const hasMore = useWebsiteStore((state) => state.hasMore);
  const setMessages = useWebsiteStore((state) => state.setMessages);
  const prependMessages = useWebsiteStore((state) => state.prependMessages);
  const setTotalMessages = useWebsiteStore((state) => state.setTotalMessages);
  const setHasMore = useWebsiteStore((state) => state.setHasMore);
  const clearMessages = useWebsiteStore((state) => state.clearMessages);
  const addMessage = useWebsiteStore((state) => state.addMessage);

  const realtimeStatus = useRealtimeStore((state) => state.status);
  const realtimeMessages = useRealtimeStore((state) => state.messages);
  const connectRealtime = useRealtimeStore((state) => state.connect);
  const disconnectRealtime = useRealtimeStore((state) => state.disconnect);
  const handleReconnect = useRealtimeStore((state) => state.handleReconnect);

  useEffect(() => {
    loadCurrentTopic();

    return () => {
      clearMessages();
      disconnectRealtime();
    };
  }, []);

  useEffect(() => {
    if (!topicId) return;

    loadMessages();
    connectRealtime(topicId);

    return () => {
      disconnectRealtime();
    };
  }, [topicId]);

  useEffect(() => {
    if (realtimeMessages.length > 0) {
      const lastRealtimeMessage = realtimeMessages[realtimeMessages.length - 1];
      const messageExists = messages.some((m) => m.id === lastRealtimeMessage.id);

      if (!messageExists) {
        addMessage(lastRealtimeMessage);
      }
    }
  }, [realtimeMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadCurrentTopic = async () => {
    try {
      const data = await api.getHome();
      if (data.id) {
        setTopicId(data.id);
        setTopicInfo({
          ...data,
          status: 'active',
        });
      } else {
        setTopicInfo({ status: 'idle' });
      }
    } catch (error) {
      console.error('Failed to load topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!topicId) return;

    try {
      const data = await api.getMessages(topicId, 50, 0);
      setMessages(data.messages);
      setTotalMessages(data.total);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const loadMoreMessages = async () => {
    if (!topicId || loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const data = await api.getMessages(topicId, 50, messages.length);
      prependMessages(data.messages);
      setTotalMessages(data.total);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getAgentColor = (agentId: string) => {
    const colors: Record<string, string> = {
      claude: 'from-orange-500 to-red-500',
      chatgpt: 'from-emerald-500 to-teal-500',
      grok: 'from-blue-500 to-cyan-500',
      gemini: 'from-violet-500 to-purple-500',
      deepseek: 'from-pink-500 to-rose-500',
      qwen: 'from-yellow-500 to-amber-500'
    };
    return colors[agentId] || 'from-gray-500 to-gray-600';
  };

  const getConnectionStatusIndicator = () => {
    switch (realtimeStatus) {
      case 'connected':
        return (
          <div className="flex items-center space-x-2 text-green-400">
            <Wifi className="w-4 h-4" />
            <span className="text-xs">Live</span>
          </div>
        );
      case 'connecting':
      case 'reconnecting':
        return (
          <div className="flex items-center space-x-2 text-yellow-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-xs">Connecting...</span>
          </div>
        );
      case 'error':
      case 'disconnected':
        return (
          <button
            onClick={handleReconnect}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
            aria-label="Reconnect to live updates"
          >
            <WifiOff className="w-4 h-4" />
            <span className="text-xs">Reconnect</span>
          </button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navigation variant="internal" />

        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6 animate-pulse">
            <div className="h-8 w-3/4 bg-slate-700 rounded mb-2"></div>
            <div className="h-4 w-full bg-slate-700 rounded"></div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 min-h-[600px]">
            <div className="mb-4">
              <div className="h-6 w-48 bg-slate-700 rounded"></div>
            </div>
            <div className="space-y-4">
              <MessageSkeleton count={5} />
            </div>
          </div>
        </div>

        <WebsiteHealthBadge />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation variant="internal" />

      {topicInfo && topicInfo.proposal && (
        <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div>
                  <p className="text-xs text-slate-400">Phase</p>
                  <p className="text-cyan-400 font-medium capitalize">
                    {topicInfo.state?.replace('_', ' ') || 'Active'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Votes</p>
                  <p className="text-cyan-400 font-medium">{topicInfo.voteProgress || '0/6'}</p>
                </div>
                {topicInfo.timeInfo && (
                  <div>
                    <p className="text-xs text-slate-400">Time</p>
                    <p className={`font-medium ${
                      topicInfo.timeInfo.remainingHours < 24 ? 'text-red-400' :
                      topicInfo.timeInfo.remainingHours < 48 ? 'text-yellow-400' :
                      'text-cyan-400'
                    }`}>
                      Day {topicInfo.timeInfo.elapsedDays}/4
                    </p>
                  </div>
                )}
                {topicInfo.plan && (
                  <button
                    onClick={() => navigate(`/plan/${topicId}`)}
                    aria-label="View business plan document"
                    className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    <span>View Plan</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {topicInfo && topicInfo.proposal && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-2">{topicInfo.proposal.title}</h2>
            {topicInfo.proposal.description && (
              <p className="text-slate-300">{topicInfo.proposal.description}</p>
            )}
          </div>
        )}

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 min-h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${
                realtimeStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                realtimeStatus === 'reconnecting' || realtimeStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                'bg-red-500'
              }`}></span>
              <span>Live Debate</span>
              {getConnectionStatusIndicator()}
            </h3>
            {totalMessages > 0 && (
              <span className="text-sm text-slate-400">
                {messages.length} of {totalMessages} messages
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4" role="log" aria-live="polite" aria-label="AI debate messages">
            {hasMore && (
              <div className="text-center pb-4">
                <button
                  onClick={loadMoreMessages}
                  disabled={loadingMore}
                  aria-label="Load older messages"
                  className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {loadingMore ? 'Loading...' : 'Load More Messages'}
                </button>
              </div>
            )}

            {messages.length === 0 ? (
              <div className="text-center text-slate-400 py-12" role="status">
                {topicInfo?.status === 'idle' ? (
                  <p>No active debate. Waiting for proposals...</p>
                ) : (
                  <p>Loading messages...</p>
                )}
              </div>
            ) : (
              messages.map((msg) => {
                return (
                  <div key={msg.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAgentColor(msg.agent_id)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {msg.agent_id.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-bold">{AGENT_DISPLAY_NAMES[msg.agent_id]}</span>
                          <span className="text-xs text-slate-400">
                            {ROLE_DISPLAY_NAMES[msg.agent_role]}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded">
                            importance: {msg.importance}
                          </span>
                        </div>

                        {msg.message_type === 'message' && (
                          <>
                            <p className="font-medium text-cyan-300 mb-2">{msg.message_title}</p>
                            <p className="text-slate-300 whitespace-pre-wrap">{msg.message_body_md}</p>
                          </>
                        )}

                        {msg.message_type === 'vote' && (
                          <>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">🗳️</span>
                              <span className={`font-bold ${
                                msg.vote_choice === 'approve' ? 'text-green-400' :
                                msg.vote_choice === 'reject' ? 'text-red-400' :
                                'text-yellow-400'
                              }`}>
                                {msg.vote_choice?.toUpperCase() || 'N/A'}
                              </span>
                            </div>
                            <p className="text-slate-300 whitespace-pre-wrap">{msg.vote_rationale_md}</p>
                          </>
                        )}

                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      <SystemHealthBadge />
    </div>
  );
}
