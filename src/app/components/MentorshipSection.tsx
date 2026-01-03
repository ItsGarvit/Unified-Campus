import { motion } from "motion/react";
import { useState } from "react";
import { 
  Users, 
  Calendar, 
  Clock, 
  Star, 
  Video,
  MessageSquare,
  Search,
  Filter,
  ChevronRight,
  CheckCircle,
  XCircle,
  Play,
  Briefcase,
  GraduationCap
} from "lucide-react";

interface MentorshipSectionProps {
  isDarkMode: boolean;
}

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  rating: number;
  sessions: number;
  available: boolean;
  image: string;
}

interface Session {
  id: string;
  mentor: string;
  topic: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  type: "video" | "chat";
}

export function MentorshipSection({ isDarkMode }: MentorshipSectionProps) {
  const [activeTab, setActiveTab] = useState<"discover" | "sessions">("discover");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock mentors data
  const mentors: Mentor[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      title: "Senior Software Engineer",
      company: "Google",
      expertise: ["Web Development", "System Design", "React"],
      rating: 4.9,
      sessions: 156,
      available: true,
      image: "SJ"
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "Data Science Lead",
      company: "Meta",
      expertise: ["Machine Learning", "Python", "Data Analysis"],
      rating: 4.8,
      sessions: 98,
      available: true,
      image: "MC"
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      title: "Product Manager",
      company: "Microsoft",
      expertise: ["Product Strategy", "UX Design", "Agile"],
      rating: 4.7,
      sessions: 67,
      available: false,
      image: "ER"
    },
    {
      id: "4",
      name: "David Kim",
      title: "DevOps Engineer",
      company: "Amazon",
      expertise: ["AWS", "Docker", "Kubernetes"],
      rating: 4.9,
      sessions: 124,
      available: true,
      image: "DK"
    },
  ];

  // Mock sessions data
  const sessions: Session[] = [
    {
      id: "1",
      mentor: "Dr. Sarah Johnson",
      topic: "System Design Interview Prep",
      date: "Jan 5, 2026",
      time: "3:00 PM",
      status: "upcoming",
      type: "video"
    },
    {
      id: "2",
      mentor: "Michael Chen",
      topic: "ML Model Optimization",
      date: "Jan 3, 2026",
      time: "11:00 AM",
      status: "completed",
      type: "video"
    },
    {
      id: "3",
      mentor: "Emily Rodriguez",
      topic: "Product Roadmap Planning",
      date: "Dec 28, 2025",
      time: "2:30 PM",
      status: "completed",
      type: "chat"
    },
    {
      id: "4",
      mentor: "David Kim",
      topic: "Kubernetes Deployment",
      date: "Dec 20, 2025",
      time: "4:00 PM",
      status: "cancelled",
      type: "video"
    },
  ];

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-full overflow-y-auto p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mentorship</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Connect with industry experts and accelerate your growth
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold shadow-lg"
        >
          <Video className="w-5 h-5" />
          Book a Session
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("discover")}
          className={`px-6 py-3 rounded-xl font-medium transition-colors ${
            activeTab === "discover"
              ? "bg-blue-500 text-white"
              : isDarkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Users className="w-5 h-5 inline mr-2" />
          Discover Mentors
        </button>
        <button
          onClick={() => setActiveTab("sessions")}
          className={`px-6 py-3 rounded-xl font-medium transition-colors ${
            activeTab === "sessions"
              ? "bg-blue-500 text-white"
              : isDarkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Calendar className="w-5 h-5 inline mr-2" />
          My Sessions
        </button>
      </div>

      {/* Discover Mentors Tab */}
      {activeTab === "discover" && (
        <>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search mentors by name or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none"
              />
            </div>
            <button className={`flex items-center gap-2 px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors`}>
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-2 gap-6">
            {filteredMentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {mentor.image}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold">{mentor.name}</h3>
                      {mentor.available ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Available
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-gray-500 bg-gray-500/10 px-2 py-1 rounded-full">
                          Busy
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {mentor.title} at {mentor.company}
                      </span>
                    </div>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.expertise.map((skill) => (
                        <span
                          key={skill}
                          className={`text-xs px-2 py-1 rounded-lg ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Stats and Action */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">{mentor.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {mentor.sessions} sessions
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!mentor.available}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                          mentor.available
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Connect
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Sessions Tab */}
      {activeTab === "sessions" && (
        <div className="space-y-4">
          {/* Upcoming Session Highlight */}
          {sessions.filter(s => s.status === "upcoming").length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white mb-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Upcoming Session</p>
                  <h3 className="text-xl font-bold mb-2">
                    {sessions.find(s => s.status === "upcoming")?.topic}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{sessions.find(s => s.status === "upcoming")?.mentor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{sessions.find(s => s.status === "upcoming")?.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{sessions.find(s => s.status === "upcoming")?.time}</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-blue-500 rounded-xl font-bold"
                >
                  <Play className="w-5 h-5" />
                  Join Now
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Sessions List */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} overflow-hidden`}>
            <div className={`grid grid-cols-5 gap-4 px-6 py-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} font-medium text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div>Mentor</div>
              <div>Topic</div>
              <div>Date & Time</div>
              <div>Type</div>
              <div>Status</div>
            </div>

            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`grid grid-cols-5 gap-4 px-6 py-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} items-center hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {session.mentor.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="font-medium">{session.mentor}</span>
                </div>
                <div className="truncate">{session.topic}</div>
                <div>
                  <p className="font-medium">{session.date}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{session.time}</p>
                </div>
                <div>
                  <span className={`flex items-center gap-1 text-sm`}>
                    {session.type === "video" ? <Video className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                    {session.type === "video" ? "Video Call" : "Chat"}
                  </span>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    session.status === "upcoming"
                      ? "bg-blue-500/10 text-blue-500"
                      : session.status === "completed"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}>
                    {session.status === "upcoming" && <Clock className="w-3 h-3" />}
                    {session.status === "completed" && <CheckCircle className="w-3 h-3" />}
                    {session.status === "cancelled" && <XCircle className="w-3 h-3" />}
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
