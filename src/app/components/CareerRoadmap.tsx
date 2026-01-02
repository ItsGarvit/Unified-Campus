import { useState } from "react";
import { motion } from "motion/react";
import { 
  Calendar,
  CalendarDays,
  CalendarRange,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronRight,
  Target,
  Book,
  Code,
  Video,
  FileText,
  Trophy
} from "lucide-react";

interface RoadmapProps {
  isDarkMode: boolean;
  roadmapData: RoadmapData;
}

export interface RoadmapData {
  overallGoal: string;
  totalDuration: string;
  years: YearPlan[];
}

interface YearPlan {
  year: number;
  title: string;
  goal: string;
  months: MonthPlan[];
}

interface MonthPlan {
  month: string;
  goal: string;
  weeks: WeekPlan[];
}

interface WeekPlan {
  week: number;
  focus: string;
  dailyTasks: DailyTask[];
}

interface DailyTask {
  day: string;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  type: 'study' | 'practice' | 'project' | 'review';
  duration: string;
  completed?: boolean;
}

export function CareerRoadmap({ isDarkMode, roadmapData }: RoadmapProps) {
  const [view, setView] = useState<'overview' | 'yearly' | 'monthly' | 'weekly' | 'daily'>('overview');
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [expandedYears, setExpandedYears] = useState<number[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);

  const toggleYear = (yearIndex: number) => {
    setExpandedYears(prev =>
      prev.includes(yearIndex) ? prev.filter(y => y !== yearIndex) : [...prev, yearIndex]
    );
  };

  const toggleMonth = (key: string) => {
    setExpandedMonths(prev =>
      prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key]
    );
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'study': return <Book className="w-4 h-4" />;
      case 'practice': return <Code className="w-4 h-4" />;
      case 'project': return <Trophy className="w-4 h-4" />;
      case 'review': return <FileText className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'study': return 'blue';
      case 'practice': return 'green';
      case 'project': return 'purple';
      case 'review': return 'orange';
      default: return 'gray';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Overall Goal */}
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-purple-900 to-blue-900' : 'bg-gradient-to-r from-purple-500 to-blue-500'} rounded-2xl p-8 text-white`}>
        <h3 className="text-2xl font-bold mb-2">Your Career Goal</h3>
        <p className="text-xl opacity-90">{roadmapData.overallGoal}</p>
        <p className="text-sm opacity-75 mt-2">Duration: {roadmapData.totalDuration}</p>
      </div>

      {/* Yearly Breakdown */}
      <div>
        <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Yearly Roadmap
        </h4>
        <div className="space-y-4">
          {roadmapData.years.map((yearPlan, yearIndex) => (
            <motion.div
              key={yearIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: yearIndex * 0.1 }}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm overflow-hidden`}
            >
              <button
                onClick={() => toggleYear(yearIndex)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-600 dark:text-blue-400">Y{yearPlan.year}</span>
                  </div>
                  <div className="text-left">
                    <h5 className="font-bold text-lg">{yearPlan.title}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{yearPlan.goal}</p>
                  </div>
                </div>
                {expandedYears.includes(yearIndex) ? (
                  <ChevronDown className="w-6 h-6" />
                ) : (
                  <ChevronRight className="w-6 h-6" />
                )}
              </button>

              {expandedYears.includes(yearIndex) && (
                <div className="px-6 pb-6 space-y-3">
                  {yearPlan.months.map((monthPlan, monthIndex) => {
                    const monthKey = `${yearIndex}-${monthIndex}`;
                    return (
                      <div key={monthIndex} className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl overflow-hidden`}>
                        <button
                          onClick={() => toggleMonth(monthKey)}
                          className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <CalendarDays className="w-5 h-5 text-blue-500" />
                            <div className="text-left">
                              <h6 className="font-semibold">{monthPlan.month}</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{monthPlan.goal}</p>
                            </div>
                          </div>
                          {expandedMonths.includes(monthKey) ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>

                        {expandedMonths.includes(monthKey) && (
                          <div className="px-4 pb-4 space-y-2">
                            {monthPlan.weeks.map((weekPlan, weekIndex) => (
                              <div key={weekIndex} className={`p-3 ${isDarkMode ? 'bg-gray-600' : 'bg-white'} rounded-lg`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <CalendarRange className="w-4 h-4 text-green-500" />
                                  <span className="font-medium text-sm">Week {weekPlan.week}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{weekPlan.focus}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderYearly = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roadmapData.years.map((yearPlan, yearIndex) => (
          <motion.button
            key={yearIndex}
            onClick={() => {
              setSelectedYear(yearIndex);
              setView('monthly');
            }}
            whileHover={{ scale: 1.02 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 text-left`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-600 dark:text-blue-400">Y{yearPlan.year}</span>
              </div>
              <h5 className="font-bold">{yearPlan.title}</h5>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{yearPlan.goal}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{yearPlan.months.length} months</span>
              <ChevronRight className="w-5 h-5 text-blue-500" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderMonthly = () => {
    const yearPlan = roadmapData.years[selectedYear];
    if (!yearPlan) return null;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setView('yearly')}
          className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
        >
          ← Back to Yearly View
        </button>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6`}>
          <h3 className="text-xl font-bold mb-2">{yearPlan.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{yearPlan.goal}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {yearPlan.months.map((monthPlan, monthIndex) => (
            <motion.button
              key={monthIndex}
              onClick={() => {
                setSelectedMonth(monthIndex);
                setView('weekly');
              }}
              whileHover={{ scale: 1.02 }}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 text-left`}
            >
              <div className="flex items-center gap-3 mb-3">
                <CalendarDays className="w-8 h-8 text-blue-500" />
                <h5 className="font-bold">{monthPlan.month}</h5>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{monthPlan.goal}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{monthPlan.weeks.length} weeks</span>
                <ChevronRight className="w-5 h-5 text-blue-500" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekly = () => {
    const yearPlan = roadmapData.years[selectedYear];
    const monthPlan = yearPlan?.months[selectedMonth];
    if (!monthPlan) return null;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setView('monthly')}
          className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
        >
          ← Back to Monthly View
        </button>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6`}>
          <h3 className="text-xl font-bold mb-2">{monthPlan.month}</h3>
          <p className="text-gray-600 dark:text-gray-400">{monthPlan.goal}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monthPlan.weeks.map((weekPlan, weekIndex) => (
            <motion.button
              key={weekIndex}
              onClick={() => {
                setSelectedWeek(weekIndex);
                setView('daily');
              }}
              whileHover={{ scale: 1.02 }}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 text-left`}
            >
              <div className="flex items-center gap-3 mb-3">
                <CalendarRange className="w-8 h-8 text-green-500" />
                <h5 className="font-bold">Week {weekPlan.week}</h5>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{weekPlan.focus}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{weekPlan.dailyTasks.length} days</span>
                <ChevronRight className="w-5 h-5 text-green-500" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  const renderDaily = () => {
    const yearPlan = roadmapData.years[selectedYear];
    const monthPlan = yearPlan?.months[selectedMonth];
    const weekPlan = monthPlan?.weeks[selectedWeek];
    if (!weekPlan) return null;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setView('weekly')}
          className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
        >
          ← Back to Weekly View
        </button>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6`}>
          <h3 className="text-xl font-bold mb-2">Week {weekPlan.week}</h3>
          <p className="text-gray-600 dark:text-gray-400">{weekPlan.focus}</p>
        </div>

        <div className="space-y-4">
          {weekPlan.dailyTasks.map((dailyTask, dayIndex) => (
            <motion.div
              key={dayIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}
            >
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                {dailyTask.day}
              </h4>
              <div className="space-y-3">
                {dailyTask.tasks.map((task) => {
                  const color = getTaskColor(task.type);
                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border-l-4 border-${color}-500 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`mt-1 text-${color}-500`}>
                            {getTaskIcon(task.type)}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold mb-1">{task.title}</h5>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className={`px-2 py-1 bg-${color}-100 dark:bg-${color}-900 text-${color}-700 dark:text-${color}-300 rounded`}>
                                {task.type}
                              </span>
                              <span>{task.duration}</span>
                            </div>
                          </div>
                        </div>
                        <button className="mt-1">
                          {task.completed ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* View Switcher */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setView('overview')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            view === 'overview'
              ? 'bg-blue-500 text-white'
              : isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setView('yearly')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            view === 'yearly'
              ? 'bg-blue-500 text-white'
              : isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Yearly
        </button>
        <button
          onClick={() => view !== 'overview' && view !== 'yearly' && setView('monthly')}
          disabled={selectedYear === null}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            view === 'monthly'
              ? 'bg-blue-500 text-white'
              : isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50'
                : 'bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:opacity-50'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => view !== 'overview' && view !== 'yearly' && view !== 'monthly' && setView('weekly')}
          disabled={selectedMonth === null}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            view === 'weekly'
              ? 'bg-blue-500 text-white'
              : isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50'
                : 'bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:opacity-50'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => view !== 'overview' && view !== 'yearly' && view !== 'monthly' && view !== 'weekly' && setView('daily')}
          disabled={selectedWeek === null}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            view === 'daily'
              ? 'bg-blue-500 text-white'
              : isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50'
                : 'bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:opacity-50'
          }`}
        >
          Daily
        </button>
      </div>

      {/* Content */}
      {view === 'overview' && renderOverview()}
      {view === 'yearly' && renderYearly()}
      {view === 'monthly' && renderMonthly()}
      {view === 'weekly' && renderWeekly()}
      {view === 'daily' && renderDaily()}
    </div>
  );
}
