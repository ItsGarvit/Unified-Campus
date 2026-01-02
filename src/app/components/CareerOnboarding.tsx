import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, ArrowRight, Sparkles, Target, Clock, TrendingUp, X } from "lucide-react";

interface CareerOnboardingProps {
  isDarkMode: boolean;
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

export interface OnboardingData {
  primaryGoal: string;
  timeframe: string;
  currentLevel: string;
  interests: string[];
  currentYear: number;
  graduationYear: number;
  currentSemester: string;
}

export function CareerOnboarding({ isDarkMode, onComplete, onSkip }: CareerOnboardingProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    primaryGoal: "",
    timeframe: "",
    currentLevel: "",
    interests: [],
    currentYear: 1,
    graduationYear: 4,
    currentSemester: "1"
  });

  const goals = [
    { id: "land-first-job", label: "Land My First Tech Job", icon: "🎯" },
    { id: "career-switch", label: "Switch Career to Tech", icon: "🔄" },
    { id: "skill-upgrade", label: "Upgrade My Current Skills", icon: "📈" },
    { id: "freelance", label: "Start Freelancing", icon: "💼" },
    { id: "startup", label: "Build My Own Startup", icon: "🚀" },
    { id: "promotion", label: "Get Promoted to Senior Role", icon: "⭐" }
  ];

  const timeframes = [
    { id: "3-6-months", label: "3-6 Months", desc: "Fast track" },
    { id: "6-12-months", label: "6-12 Months", desc: "Balanced" },
    { id: "1-2-years", label: "1-2 Years", desc: "Comprehensive" },
    { id: "2-plus-years", label: "2+ Years", desc: "Long-term mastery" }
  ];

  const levels = [
    { id: "complete-beginner", label: "Complete Beginner", desc: "Just starting out" },
    { id: "some-knowledge", label: "Some Knowledge", desc: "Taken a few courses" },
    { id: "intermediate", label: "Intermediate", desc: "Built some projects" },
    { id: "advanced", label: "Advanced", desc: "Working professionally" }
  ];

  const interestAreas = [
    { id: "web-dev", label: "Web Development", icon: "🌐" },
    { id: "mobile-dev", label: "Mobile Development", icon: "📱" },
    { id: "data-science", label: "Data Science & AI", icon: "🤖" },
    { id: "devops", label: "DevOps & Cloud", icon: "☁️" },
    { id: "cyber-security", label: "Cybersecurity", icon: "🔒" },
    { id: "blockchain", label: "Blockchain & Web3", icon: "⛓️" },
    { id: "game-dev", label: "Game Development", icon: "🎮" },
    { id: "ui-ux", label: "UI/UX Design", icon: "🎨" }
  ];

  const handleGoalSelect = (goalId: string) => {
    setData({ ...data, primaryGoal: goalId });
    setTimeout(() => setStep(2), 300);
  };

  const handleTimeframeSelect = (timeframeId: string) => {
    setData({ ...data, timeframe: timeframeId });
    setTimeout(() => setStep(3), 300);
  };

  const handleLevelSelect = (levelId: string) => {
    setData({ ...data, currentLevel: levelId });
    setTimeout(() => setStep(4), 300);
  };

  const handleInterestToggle = (interestId: string) => {
    const newInterests = data.interests.includes(interestId)
      ? data.interests.filter(i => i !== interestId)
      : [...data.interests, interestId];
    setData({ ...data, interests: newInterests });
  };

  const handleInterestsContinue = () => {
    if (data.interests.length > 0) {
      setStep(5);
    }
  };

  const handleComplete = () => {
    if (data.currentYear > 0 && data.graduationYear > 0 && data.currentSemester) {
      onComplete(data);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-8 text-white relative">
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                AI Career Guide
                <Sparkles className="w-6 h-6" />
              </h2>
              <p className="text-sm opacity-90">Let's build your personalized career path</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex gap-2 mt-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-all ${
                  s <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Primary Goal */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-8 h-8 text-blue-500" />
                  <h3 className="text-2xl font-bold">What do you want to achieve?</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Select your primary career goal so we can tailor recommendations for you.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {goals.map((goal) => (
                    <motion.button
                      key={goal.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGoalSelect(goal.id)}
                      className={`p-6 rounded-2xl border-2 transition-all text-left ${
                        data.primaryGoal === goal.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : isDarkMode
                            ? 'border-gray-700 hover:border-gray-600'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-3">{goal.icon}</div>
                      <h4 className="font-semibold">{goal.label}</h4>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Timeframe */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-8 h-8 text-blue-500" />
                  <h3 className="text-2xl font-bold">What's your timeframe?</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  How much time can you dedicate to achieving your goal?
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {timeframes.map((timeframe) => (
                    <motion.button
                      key={timeframe.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTimeframeSelect(timeframe.id)}
                      className={`p-6 rounded-2xl border-2 transition-all text-left ${
                        data.timeframe === timeframe.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : isDarkMode
                            ? 'border-gray-700 hover:border-gray-600'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg mb-1">{timeframe.label}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{timeframe.desc}</p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Current Level */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                  <h3 className="text-2xl font-bold">What's your current level?</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Tell us about your experience so we can start from the right place.
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {levels.map((level) => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLevelSelect(level.id)}
                      className={`p-6 rounded-2xl border-2 transition-all text-left ${
                        data.currentLevel === level.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : isDarkMode
                            ? 'border-gray-700 hover:border-gray-600'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg mb-1">{level.label}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{level.desc}</p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Interests */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-8 h-8 text-blue-500" />
                  <h3 className="text-2xl font-bold">What interests you?</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Select all the areas you're interested in. We'll create a custom path for you!
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {interestAreas.map((interest) => (
                    <motion.button
                      key={interest.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`p-6 rounded-2xl border-2 transition-all text-left ${
                        data.interests.includes(interest.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : isDarkMode
                            ? 'border-gray-700 hover:border-gray-600'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-3">{interest.icon}</div>
                      <h4 className="font-semibold">{interest.label}</h4>
                    </motion.button>
                  ))}
                </div>
                
                <button
                  onClick={handleInterestsContinue}
                  disabled={data.interests.length === 0}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                {data.interests.length === 0 && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Please select at least one area of interest
                  </p>
                )}
              </motion.div>
            )}

            {/* Step 5: Additional Details */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-8 h-8 text-blue-500" />
                  <h3 className="text-2xl font-bold">Additional Details</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Provide some additional details to refine your career path.
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-6 rounded-2xl border-2 transition-all text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-lg mb-1">Current Year</h4>
                        <input
                          type="number"
                          value={data.currentYear}
                          onChange={(e) => setData({ ...data, currentYear: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl border-2 transition-all text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-lg mb-1">Graduation Year</h4>
                        <input
                          type="number"
                          value={data.graduationYear}
                          onChange={(e) => setData({ ...data, graduationYear: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl border-2 transition-all text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-lg mb-1">Current Semester</h4>
                        <input
                          type="text"
                          value={data.currentSemester}
                          onChange={(e) => setData({ ...data, currentSemester: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleComplete}
                  disabled={data.currentYear <= 0 || data.graduationYear <= 0 || !data.currentSemester}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Generate My Career Path
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                {(data.currentYear <= 0 || data.graduationYear <= 0 || !data.currentSemester) && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Please fill in all additional details
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t px-8 py-4 flex items-center justify-between`}>
          <p className="text-sm text-gray-500">
            Step {step} of 5
          </p>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              ← Back
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}