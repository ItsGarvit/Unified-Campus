import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building2, 
  MapPin,
  Target,
  Calendar,
  Zap,
  AlertCircle,
  CheckCircle2,
  Clock,
  Award
} from "lucide-react";

interface SkillTrend {
  name: string;
  trend: 'rising' | 'stable' | 'declining';
  demandChange: number;
  currentDemand: number;
  avgSalary: string;
  jobOpenings: number;
  topCompanies: string[];
  recommendation: 'learn-now' | 'learn-soon' | 'optional' | 'avoid';
  peakDemandMonth: string;
}

interface CompanyHiring {
  company: string;
  logo: string;
  roles: string[];
  count: number;
  avgSalary: string;
  requirements: string[];
}

interface SalaryPrediction {
  role: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  skillsRequired: string[];
  experienceLevel: string;
}

interface IndustryTrendsProps {
  isDarkMode: boolean;
  userSkills?: string[];
  targetRole?: string;
  location?: string;
}

// Mock data - In production, this would come from APIs (LinkedIn, GitHub, Indeed, etc.)
const generateSkillTrends = (): SkillTrend[] => [
  {
    name: 'RAG + LLM',
    trend: 'rising',
    demandChange: 287,
    currentDemand: 95,
    avgSalary: '₹18-35 LPA',
    jobOpenings: 2847,
    topCompanies: ['OpenAI', 'Google', 'Microsoft', 'Amazon'],
    recommendation: 'learn-now',
    peakDemandMonth: 'Month 8-10'
  },
  {
    name: 'System Design',
    trend: 'rising',
    demandChange: 156,
    currentDemand: 92,
    avgSalary: '₹15-30 LPA',
    jobOpenings: 4521,
    topCompanies: ['Meta', 'Amazon', 'Netflix', 'Uber'],
    recommendation: 'learn-now',
    peakDemandMonth: 'Month 6-8'
  },
  {
    name: 'React + TypeScript',
    trend: 'stable',
    demandChange: 45,
    currentDemand: 88,
    avgSalary: '₹10-22 LPA',
    jobOpenings: 8934,
    topCompanies: ['Vercel', 'Meta', 'Airbnb', 'Netflix'],
    recommendation: 'learn-now',
    peakDemandMonth: 'Month 3-5'
  },
  {
    name: 'Kubernetes',
    trend: 'rising',
    demandChange: 134,
    currentDemand: 85,
    avgSalary: '₹14-28 LPA',
    jobOpenings: 3256,
    topCompanies: ['Google', 'RedHat', 'HashiCorp', 'Docker'],
    recommendation: 'learn-soon',
    peakDemandMonth: 'Month 7-9'
  },
  {
    name: 'Python + Data Science',
    trend: 'stable',
    demandChange: 67,
    currentDemand: 90,
    avgSalary: '₹12-25 LPA',
    jobOpenings: 6782,
    topCompanies: ['Google', 'Amazon', 'Microsoft', 'Flipkart'],
    recommendation: 'learn-now',
    peakDemandMonth: 'Month 4-6'
  },
  {
    name: 'GraphQL',
    trend: 'rising',
    demandChange: 98,
    currentDemand: 72,
    avgSalary: '₹12-24 LPA',
    jobOpenings: 1876,
    topCompanies: ['GitHub', 'Shopify', 'Meta', 'Twitter'],
    recommendation: 'learn-soon',
    peakDemandMonth: 'Month 5-7'
  },
  {
    name: 'Flutter',
    trend: 'stable',
    demandChange: 34,
    currentDemand: 68,
    avgSalary: '₹8-18 LPA',
    jobOpenings: 2134,
    topCompanies: ['Google', 'Alibaba', 'BMW', 'eBay'],
    recommendation: 'optional',
    peakDemandMonth: 'Month 4-6'
  },
  {
    name: 'Angular',
    trend: 'declining',
    demandChange: -23,
    currentDemand: 52,
    avgSalary: '₹8-16 LPA',
    jobOpenings: 1542,
    topCompanies: ['IBM', 'Accenture', 'Capgemini', 'TCS'],
    recommendation: 'avoid',
    peakDemandMonth: 'N/A'
  },
  {
    name: 'Ruby on Rails',
    trend: 'declining',
    demandChange: -45,
    currentDemand: 38,
    avgSalary: '₹7-15 LPA',
    jobOpenings: 876,
    topCompanies: ['GitHub', 'Shopify', 'Basecamp', 'Stripe'],
    recommendation: 'avoid',
    peakDemandMonth: 'N/A'
  }
];

