import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, BookOpen, Mail, Phone, Briefcase, Building2, Award, GraduationCap, Linkedin } from "lucide-react";

export function MentorDashboard() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome back, {user.fullName}! 🎓
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Mentor Dashboard
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-pink-400 dark:from-red-500 dark:to-pink-500 text-white font-bold rounded-2xl border-2 border-gray-900 dark:border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl p-8 md:p-12 border-4 border-gray-900 dark:border-gray-100 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 p-6 rounded-3xl border-2 border-gray-900 dark:border-gray-100"
              >
                <BookOpen className="w-16 h-16 text-white" />
              </motion.div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{user.phone}</p>
                    </div>
                  </div>
                )}
                {user.jobTitle && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Job Title</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{user.jobTitle}</p>
                    </div>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{user.company}</p>
                    </div>
                  </div>
                )}
                {user.experience && (
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{user.experience} years</p>
                    </div>
                  </div>
                )}
                {user.highestQualification && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Qualification</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{user.highestQualification}</p>
                    </div>
                  </div>
                )}
                {user.linkedIn && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <Linkedin className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">LinkedIn</p>
                      <a href={user.linkedIn} target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                        View Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Expertise Tags */}
              {user.expertise && user.expertise.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Areas of Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {user.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 text-white text-sm font-semibold rounded-xl border-2 border-gray-900 dark:border-gray-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {user.bio && (
                <div className="mt-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Professional Bio</p>
                  <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-lg p-6 border-2 border-gray-900 dark:border-gray-100">
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-500 mb-2">0</p>
              <p className="text-gray-600 dark:text-gray-400 font-semibold">Active Mentees</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-lg p-6 border-2 border-gray-900 dark:border-gray-100">
            <div className="text-center">
              <p className="text-4xl font-bold text-pink-500 mb-2">0</p>
              <p className="text-gray-600 dark:text-gray-400 font-semibold">Sessions Conducted</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-lg p-6 border-2 border-gray-900 dark:border-gray-100">
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500 mb-2">0</p>
              <p className="text-gray-600 dark:text-gray-400 font-semibold">Placements Helped</p>
            </div>
          </div>
        </motion.div>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 rounded-[2rem] shadow-lg p-8 border-2 border-gray-900 dark:border-gray-100 text-center"
        >
          <h3 className="font-bold text-white mb-2">
            🌟 Ready to Inspire Students!
          </h3>
          <p className="text-white/90">
            Share your expertise, guide future professionals, and make a lasting impact with UnifiedCampus.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
