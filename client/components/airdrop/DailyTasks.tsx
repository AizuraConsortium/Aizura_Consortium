import { useState, useEffect } from 'react';
import { Check, Clock, Flame, Loader2, Calendar } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../../shared/components/ToastProvider';

interface DailyTask {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  progress?: number;
  maxProgress?: number;
}

interface TasksData {
  tasks: DailyTask[];
  loginStreak: number;
  nextStreakBonus: number;
  daysUntilBonus: number;
  lastLogin: string;
}

interface DailyTasksProps {
  userId: string;
}

export function DailyTasks({ userId }: DailyTasksProps) {
  const [data, setData] = useState<TasksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadTasks();
  }, [userId]);

  async function loadTasks() {
    try {
      const taskData = await api.get<TasksData>(`/client/airdrop/daily-tasks`);
      setData(taskData);
    } catch (error) {
      console.error('Failed to load daily tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function claimTask(taskId: string) {
    setClaiming(taskId);
    try {
      const result = await api.post<{ pointsAwarded: number }>(`/client/airdrop/daily-tasks/${taskId}/claim`, {});
      showToast(`Task completed! +${result.pointsAwarded} points`, 'success');
      loadTasks();
    } catch (error) {
      console.error('Failed to claim task:', error);
      showToast('Failed to claim task', 'error');
    } finally {
      setClaiming(null);
    }
  }

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const streakProgress = (data.loginStreak / (data.loginStreak + data.daysUntilBonus)) * 100;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Daily Tasks</h3>

      <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Flame className="w-6 h-6 text-orange-400" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-white">Login Streak</span>
              <span className="text-lg font-bold text-orange-400">
                {data.loginStreak} {data.loginStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                style={{ width: `${streakProgress}%` }}
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-300">
          <strong className="text-orange-300">{data.daysUntilBonus} more {data.daysUntilBonus === 1 ? 'day' : 'days'}</strong> for a bonus of <strong className="text-orange-300">+{data.nextStreakBonus} points!</strong>
        </p>
      </div>

      <div className="space-y-3">
        {data.tasks.map((task) => {
          const hasProgress = task.maxProgress !== undefined;
          const progressPercent = hasProgress
            ? ((task.progress || 0) / task.maxProgress!) * 100
            : task.completed ? 100 : 0;

          return (
            <div
              key={task.id}
              className={`bg-white/5 border border-white/10 rounded-xl p-4 transition-all ${
                task.completed ? 'opacity-60' : 'hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {task.completed ? (
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-600 flex items-center justify-center">
                      {claiming === task.id ? (
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                      ) : (
                        <Clock className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-white">
                      {task.title}
                    </h4>
                    <span className="text-sm font-bold text-green-400 whitespace-nowrap">
                      +{task.points} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">
                    {task.description}
                  </p>

                  {hasProgress && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{task.progress} / {task.maxProgress}</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {!task.completed && progressPercent === 100 && (
                    <button
                      onClick={() => claimTask(task.id)}
                      disabled={claiming === task.id}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium disabled:opacity-50"
                    >
                      Claim Reward →
                    </button>
                  )}

                  {!task.completed && progressPercent < 100 && (
                    <a
                      href="#"
                      className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
                    >
                      Complete task →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-start gap-2">
          <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate-300">
              <strong className="text-white">New tasks daily!</strong> Complete tasks to earn bonus points.
              Tasks reset at midnight UTC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