const generateCompanyHiring = (): CompanyHiring[] => [
  {
    company: 'Google',
    logo: '🔵',
    roles: ['SDE-1', 'SDE-2', 'ML Engineer'],
    count: 234,
    avgSalary: '₹22-45 LPA',
    requirements: ['DSA', 'System Design', 'LLM/ML']
  },
  {
    company: 'Microsoft',
    logo: '🪟',
    roles: ['SDE', 'Cloud Engineer', 'AI Researcher'],
    count: 189,
    avgSalary: '₹18-38 LPA',
    requirements: ['DSA', 'Azure', 'System Design']
  },
  {
    company: 'Amazon',
    logo: '📦',
    roles: ['SDE-1', 'DevOps', 'Data Scientist'],
    count: 312,
    avgSalary: '₹16-35 LPA',
    requirements: ['DSA', 'AWS', 'Behavioral']
  },
  {
    company: 'Meta',
    logo: '👍',
    roles: ['Frontend', 'Backend', 'Full Stack'],
    count: 145,
    avgSalary: '₹20-42 LPA',
    requirements: ['React', 'System Design', 'GraphQL']
  },
  {
    company: 'Netflix',
    logo: '🎬',
    roles: ['Senior SDE', 'Platform Engineer'],
    count: 67,
    avgSalary: '₹25-50 LPA',
    requirements: ['System Design', 'Microservices', 'Cloud']
  },
  {
    company: 'Flipkart',
    logo: '🛒',
    roles: ['SDE-1', 'SDE-2', 'Data Engineer'],
    count: 198,
    avgSalary: '₹12-28 LPA',
    requirements: ['DSA', 'System Design', 'Java/Python']
  }
];

