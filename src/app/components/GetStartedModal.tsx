import { motion, AnimatePresence } from "motion/react";
import { X, GraduationCap, BookOpen } from "lucide-react";
import { useState } from "react";

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToLogin: (role: "student" | "mentor") => void;
  onNavigateToSignup: (role: "student" | "mentor") => void;
  onLocationCaptured?: (location: { latitude: number; longitude: number }) => void;
  mode: "login" | "signup";
}

export function GetStartedModal({
  isOpen,
  onClose,
  onNavigateToLogin,
  onNavigateToSignup,
  onLocationCaptured,
  mode,
}: GetStartedModalProps) {
  const [selectedRole, setSelectedRole] = useState<"student" | "mentor" | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const handleRoleSelect = (role: "student" | "mentor") => {
    setSelectedRole(role);
    setShowLocationPrompt(true);
  };

  const handleLocationAccess = () => {
    // Request location access
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Location granted successfully - capture coordinates and navigate to login
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          
          if (onLocationCaptured) {
            onLocationCaptured(location);
          }
          
          if (selectedRole) {
            if (mode === "login") {
              onNavigateToLogin(selectedRole);
            } else {
              onNavigateToSignup(selectedRole);
            }
          }
          onClose();
          setShowLocationPrompt(false);
          setSelectedRole(null);
        },
        () => {
          // Location access failed or denied - silently proceed without location
          // This is expected behavior in many environments, so we don't log errors
          
          if (selectedRole) {
            if (mode === "login") {
              onNavigateToLogin(selectedRole);
            } else {
              onNavigateToSignup(selectedRole);
            }
          }
          onClose();
          setShowLocationPrompt(false);
          setSelectedRole(null);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 300000
        }
      );
    } else {
      // Geolocation not supported - silently proceed without location
      
      if (selectedRole) {
        onNavigateToLogin(selectedRole);
      }
      onClose();
      setShowLocationPrompt(false);
      setSelectedRole(null);
    }
  };

  const handleSkipLocation = () => {
    // Skip location and navigate directly to login
    if (selectedRole) {
      if (mode === "login") {
        onNavigateToLogin(selectedRole);
      } else {
        onNavigateToSignup(selectedRole);
      }
    }
    onClose();
    setShowLocationPrompt(false);
    setSelectedRole(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-[3rem] shadow-2xl max-w-2xl w-full p-8 md:p-12 border-4 border-gray-900 dark:border-gray-100 relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-900 dark:text-gray-100" />
              </button>

              {!showLocationPrompt ? (
                <>
                  {/* Role Selection */}
                  <h2 className="text-center mb-4 font-bold text-gray-900 dark:text-gray-100">
                    {mode === "login" ? "Login" : "Sign Up"}
                  </h2>
                  <p className="text-center mb-12 text-gray-700 dark:text-gray-300">
                    {mode === "login" 
                      ? "Choose your role to login to UnifiedCampus" 
                      : "Choose how you want to join UnifiedCampus"}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Student Option */}
                    <motion.button
                      whileHover={{ scale: 1.05, rotate: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRoleSelect("student")}
                      className="bg-gradient-to-br from-blue-300 to-cyan-300 dark:from-blue-500 dark:to-cyan-500 p-8 rounded-3xl shadow-xl border-2 border-gray-900 dark:border-gray-100 text-center space-y-4"
                    >
                      <div className="flex justify-center">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl">
                          <GraduationCap className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">
                        I'm a Student
                      </h3>
                      <p className="text-gray-800 dark:text-gray-200">
                        Looking for mentorship and career guidance
                      </p>
                    </motion.button>

                    {/* Mentor Option */}
                    <motion.button
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRoleSelect("mentor")}
                      className="bg-gradient-to-br from-purple-300 to-pink-300 dark:from-purple-500 dark:to-pink-500 p-8 rounded-3xl shadow-xl border-2 border-gray-900 dark:border-gray-100 text-center space-y-4"
                    >
                      <div className="flex justify-center">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl">
                          <BookOpen className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">
                        I'm a Mentor
                      </h3>
                      <p className="text-gray-800 dark:text-gray-200">
                        Ready to guide and inspire the next generation
                      </p>
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  {/* Location Access Prompt */}
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center space-y-6"
                  >
                    <div className="bg-gradient-to-br from-yellow-300 to-orange-300 dark:from-yellow-500 dark:to-orange-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                      <svg
                        className="w-12 h-12 text-gray-900 dark:text-gray-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>

                    <h3 className="font-bold text-gray-900 dark:text-gray-100">
                      Enable Location Access
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
                      We'd like to access your location to automatically fill your address information 
                      and show you colleges and opportunities in your region. This helps us get you started faster!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLocationAccess}
                        className="bg-gradient-to-r from-green-400 to-blue-400 dark:from-green-500 dark:to-blue-500 px-8 py-3 rounded-full font-semibold shadow-lg border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100"
                      >
                        Allow Location
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSkipLocation}
                        className="bg-gray-300 dark:bg-gray-600 px-8 py-3 rounded-full font-semibold shadow-lg border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100"
                      >
                        Skip for Now
                      </motion.button>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}