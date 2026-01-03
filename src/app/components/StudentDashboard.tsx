import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { 
  LogOut, 
  GraduationCap, 
  Home,
  BarChart3,
  Clock,
  Users,
  CheckCircle,
  Settings,
  HelpCircle,
  Search,
  Sun,
  Moon,
  Download,
  ChevronDown,
  Edit2,
  Check,
  X,
  Target,
  Award,
  Globe,
  MapPin,
  Building2,
  UserCircle
} from "lucide-react";
import { useState } from "react";
import { GlobalChat } from "./GlobalChat";
import { RegionalChat } from "./RegionalChat";
import { CollegeChat } from "./CollegeChat";
import { PersonalSpace } from "./PersonalSpace";
import { CollegeVerificationModal } from "./CollegeVerificationModal";
import { ProfileDropdown } from "./ProfileDropdown";
import { ProgressSection } from "./ProgressSection";
import { MentorshipSection } from "./MentorshipSection";
import { ProfileSection } from "./ProfileSection";

export function StudentDashboard() {
  const { user, logout, updateUserId } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditingId, setIsEditingId] = useState(false);
  const [newId, setNewId] = useState("");
  const [idError, setIdError] = useState("");
  
  // Check if user needs to verify college (existing users without verification)
  const needsCollegeVerification = user?.userType === 'student' && user?.collegeVerified !== true;

  if (!user) return null;

  // Mock data for mentorship stats (replace with real data later)
  const stats = {
    totalSessions: 13,
    completedSessions: 7,
    upcomingSessions: 1,
    cancelledSessions: 2,
    progressMade: 72, // Changed from mentorshipRate
    monthlyProgress: [
      { month: "January", rate: 57 },
      { month: "February", rate: 65 },
      { month: "March", rate: 72 }
    ]
  };

  const handleEditId = () => {
    setNewId(user.id);
    setIsEditingId(true);
    setIdError("");
  };

  const handleSaveId = async () => {
    if (!newId.trim()) {
      setIdError("ID cannot be empty");
      return;
    }

    if (newId.length < 3) {
      setIdError("ID must be at least 3 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(newId)) {
      setIdError("ID can only contain letters, numbers, hyphens, and underscores");
      return;
    }

    try {
      await updateUserId(newId);
      setIsEditingId(false);
      setIdError("");
    } catch (error) {
      setIdError("Failed to update ID");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingId(false);
    setNewId("");
    setIdError("");
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex h-screen overflow-hidden`}>
      {/* College Verification Modal for existing users */}
      {needsCollegeVerification && (
        <CollegeVerificationModal isDarkMode={isDarkMode} />
      )}

      {/* Sidebar */}
      <aside className={`w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col h-screen overflow-hidden`}>
        {/* Logo */}
        <div className="flex-shrink-0 p-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 rounded-lg p-2">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">UnifiedCampus</span>
          </div>
        </div>

        {/* Main Menu - Scrollable */}
        <nav className="flex-1 px-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Main Menu</p>
          
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "dashboard" 
                ? "bg-blue-500 text-white" 
                : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("progress")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "progress" 
                ? "bg-blue-500 text-white" 
                : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Progress</span>
          </button>

          <button
            onClick={() => setActiveTab("mentorship")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "mentorship" 
                ? "bg-blue-500 text-white" 
                : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="font-medium">Mentorship</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-6 transition-colors ${
              activeTab === "profile" 
                ? "bg-blue-500 text-white" 
                : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </button>

          {/* Community Section */}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Community</p>
          
          <button
            onClick={() => setActiveTab("global")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "global" 
                ? "bg-blue-500 text-white" 
                : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <Globe className="w-5 h-5" />
            <span className="font-medium">Global</span>
          </button>

          <button
            onClick={() => setActiveTab("regional")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "regional" 
                ? "bg-blue-500 text-white" 
                : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Regional</span>
          </button>

          <button
            onClick={() => setActiveTab("college")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "college" 
                ? "bg-blue-500 text-white" 
                : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="font-medium">College</span>
          </button>

          <button
            onClick={() => setActiveTab("personal")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "personal" 
                ? "bg-blue-500 text-white" 
                : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <UserCircle className="w-5 h-5" />
            <span className="font-medium">Personal Space</span>
          </button>
        </nav>

        {/* Settings */}
        <div className="px-4 pb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Settings</p>
          
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>

          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Help & Support</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-8 py-4 flex items-center justify-between`}>
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className={`relative flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg px-4 py-2`}>
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search mentors, courses..."
                className="bg-transparent flex-1 outline-none text-sm"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <ProfileDropdown isDarkMode={isDarkMode} />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {/* Render Community Chats */}
          {activeTab === "global" && <GlobalChat isDarkMode={isDarkMode} />}
          {activeTab === "regional" && <RegionalChat isDarkMode={isDarkMode} />}
          {activeTab === "college" && <CollegeChat isDarkMode={isDarkMode} />}
          {activeTab === "personal" && <PersonalSpace isDarkMode={isDarkMode} />}

          {/* Render Progress Section */}
          {activeTab === "progress" && <ProgressSection isDarkMode={isDarkMode} />}

          {/* Render Mentorship Section */}
          {activeTab === "mentorship" && <MentorshipSection isDarkMode={isDarkMode} />}

          {/* Render Profile Section */}
          {activeTab === "profile" && <ProfileSection isDarkMode={isDarkMode} />}

          {/* Render Dashboard */}
          {activeTab === "dashboard" && (
            <div className="h-full overflow-y-auto p-8">
              {/* Page Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Student Details</h1>
                <div className="flex items-center gap-3">
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <span className="text-sm font-medium">Monthly</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              {/* Student Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 mb-6`}
              >
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {user.fullName.split(' ').map(n => n[0]).join('')}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">{user.fullName}</h2>
                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Student ID</p>
                        {isEditingId ? (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={newId}
                                onChange={(e) => setNewId(e.target.value)}
                                className={`text-sm font-semibold px-2 py-1 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} outline-none focus:border-blue-500`}
                              />
                              <button
                                onClick={handleSaveId}
                                className="p-1 bg-green-500 hover:bg-green-600 text-white rounded"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1 bg-red-500 hover:bg-red-600 text-white rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            {idError && <p className="text-xs text-red-500">{idError}</p>}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">{user.id}</p>
                            <button
                              onClick={handleEditId}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            >
                              <Edit2 className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="text-sm font-semibold">{user.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-semibold">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">College</p>
                        <p className="text-sm font-semibold">{user.college || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stats.totalSessions} Sessions</p>
                  <p className="text-sm text-gray-500">Total Scheduled</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stats.completedSessions} Sessions</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stats.upcomingSessions} Session</p>
                  <p className="text-sm text-gray-500">Upcoming</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-red-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stats.cancelledSessions} Sessions</p>
                  <p className="text-sm text-gray-500">Cancelled</p>
                </motion.div>
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="col-span-1 space-y-6">
                  {/* Sessions This Month */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}
                  >
                    <h3 className="font-semibold mb-2">Sessions This Month</h3>
                    <p className="text-sm text-gray-500 mb-4">Total sessions for Monthly</p>
                    <p className="text-5xl font-bold text-center py-6">{stats.totalSessions}</p>
                  </motion.div>

                  {/* Progress Made */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}
                  >
                    <h3 className="font-semibold mb-2">Progress Made</h3>
                    <p className="text-sm text-gray-500 mb-4">Overall Achievement</p>
                    <p className="text-5xl font-bold text-center py-6">{stats.progressMade}%</p>
                  </motion.div>
                </div>

                {/* Right Column - Summary */}
                <div className="col-span-2">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}
                  >
                    <h3 className="font-semibold mb-6">Summary - {user.fullName}</h3>
                    
                    <div className="grid grid-cols-4 gap-4 mb-8">
                      <div className="bg-blue-500 rounded-2xl p-6 text-white text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Target className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold mb-2">{stats.totalSessions}</p>
                        <p className="text-sm opacity-90">Total</p>
                      </div>
                      
                      <div className="bg-green-500 rounded-2xl p-6 text-white text-center">
                        <div className="flex items-center justify-center mb-2">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold mb-2">{stats.completedSessions}</p>
                        <p className="text-sm opacity-90">Completed</p>
                      </div>
                      
                      <div className="bg-orange-500 rounded-2xl p-6 text-white text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Clock className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold mb-2">{stats.upcomingSessions}</p>
                        <p className="text-sm opacity-90">Upcoming</p>
                      </div>
                      
                      <div className="bg-red-500 rounded-2xl p-6 text-white text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Award className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold mb-2">{stats.cancelledSessions}</p>
                        <p className="text-sm opacity-90">Cancelled</p>
                      </div>
                    </div>

                    {/* Progress Table */}
                    <div>
                      <h4 className="font-semibold mb-4">Monthly Progress</h4>
                      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                        <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 mb-3">
                          <div>Month</div>
                          <div>Sessions</div>
                          <div>Completion</div>
                          <div>Progress</div>
                        </div>
                        {stats.monthlyProgress.map((month, index) => (
                          <div key={index} className={`grid grid-cols-4 gap-4 text-sm py-3 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} border-t`}>
                            <div className="font-medium">{month.month}</div>
                            <div>{Math.floor(stats.totalSessions / 3)}</div>
                            <div>{month.rate}%</div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-300 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${month.rate}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}