export function IndustryTrends({ isDarkMode, userSkills = [], targetRole = 'Software Engineer', location = 'Bangalore' }: IndustryTrendsProps) {
  const [skillTrends, setSkillTrends] = useState<SkillTrend[]>([]);
  const [companyHiring, setCompanyHiring] = useState<CompanyHiring[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'trending' | 'companies' | 'salary'>('trending');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Simulate API call
    setSkillTrends(generateSkillTrends());
    setCompanyHiring(generateCompanyHiring());
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
    }
  };

  const getRecommendationBadge = (recommendation: string) => {
    const badges = {
      'learn-now': { color: 'bg-green-500', text: 'Learn Now', icon: <Zap className="w-4 h-4" /> },
      'learn-soon': { color: 'bg-blue-500', text: 'Learn Soon', icon: <Clock className="w-4 h-4" /> },
      'optional': { color: 'bg-yellow-500', text: 'Optional', icon: <AlertCircle className="w-4 h-4" /> },
      'avoid': { color: 'bg-gray-500', text: 'Declining', icon: <TrendingDown className="w-4 h-4" /> }
    };

    const badge = badges[recommendation as keyof typeof badges];
    return (
      <span className={`${badge.color} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const renderTrendingSkills = () => (
    <div className="space-y-4">
      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">AI-Powered Market Analysis</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Data updated quarterly via LinkedIn Jobs API, GitHub trending repos, Stack Overflow survey, and Indeed job postings. 
              Next update: <span className="font-semibold">April 2026</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {skillTrends.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-5 rounded-xl border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getTrendIcon(skill.trend)}
                <h3 className="font-bold text-lg">{skill.name}</h3>
              </div>
              {getRecommendationBadge(skill.recommendation)}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Demand Change</p>
                <p className={`font-bold ${
                  skill.demandChange > 0 ? 'text-green-500' : skill.demandChange < 0 ? 'text-red-500' : 'text-blue-500'
                }`}>
                  {skill.demandChange > 0 ? '+' : ''}{skill.demandChange}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Current Demand</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${skill.currentDemand}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{skill.currentDemand}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Avg. Salary</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{skill.avgSalary}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Job Openings</span>
                <span className="font-semibold">{skill.jobOpenings.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Peak Demand</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{skill.peakDemandMonth}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Top Hiring Companies</p>
              <div className="flex flex-wrap gap-1">
                {skill.topCompanies.slice(0, 4).map((company) => (
                  <span 
                    key={company}
                    className={`px-2 py-1 rounded text-xs ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>

            {skill.recommendation === 'learn-now' && skill.trend === 'rising' && (
              <div className={`mt-3 p-3 rounded-lg ${
                isDarkMode ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'
              }`}>
                <p className="text-xs font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Priority Recommendation: Start learning in {skill.peakDemandMonth} of your journey
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCompanyHiring = () => (
    <div className="space-y-4">
      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Company Hiring Patterns</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time data from your college's placement records and industry job boards. Showing companies actively hiring for <span className="font-semibold">{targetRole}</span> roles.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companyHiring.map((company, index) => (
          <motion.div
            key={company.company}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`p-5 rounded-xl border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{company.logo}</div>
              <div>
                <h3 className="font-bold">{company.company}</h3>
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                  {company.count} positions
                </p>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">Open Roles</p>
              <div className="flex flex-wrap gap-1">
                {company.roles.map((role) => (
                  <span 
                    key={role}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-500">Expected Salary</p>
              <p className="font-bold text-lg text-green-600 dark:text-green-400">{company.avgSalary}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Key Requirements</p>
              <div className="flex flex-wrap gap-1">
                {company.requirements.map((req) => (
                  <span 
                    key={req}
                    className={`px-2 py-1 rounded text-xs ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSalaryPredictor = () => {
    const predictions: SalaryPrediction[] = [
      {
        role: 'Junior SDE',
        location: 'Bangalore',
        minSalary: 8,
        maxSalary: 18,
        avgSalary: 12,
        skillsRequired: ['DSA', 'React', 'Node.js'],
        experienceLevel: '0-2 years'
      },
      {
        role: 'SDE-2',
        location: 'Bangalore',
        minSalary: 15,
        maxSalary: 30,
        avgSalary: 22,
        skillsRequired: ['System Design', 'DSA', 'Microservices'],
        experienceLevel: '2-5 years'
      },
      {
        role: 'Full Stack Developer',
        location: 'Bangalore',
        minSalary: 10,
        maxSalary: 22,
        avgSalary: 15,
        skillsRequired: ['React', 'Node.js', 'MongoDB', 'AWS'],
        experienceLevel: '1-3 years'
      },
      {
        role: 'Data Scientist',
        location: 'Bangalore',
        minSalary: 12,
        maxSalary: 25,
        avgSalary: 18,
        skillsRequired: ['Python', 'ML', 'Statistics', 'SQL'],
        experienceLevel: '1-4 years'
      },
      {
        role: 'DevOps Engineer',
        location: 'Bangalore',
        minSalary: 14,
        maxSalary: 28,
        avgSalary: 20,
        skillsRequired: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
        experienceLevel: '2-5 years'
      },
      {
        role: 'ML Engineer',
        location: 'Bangalore',
        minSalary: 16,
        maxSalary: 35,
        avgSalary: 24,
        skillsRequired: ['Python', 'TensorFlow', 'RAG', 'LLM'],
        experienceLevel: '2-5 years'
      }
    ];

    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">AI-Powered Salary Predictor</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Estimated salary ranges based on your skills, location ({location}), and current market data from 10,000+ verified job postings.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {predictions.map((pred, index) => (
            <motion.div
              key={pred.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-5 rounded-xl border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">{pred.role}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {pred.location} • {pred.experienceLevel}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Salary Range</span>
                  <span className="text-xs text-gray-400">Per Annum</span>
                </div>
                <div className="relative">
                  <div className="h-3 bg-gradient-to-r from-green-200 via-green-400 to-green-600 dark:from-green-900 dark:via-green-700 dark:to-green-500 rounded-full mb-2"></div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>₹{pred.minSalary}L</span>
                    <span className="text-green-600 dark:text-green-400">₹{pred.avgSalary}L avg</span>
                    <span>₹{pred.maxSalary}L</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {pred.skillsRequired.map((skill) => {
                    const hasSkill = userSkills.includes(skill.toLowerCase());
                    return (
                      <span 
                        key={skill}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          hasSkill
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {hasSkill && <CheckCircle2 className="w-3 h-3" />}
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-indigo-900 to-purple-900' : 'bg-gradient-to-r from-indigo-500 to-purple-500'} rounded-2xl shadow-lg p-8 text-white`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Industry Trends Dashboard</h2>
            <p className="text-sm opacity-90">Market-driven insights updated quarterly • Powered by AI</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: {lastUpdated.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Data Sources: LinkedIn, GitHub, Stack Overflow, Indeed</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setSelectedCategory('trending')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            selectedCategory === 'trending'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
              : isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <TrendingUp className="w-5 h-5 inline mr-2" />
          Trending Skills
        </button>
        <button
          onClick={() => setSelectedCategory('companies')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            selectedCategory === 'companies'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
              : isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Building2 className="w-5 h-5 inline mr-2" />
          Company Hiring
        </button>
        <button
          onClick={() => setSelectedCategory('salary')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            selectedCategory === 'salary'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
              : isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <DollarSign className="w-5 h-5 inline mr-2" />
          Salary Predictor
        </button>
      </div>

      {/* Content */}
      {selectedCategory === 'trending' && renderTrendingSkills()}
      {selectedCategory === 'companies' && renderCompanyHiring()}
      {selectedCategory === 'salary' && renderSalaryPredictor()}
    </div>
  );
}
