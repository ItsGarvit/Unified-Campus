import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown,
  Target,
  Zap,
  BookOpen,
  Users,
  Calendar,
  ArrowRight,
  Brain
} from "lucide-react";

interface SkillGap {
  skill: string;
  targetLevel: number;
  currentLevel: number;
  gapPercentage: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  impactOnGoal: string;
  recommendation: string;
  estimatedTimeToFill: string;
  suggestedMentors: number;
  relatedTopics: string[];
}

interface TestResult {
  testId: string;
  testName: string;
  score: number;
  topicScores: {
    topic: string;
    score: number;
  }[];
  timestamp: number;
}

interface SkillGapAnalysisProps {
  isDarkMode: boolean;
  targetRole: string;
  testResults: TestResult[];
  userSkillLevel: 'beginner' | 'intermediate' | 'advanced';
}

export function SkillGapAnalysis({ isDarkMode, targetRole, testResults, userSkillLevel }: SkillGapAnalysisProps) {
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [overallReadiness, setOverallReadiness] = useState(0);

  useEffect(() => {
    analyzeSkillGaps();
  }, [testResults, targetRole]);

  const analyzeSkillGaps = () => {
    // Mock analysis - In production, this would use AI to analyze test results
    const roleRequirements: Record<string, { skill: string; requiredLevel: number }[]> = {
      'Software Engineer': [
        { skill: 'Data Structures & Algorithms', requiredLevel: 85 },
        { skill: 'System Design', requiredLevel: 75 },
        { skill: 'Object-Oriented Programming', requiredLevel: 80 },
        { skill: 'Database Management', requiredLevel: 70 },
        { skill: 'Web Development', requiredLevel: 75 },
        { skill: 'Problem Solving', requiredLevel: 80 }
      ],
      'Data Scientist': [
        { skill: 'Machine Learning', requiredLevel: 85 },
        { skill: 'Statistics', requiredLevel: 80 },
        { skill: 'Python Programming', requiredLevel: 85 },
        { skill: 'Data Visualization', requiredLevel: 75 },
        { skill: 'SQL & Databases', requiredLevel: 70 },
        { skill: 'Deep Learning', requiredLevel: 75 }
      ],
      'Full Stack Developer': [
        { skill: 'Frontend Development', requiredLevel: 85 },
        { skill: 'Backend Development', requiredLevel: 85 },
        { skill: 'Database Design', requiredLevel: 75 },
        { skill: 'API Development', requiredLevel: 80 },
        { skill: 'DevOps Basics', requiredLevel: 65 },
        { skill: 'System Design', requiredLevel: 70 }
      ]
    };

    const requirements = roleRequirements[targetRole] || roleRequirements['Software Engineer'];

    // Simulate current skill levels based on test results
    const gaps: SkillGap[] = requirements.map((req) => {
      const currentLevel = userSkillLevel === 'advanced' ? 70 + Math.random() * 20 : 
                          userSkillLevel === 'intermediate' ? 50 + Math.random() * 25 : 
                          30 + Math.random() * 30;
      
      const gapPercentage = ((req.requiredLevel - currentLevel) / req.requiredLevel) * 100;
      
      let priority: 'critical' | 'high' | 'medium' | 'low';
      if (gapPercentage > 40) priority = 'critical';
      else if (gapPercentage > 25) priority = 'high';
      else if (gapPercentage > 10) priority = 'medium';
      else priority = 'low';

      const timeEstimates: Record<string, string> = {
        'critical': '3-4 months',
        'high': '2-3 months',
        'medium': '1-2 months',
        'low': '2-3 weeks'
      };

      return {
        skill: req.skill,
        targetLevel: req.requiredLevel,
        currentLevel: Math.round(currentLevel),
        gapPercentage: Math.max(0, Math.round(gapPercentage)),
        priority,
        impactOnGoal: priority === 'critical' ? 'High - May block job offers' :
                     priority === 'high' ? 'Medium - Will reduce competitive edge' :
                     priority === 'medium' ? 'Low - Nice to improve' :
                     'Minimal - Already competitive',
        recommendation: generateRecommendation(req.skill, priority),
        estimatedTimeToFill: timeEstimates[priority],
        suggestedMentors: priority === 'critical' ? 12 : priority === 'high' ? 8 : 5,
        relatedTopics: getRelatedTopics(req.skill)
      };
    });

    setSkillGaps(gaps.sort((a, b) => b.gapPercentage - a.gapPercentage));

    // Calculate overall readiness
    const avgCurrent = gaps.reduce((sum, gap) => sum + gap.currentLevel, 0) / gaps.length;
    const avgRequired = gaps.reduce((sum, gap) => sum + gap.targetLevel, 0) / gaps.length;
    setOverallReadiness(Math.round((avgCurrent / avgRequired) * 100));
  };

  const generateRecommendation = (skill: string, priority: string): string => {
    if (priority === 'critical') {
      return `🚨 Critical Gap: Book a mentor immediately and dedicate 2-3 hours daily. This is blocking your ${targetRole} goal.`;
    } else if (priority === 'high') {
      return `⚠️ High Priority: Schedule weekly practice sessions and consider peer learning groups. Important for interviews.`;
    } else if (priority === 'medium') {
      return `📚 Medium Priority: Add to weekly study plan. Practice problems and take assessment tests.`;
    } else {
      return `✅ Low Priority: You're competitive! Continue practicing to maintain proficiency.`;
    }
  };

  const getRelatedTopics = (skill: string): string[] => {
    const topicMap: Record<string, string[]> = {
      'Data Structures & Algorithms': ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming'],
      'System Design': ['Scalability', 'Load Balancing', 'Caching', 'Microservices'],
      'Object-Oriented Programming': ['SOLID Principles', 'Design Patterns', 'Inheritance', 'Polymorphism'],
      'Database Management': ['SQL', 'Indexing', 'Normalization', 'Transactions'],
      'Web Development': ['React', 'REST APIs', 'Authentication', 'State Management'],
      'Machine Learning': ['Supervised Learning', 'Neural Networks', 'Feature Engineering', 'Model Evaluation'],
      'Frontend Development': ['React', 'TypeScript', 'CSS', 'Responsive Design'],
      'Backend Development': ['Node.js', 'Express', 'REST APIs', 'Authentication']
    };

    return topicMap[skill] || ['Practice', 'Theory', 'Projects', 'Mock Interviews'];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500/30';
      case 'high':
        return 'border-orange-500/30';
      case 'medium':
        return 'border-yellow-500/30';
      case 'low':
        return 'border-green-500/30';
      default:
        return 'border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-red-900 to-orange-900' : 'bg-gradient-to-r from-red-500 to-orange-500'} rounded-2xl shadow-lg p-8 text-white`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">AI Skill Gap Analysis</h2>
            <p className="text-sm opacity-90">Predictive analysis based on your test results for {targetRole} role</p>
          </div>
        </div>
      </div>

      {/* Overall Readiness */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">Overall Role Readiness</h3>
            <p className="text-sm text-gray-500">Based on {skillGaps.length} key skills for {targetRole}</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${
              overallReadiness >= 80 ? 'text-green-500' :
              overallReadiness >= 60 ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {overallReadiness}%
            </div>
            <p className="text-sm text-gray-500">Ready</p>
          </div>
        </div>

        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallReadiness}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${
              overallReadiness >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
              overallReadiness >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
              'bg-gradient-to-r from-red-400 to-red-600'
            }`}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className="text-xs text-gray-500 mb-1">Critical Gaps</p>
            <p className="text-2xl font-bold text-red-500">
              {skillGaps.filter(g => g.priority === 'critical').length}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className="text-xs text-gray-500 mb-1">High Priority</p>
            <p className="text-2xl font-bold text-orange-500">
              {skillGaps.filter(g => g.priority === 'high').length}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className="text-xs text-gray-500 mb-1">On Track</p>
            <p className="text-2xl font-bold text-green-500">
              {skillGaps.filter(g => g.priority === 'low').length}
            </p>
          </div>
        </div>
      </div>

      {/* Skill Gaps */}
      <div className="space-y-4">
        {skillGaps.map((gap, index) => (
          <motion.div
            key={gap.skill}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-6 rounded-2xl border-2 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } ${getPriorityBorder(gap.priority)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                {gap.priority === 'critical' ? (
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                ) : gap.priority === 'low' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-orange-500 flex-shrink-0" />
                )}
                <div>
                  <h3 className="text-xl font-bold mb-1">{gap.skill}</h3>
                  <p className="text-sm text-gray-500">{gap.impactOnGoal}</p>
                </div>
              </div>
              <span className={`${getPriorityColor(gap.priority)} text-white px-4 py-1 rounded-full text-xs font-semibold uppercase`}>
                {gap.priority}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Current Level</span>
                <span className="font-semibold">{gap.currentLevel}% / {gap.targetLevel}%</span>
              </div>
              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-gray-400 dark:bg-gray-600 rounded-full"
                  style={{ width: `${gap.targetLevel}%` }}
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${gap.currentLevel}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`absolute h-full rounded-full ${getPriorityColor(gap.priority)}`}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Gap: {gap.gapPercentage}%</span>
                <span>Target for {targetRole}</span>
              </div>
            </div>

            {/* Recommendation */}
            <div className={`p-4 rounded-lg mb-4 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                AI Recommendation
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{gap.recommendation}</p>
            </div>

            {/* Action Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <p className="text-xs text-gray-500">Time to Fill</p>
                </div>
                <p className="font-semibold">{gap.estimatedTimeToFill}</p>
              </div>

              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <p className="text-xs text-gray-500">Available Mentors</p>
                </div>
                <p className="font-semibold">{gap.suggestedMentors} mentors</p>
              </div>

              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-green-500" />
                  <p className="text-xs text-gray-500">Practice Tests</p>
                </div>
                <p className="font-semibold">8 available</p>
              </div>
            </div>

            {/* Related Topics */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Focus Areas</p>
              <div className="flex flex-wrap gap-2">
                {gap.relatedTopics.map((topic) => (
                  <span 
                    key={topic}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            {gap.priority === 'critical' || gap.priority === 'high' ? (
              <button className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow">
                {gap.priority === 'critical' ? 'Book Mentor Now' : 'Start Learning'}
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : null}
          </motion.div>
        ))}
      </div>

      {/* Study Plan Adjustment Notice */}
      {skillGaps.some(g => g.priority === 'critical' || g.priority === 'high') && (
        <div className={`p-6 rounded-2xl border-2 ${
          isDarkMode ? 'bg-purple-900/20 border-purple-500/30' : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">📅 Study Plan Auto-Adjusted</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Based on your skill gaps, we've automatically updated your learning roadmap to prioritize weak areas. 
                Your daily study time will now include:
              </p>
              <ul className="space-y-2 text-sm">
                {skillGaps.filter(g => g.priority === 'critical' || g.priority === 'high').map((gap) => (
                  <li key={gap.skill} className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span><span className="font-semibold">{gap.skill}:</span> 45 mins daily + weekend deep-dive sessions</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
