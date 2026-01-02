import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame,
  Code,
  BookOpen,
  Users,
  MessageCircle,
  Trophy,
  Gift,
  Zap,
  Check,
  Lock,
  Star,
  Calendar,
  TrendingUp,
  Shield,
  Crown
} from "lucide-react";

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  category: 'coding' | 'learning' | 'community' | 'mentoring';
  points: number;
  completed: boolean;
  progress: number;
  total: number;
  icon: React.ReactNode;
}

interface Streak {
  type: 'coding' | 'learning' | 'community' | 'mentoring' | 'overall';
  count: number;
  best: number;
  multiplier: number;
  lastActive: Date;
}

interface DailyQuestsProps {
  isDarkMode: boolean;
  userId: string;
}

const POINTS_KEY = 'unifiedcampus_points_';
const STREAKS_KEY = 'unifiedcampus_streaks_';
const QUESTS_KEY = 'unifiedcampus_quests_';
const FREEZE_KEY = 'unifiedcampus_freeze_';

export function DailyQuests({ isDarkMode, userId }: DailyQuestsProps) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [freezesAvailable, setFreezesAvailable] = useState(2);
  const [activeTab, setActiveTab] = useState<'quests' | 'streaks' | 'rewards'>('quests');
  const [comboMultiplier, setComboMultiplier] = useState(1);

  useEffect(() => {
    loadData();
    generateDailyQuests();
  }, [userId]);

  const loadData = () => {
    const points = localStorage.getItem(POINTS_KEY + userId);
    const savedStreaks = localStorage.getItem(STREAKS_KEY + userId);
    const savedFreezes = localStorage.getItem(FREEZE_KEY + userId);

    setTotalPoints(points ? parseInt(points) : 0);
    setFreezesAvailable(savedFreezes ? parseInt(savedFreezes) : 2);

    if (savedStreaks) {
      setStreaks(JSON.parse(savedStreaks));
    } else {
      initializeStreaks();
    }
  };

  const initializeStreaks = () => {
    const defaultStreaks: Streak[] = [
      { type: 'coding', count: 0, best: 0, multiplier: 1, lastActive: new Date() },
      { type: 'learning', count: 0, best: 0, multiplier: 1, lastActive: new Date() },
      { type: 'community', count: 0, best: 0, multiplier: 1, lastActive: new Date() },
      { type: 'mentoring', count: 0, best: 0, multiplier: 1, lastActive: new Date() },
      { type: 'overall', count: 0, best: 0, multiplier: 1, lastActive: new Date() }
    ];
    setStreaks(defaultStreaks);
    localStorage.setItem(STREAKS_KEY + userId, JSON.stringify(defaultStreaks));
  };

  const generateDailyQuests = () => {
    const today = new Date().toDateString();
    const savedQuests = localStorage.getItem(QUESTS_KEY + userId);
    
    if (savedQuests) {
      const parsed = JSON.parse(savedQuests);
      if (parsed.date === today) {
        setQuests(parsed.quests);
        return;
      }
    }

    const dailyQuests: Quest[] = [
      {
        id: 'code-1',
        title: 'Solve 2 DSA Problems',
        description: 'Complete 2 algorithm problems on any platform',
        type: 'daily',
        category: 'coding',
        points: 20,
        completed: false,
        progress: 0,
        total: 2,
        icon: <Code className="w-5 h-5" />
      },
      {
        id: 'learn-1',
        title: 'Complete a Course Module',
        description: 'Finish one module from your roadmap',
        type: 'daily',
        category: 'learning',
        points: 15,
        completed: false,
        progress: 0,
        total: 1,
        icon: <BookOpen className="w-5 h-5" />
      },
      {
        id: 'community-1',
        title: 'Help a Peer',
        description: 'Answer a doubt in any community chat',
        type: 'daily',
        category: 'community',
        points: 10,
        completed: false,
        progress: 0,
        total: 1,
        icon: <MessageCircle className="w-5 h-5" />
      },
      {
        id: 'test-1',
        title: 'Take a Practice Test',
        description: 'Complete any practice test with >70% score',
        type: 'daily',
        category: 'learning',
        points: 25,
        completed: false,
        progress: 0,
        total: 1,
        icon: <Trophy className="w-5 h-5" />
      }
    ];

    // Add special quests based on day of week
    const day = new Date().getDay();
    if (day === 0 || day === 6) { // Weekend
      dailyQuests.push({
        id: 'weekend-special',
        title: 'Weekend Warrior',
        description: 'Build a mini-project or contribute to open source',
        type: 'special',
        category: 'coding',
        points: 50,
        completed: false,
        progress: 0,
        total: 1,
        icon: <Star className="w-5 h-5" />
      });
    }

    // Random surprise quest
    const surpriseQuests = [
      {
        id: 'surprise-1',
        title: 'Interview a Mentor',
        description: 'Have a 10-min chat with any mentor',
        points: 50,
        category: 'mentoring' as const
      },
      {
        id: 'surprise-2',
        title: 'Share Your Knowledge',
        description: 'Post a helpful tip in community',
        points: 30,
        category: 'community' as const
      },
      {
        id: 'surprise-3',
        title: 'Code Review Helper',
        description: 'Review a peer\'s code',
        points: 40,
        category: 'community' as const
      }
    ];

    const surprise = surpriseQuests[Math.floor(Math.random() * surpriseQuests.length)];
    dailyQuests.push({
      id: surprise.id,
      title: `🎁 ${surprise.title}`,
      description: surprise.description,
      type: 'special',
      category: surprise.category,
      points: surprise.points,
      completed: false,
      progress: 0,
      total: 1,
      icon: <Gift className="w-5 h-5" />
    });

    setQuests(dailyQuests);
    localStorage.setItem(QUESTS_KEY + userId, JSON.stringify({ date: today, quests: dailyQuests }));
  };

  const completeQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    const updatedQuests = quests.map(q => 
      q.id === questId 
        ? { ...q, completed: true, progress: q.total }
        : q
    );

    setQuests(updatedQuests);

    // Calculate points with multiplier
    const basePoints = quest.points;
    const multiplierBonus = calculateComboMultiplier(updatedQuests);
    const earnedPoints = Math.round(basePoints * multiplierBonus);

    const newTotal = totalPoints + earnedPoints;
    setTotalPoints(newTotal);
    setComboMultiplier(multiplierBonus);

    // Update streak
    updateStreak(quest.category);

    // Save
    localStorage.setItem(POINTS_KEY + userId, newTotal.toString());
    const today = new Date().toDateString();
    localStorage.setItem(QUESTS_KEY + userId, JSON.stringify({ date: today, quests: updatedQuests }));
  };

  const calculateComboMultiplier = (currentQuests: Quest[]): number => {
    const completedCategories = new Set(
      currentQuests.filter(q => q.completed).map(q => q.category)
    );

    if (completedCategories.size >= 3) return 5; // Mega combo
    if (completedCategories.size === 2) return 2; // Good combo
    return 1; // Normal
  };

  const updateStreak = (category: string) => {
    const updatedStreaks = streaks.map(streak => {
      if (streak.type === category || streak.type === 'overall') {
        const newCount = streak.count + 1;
        const newBest = Math.max(newCount, streak.best);
        const newMultiplier = Math.floor(newCount / 7) + 1; // +1 multiplier every 7 days

        return {
          ...streak,
          count: newCount,
          best: newBest,
          multiplier: newMultiplier,
          lastActive: new Date()
        };
      }
      return streak;
    });

    setStreaks(updatedStreaks);
    localStorage.setItem(STREAKS_KEY + userId, JSON.stringify(updatedStreaks));
  };

  const useStreakFreeze = (streakType: string) => {
    if (freezesAvailable <= 0) return;

    setFreezesAvailable(freezesAvailable - 1);
    localStorage.setItem(FREEZE_KEY + userId, (freezesAvailable - 1).toString());

    // Extend streak protection
    alert(`Streak Freeze activated for ${streakType}! You have 7 days protection.`);
  };

  const getStreakIcon = (type: string) => {
    switch (type) {
      case 'coding': return <Code className="w-6 h-6" />;
      case 'learning': return <BookOpen className="w-6 h-6" />;
      case 'community': return <Users className="w-6 h-6" />;
      case 'mentoring': return <MessageCircle className="w-6 h-6" />;
      default: return <Flame className="w-6 h-6" />;
    }
  };

  const renderQuests = () => (
    <div className="space-y-4">
      {/* Combo Multiplier */}
      {comboMultiplier > 1 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`p-4 rounded-xl ${
            isDarkMode ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-yellow-500" />
            <div>
              <h4 className="font-bold text-yellow-700 dark:text-yellow-400">
                {comboMultiplier}x Combo Active!
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete quests from different categories for multiplier bonus
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quest List */}
      <div className="space-y-3">
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-5 rounded-xl border-2 ${
              quest.completed
                ? isDarkMode ? 'bg-green-900/20 border-green-500/30' : 'bg-green-50 border-green-200'
                : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  quest.completed ? 'bg-green-500' :
                  quest.type === 'special' ? 'bg-purple-500' :
                  'bg-blue-500'
                } text-white`}>
                  {quest.icon}
                </div>
                <div>
                  <h3 className="font-bold mb-1">{quest.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{quest.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                  quest.type === 'special' ? 'bg-purple-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  +{quest.points} pts
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {!quest.completed && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{quest.progress} / {quest.total}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={() => completeQuest(quest.id)}
              disabled={quest.completed}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                quest.completed
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg'
              }`}
            >
              {quest.completed ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  Completed
                </span>
              ) : (
                'Mark as Complete'
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderStreaks = () => (
    <div className="space-y-4">
      {streaks.map((streak, index) => (
        <motion.div
          key={streak.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`p-6 rounded-xl border-2 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                streak.count > 0 ? 'bg-orange-500' : 'bg-gray-400'
              } text-white`}>
                {getStreakIcon(streak.type)}
              </div>
              <div>
                <h3 className="font-bold capitalize">{streak.type} Streak</h3>
                <p className="text-sm text-gray-500">
                  Best: {streak.best} days • Multiplier: {streak.multiplier}x
                </p>
              </div>
            </div>

            {streak.count > 0 && (
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-500">{streak.count}</div>
                <p className="text-xs text-gray-500">days</p>
              </div>
            )}
          </div>

          {/* Streak Progress */}
          <div className="mb-4">
            <div className="flex gap-1">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded ${
                    i < streak.count
                      ? 'bg-orange-500'
                      : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">30-day view</p>
          </div>

          {/* Freeze Option */}
          {streak.count >= 7 && (
            <button
              onClick={() => useStreakFreeze(streak.type)}
              disabled={freezesAvailable <= 0}
              className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                freezesAvailable > 0
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Shield className="w-5 h-5" />
              Use Streak Freeze ({freezesAvailable} available)
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-4">
      <div className={`p-6 rounded-xl ${
        isDarkMode ? 'bg-gradient-to-r from-yellow-900 to-orange-900' : 'bg-gradient-to-r from-yellow-400 to-orange-400'
      } text-white`}>
        <div className="flex items-center gap-4 mb-4">
          <Crown className="w-12 h-12" />
          <div>
            <h3 className="text-2xl font-bold">Your Points</h3>
            <p className="text-sm opacity-90">Earn points to unlock rewards</p>
          </div>
        </div>
        <div className="text-5xl font-bold">{totalPoints.toLocaleString()}</div>
      </div>

      {/* Reward Shop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'Streak Freeze', cost: 100, icon: <Shield className="w-6 h-6" />, available: true },
          { name: 'Priority Mentor Access', cost: 500, icon: <Star className="w-6 h-6" />, available: totalPoints >= 500 },
          { name: 'Premium Course', cost: 1000, icon: <BookOpen className="w-6 h-6" />, available: totalPoints >= 1000 },
          { name: 'Certificate Badge', cost: 200, icon: <Trophy className="w-6 h-6" />, available: totalPoints >= 200 },
          { name: 'Profile Highlight', cost: 300, icon: <Crown className="w-6 h-6" />, available: totalPoints >= 300 },
          { name: 'Cash Out (₹100)', cost: 10000, icon: <TrendingUp className="w-6 h-6" />, available: totalPoints >= 10000 }
        ].map((reward, index) => (
          <motion.div
            key={reward.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`p-5 rounded-xl border-2 ${
              reward.available
                ? isDarkMode ? 'bg-gray-800 border-green-500/30' : 'bg-white border-green-200'
                : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  reward.available ? 'bg-green-500' : 'bg-gray-400'
                } text-white`}>
                  {reward.available ? reward.icon : <Lock className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold">{reward.name}</h4>
                  <p className="text-sm text-gray-500">{reward.cost} points</p>
                </div>
              </div>
            </div>

            <button
              disabled={!reward.available}
              className={`w-full px-4 py-2 rounded-lg font-medium ${
                reward.available
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {reward.available ? 'Redeem' : 'Locked'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-900 to-red-900' : 'bg-gradient-to-r from-orange-500 to-red-500'} rounded-2xl shadow-lg p-8 text-white`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Daily Quests</h2>
            <p className="text-sm opacity-90">Complete quests to earn points and build streaks</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">{totalPoints} points</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5" />
            <span className="font-semibold">{streaks.find(s => s.type === 'overall')?.count || 0} day streak</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('quests')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'quests'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
              : isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Trophy className="w-5 h-5 inline mr-2" />
          Quests
        </button>
        <button
          onClick={() => setActiveTab('streaks')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'streaks'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
              : isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Flame className="w-5 h-5 inline mr-2" />
          Streaks
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'rewards'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
              : isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Gift className="w-5 h-5 inline mr-2" />
          Rewards
        </button>
      </div>

      {/* Content */}
      {activeTab === 'quests' && renderQuests()}
      {activeTab === 'streaks' && renderStreaks()}
      {activeTab === 'rewards' && renderRewards()}
    </div>
  );
}
