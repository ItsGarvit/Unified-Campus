import { motion } from "motion/react";
import { 
  TrendingUp, 
  BookOpen, 
  Target, 
  Award, 
  Clock, 
  CheckCircle2, 
  Flame,
  Trophy,
  Star,
  Zap,
  Calendar,
  ArrowUpRight
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface ProgressSectionProps {
  isDarkMode: boolean;
}

export function ProgressSection({ isDarkMode }: ProgressSectionProps) {
  const { user } = useAuth();

  // Mock data for progress tracking
  const skillProgress = [
    { name: "Web Development", progress: 78, color: "from-blue-500 to-cyan-500", hours: 45 },
    { name: "Data Structures", progress: 65, color: "from-purple-500 to-pink-500", hours: 32 },
    { name: "Machine Learning", progress: 42, color: "from-orange-500 to-red-500", hours: 18 },
    { name: "System Design", progress: 35, color: "from-green-500 to-emerald-500", hours: 12 },
  ];

  const achievements = [
    { name: "Quick Learner", icon: Zap, color: "bg-yellow-500", unlocked: true, description: "Completed 5 courses" },
    { name: "Consistent", icon: Flame, color: "bg-orange-500", unlocked: true, description: "7 day streak" },
    { name: "Problem Solver", icon: Target, color: "bg-purple-500", unlocked: true, description: "Solved 50 problems" },
    { name: "Mentor Star", icon: Star, color: "bg-blue-500", unlocked: false, description: "Get 5 mentor sessions" },
    { name: "Champion", icon: Trophy, color: "bg-green-500", unlocked: false, description: "Complete all skills" },
  ];

  const recentActivity = [
    { action: "Completed lesson", target: "React Hooks Deep Dive", time: "2 hours ago", type: "lesson" },
    { action: "Earned badge", target: "Quick Learner", time: "1 day ago", type: "badge" },
    { action: "Started course", target: "Advanced TypeScript", time: "2 days ago", type: "course" },
    { action: "Completed quiz", target: "JavaScript Arrays", time: "3 days ago", type: "quiz" },
    { action: "Watched video", target: "CSS Grid Mastery", time: "4 days ago", type: "video" },
  ];

  const weeklyStats = {
    streak: 7,
    hoursLearned: 12.5,
    lessonsCompleted: 18,
    quizzesPassed: 5,
  };

  return (
    <div className="h-full overflow-y-auto p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track your learning journey and achievements
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold"
        >
          <Flame className="w-5 h-5" />
          <span>{weeklyStats.streak} Day Streak!</span>
        </motion.div>
      </div>

      {/* Weekly Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{weeklyStats.streak}</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Day Streak</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{weeklyStats.hoursLearned}h</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hours This Week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{weeklyStats.lessonsCompleted}</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lessons Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{weeklyStats.quizzesPassed}</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Quizzes Passed</p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Skills Progress - Left Column */}
        <div className="col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} mb-6`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Skill Progress
              </h2>
              <button className={`text-sm font-medium text-blue-500 hover:underline`}>
                View All
              </button>
            </div>

            <div className="space-y-6">
              {skillProgress.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {skill.hours}h spent
                      </span>
                      <span className="font-bold">{skill.progress}%</span>
                    </div>
                  </div>
                  <div className={`h-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 + (0.1 * index) }}
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Achievements
              </h2>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {achievements.filter(a => a.unlocked).length}/{achievements.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`relative flex flex-col items-center p-4 rounded-2xl border-2 ${
                    achievement.unlocked
                      ? `${isDarkMode ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-yellow-200 bg-yellow-50'}`
                      : `${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} opacity-50`
                  }`}
                >
                  <div className={`w-12 h-12 ${achievement.unlocked ? achievement.color : 'bg-gray-400'} rounded-full flex items-center justify-center mb-2`}>
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-center">{achievement.name}</p>
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                      <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">Locked</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Activity Feed - Right Column */}
        <div className="col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
          >
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-green-500" />
              Recent Activity
            </h2>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex items-start gap-3 p-3 rounded-xl ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'lesson' ? 'bg-blue-500/10 text-blue-500' :
                    activity.type === 'badge' ? 'bg-yellow-500/10 text-yellow-500' :
                    activity.type === 'course' ? 'bg-green-500/10 text-green-500' :
                    activity.type === 'quiz' ? 'bg-purple-500/10 text-purple-500' :
                    'bg-orange-500/10 text-orange-500'
                  }`}>
                    {activity.type === 'lesson' && <BookOpen className="w-5 h-5" />}
                    {activity.type === 'badge' && <Award className="w-5 h-5" />}
                    {activity.type === 'course' && <Target className="w-5 h-5" />}
                    {activity.type === 'quiz' && <CheckCircle2 className="w-5 h-5" />}
                    {activity.type === 'video' && <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activity.target}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 text-center text-sm font-medium text-blue-500 hover:underline">
              View All Activity
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
