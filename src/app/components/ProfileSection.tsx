import { motion } from "motion/react";
import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  BookOpen,
  Calendar,
  Edit2,
  Camera,
  Save,
  X,
  Shield,
  Bell,
  Palette,
  Globe,
  CheckCircle,
  Lock,
  ChevronRight,
  LogOut,
  Trash2
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface ProfileSectionProps {
  isDarkMode: boolean;
}

export function ProfileSection({ isDarkMode }: ProfileSectionProps) {
  const { user, logout, deleteAccount } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    college: user?.college || "",
    branch: user?.branch || "",
    year: user?.year || "",
    city: user?.city || "",
    state: user?.state || "",
  });
  const [activeSettingsTab, setActiveSettingsTab] = useState<"profile" | "account" | "notifications">("profile");

  const interests = ["Web Development", "Machine Learning", "System Design", "Data Structures"];
  
  const handleSave = () => {
    // Save logic would go here
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteAccount();
      } catch (error) {
        console.error("Failed to delete account:", error);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="h-full overflow-y-auto p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your account and preferences
          </p>
        </div>
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold shadow-lg"
          >
            <Edit2 className="w-5 h-5" />
            Edit Profile
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(false)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              <X className="w-5 h-5" />
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold shadow-lg"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} text-center`}
          >
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-1">{user.fullName}</h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{user.email}</p>

            {/* Verification Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4" />
              Verified Student
            </div>

            {/* Quick Stats */}
            <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hours Learned</p>
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sessions</p>
              </div>
            </div>
          </motion.div>

          {/* Interests Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} mt-6`}
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}
                >
                  {interest}
                </span>
              ))}
              {isEditing && (
                <button className={`px-3 py-1 rounded-full text-sm font-medium border-2 border-dashed ${isDarkMode ? 'border-gray-600 text-gray-400 hover:border-blue-500' : 'border-gray-300 text-gray-500 hover:border-blue-500'}`}>
                  + Add
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Details & Settings */}
        <div className="col-span-2">
          {/* Settings Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveSettingsTab("profile")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors ${
                activeSettingsTab === "profile"
                  ? "bg-blue-500 text-white"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <User className="w-4 h-4" />
              Personal Info
            </button>
            <button
              onClick={() => setActiveSettingsTab("account")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors ${
                activeSettingsTab === "account"
                  ? "bg-blue-500 text-white"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Shield className="w-4 h-4" />
              Account
            </button>
            <button
              onClick={() => setActiveSettingsTab("notifications")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors ${
                activeSettingsTab === "notifications"
                  ? "bg-blue-500 text-white"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
          </div>

          {/* Personal Info Tab */}
          {activeSettingsTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
            >
              <h3 className="font-bold text-lg mb-6">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Full Name
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={editedUser.fullName}
                        onChange={(e) => setEditedUser({ ...editedUser, fullName: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} focus:border-blue-500 outline-none transition-colors`}
                      />
                    </div>
                  ) : (
                    <p className="font-medium flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-400" />
                      {user.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Email Address
                  </label>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    {user.email}
                    <span className="text-xs text-green-500">(Verified)</span>
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={editedUser.phone}
                        onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} focus:border-blue-500 outline-none transition-colors`}
                      />
                    </div>
                  ) : (
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="w-5 h-5 text-gray-400" />
                      {user.phone || "Not provided"}
                    </p>
                  )}
                </div>

                {/* College */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    College
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={editedUser.college}
                        onChange={(e) => setEditedUser({ ...editedUser, college: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} focus:border-blue-500 outline-none transition-colors`}
                      />
                    </div>
                  ) : (
                    <p className="font-medium flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      {user.college || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Branch */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Branch/Major
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={editedUser.branch}
                        onChange={(e) => setEditedUser({ ...editedUser, branch: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} focus:border-blue-500 outline-none transition-colors`}
                      />
                    </div>
                  ) : (
                    <p className="font-medium flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      {user.branch || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Year of Study
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={editedUser.year}
                        onChange={(e) => setEditedUser({ ...editedUser, year: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} focus:border-blue-500 outline-none transition-colors`}
                      />
                    </div>
                  ) : (
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      {user.year || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Location
                  </label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="City"
                          value={editedUser.city}
                          onChange={(e) => setEditedUser({ ...editedUser, city: e.target.value })}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} focus:border-blue-500 outline-none transition-colors`}
                        />
                      </div>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="State"
                          value={editedUser.state}
                          onChange={(e) => setEditedUser({ ...editedUser, state: e.target.value })}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} focus:border-blue-500 outline-none transition-colors`}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      {user.city && user.state ? `${user.city}, ${user.state}` : "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Account Tab */}
          {activeSettingsTab === "account" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Security Settings */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-500" />
                  Security
                </h3>
                
                <div className="space-y-4">
                  <button className={`w-full flex items-center justify-between p-4 rounded-xl ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <p className="font-medium">Change Password</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Update your password regularly</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className={`w-full flex items-center justify-between p-4 rounded-xl ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add an extra layer of security</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 border-2 border-red-500/30`}>
                <h3 className="font-bold text-lg mb-4 text-red-500">Danger Zone</h3>
                
                <div className="space-y-4">
                  <button
                    onClick={logout}
                    className={`w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-500/10 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5 text-red-500" />
                      <div className="text-left">
                        <p className="font-medium text-red-500">Log Out</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign out of your account</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-red-500" />
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    className={`w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-500/10 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-5 h-5 text-red-500" />
                      <div className="text-left">
                        <p className="font-medium text-red-500">Delete Account</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Permanently delete your account and data</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeSettingsTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
            >
              <h3 className="font-bold text-lg mb-6">Notification Preferences</h3>
              
              <div className="space-y-6">
                {[
                  { name: "Email Notifications", description: "Receive updates via email", enabled: true },
                  { name: "Session Reminders", description: "Get reminded before mentorship sessions", enabled: true },
                  { name: "Progress Updates", description: "Weekly progress reports", enabled: false },
                  { name: "New Mentor Alerts", description: "When new mentors join in your area", enabled: true },
                  { name: "Community Messages", description: "Notifications from chat groups", enabled: false },
                ].map((notification) => (
                  <div key={notification.name} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{notification.name}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {notification.description}
                      </p>
                    </div>
                    <button
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notification.enabled ? 'bg-blue-500' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          notification.enabled ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
