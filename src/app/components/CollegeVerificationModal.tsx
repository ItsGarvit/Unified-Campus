import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Building2, AlertCircle, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { CollegeSearchDropdown } from "./CollegeSearchDropdown";

interface CollegeVerificationModalProps {
  isDarkMode?: boolean;
  onClose?: () => void;
}

export function CollegeVerificationModal({ 
  isDarkMode = false,
  onClose 
}: CollegeVerificationModalProps) {
  const { user, updateCollege } = useAuth();
  const [selectedCollege, setSelectedCollege] = useState(user?.college || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedCollege.trim()) {
      setError("Please select or enter your college name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateCollege(selectedCollege.trim());
      onClose?.();
    } catch (err: any) {
      setError(err.message || "Failed to update college. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`w-full max-w-md rounded-3xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${
                isDarkMode ? "bg-amber-500/20" : "bg-amber-100"
              }`}>
                <AlertCircle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}>
                  Verify Your College
                </h2>
                <p className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  One-time verification required
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl ${
              isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
            }`}>
              <p className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                To ensure you're connected with the right college community, please select your college from the list below.
              </p>
            </div>

            {/* Current college info */}
            {user?.college && (
              <div className={`p-3 rounded-xl border-2 ${
                isDarkMode 
                  ? "bg-blue-900/20 border-blue-700" 
                  : "bg-blue-50 border-blue-200"
              }`}>
                <p className={`text-xs font-medium mb-1 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}>
                  Previously entered:
                </p>
                <p className={`text-sm ${
                  isDarkMode ? "text-blue-300" : "text-blue-700"
                }`}>
                  {user.college}
                </p>
              </div>
            )}

            {/* College dropdown */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                <Building2 className="w-4 h-4 inline mr-2" />
                Select Your College
              </label>
              <CollegeSearchDropdown
                showAllColleges={true}
                value={selectedCollege}
                onChange={setSelectedCollege}
                isDarkMode={isDarkMode}
              />
              {!user?.state && (
                <p className={`text-xs mt-1 ${
                  isDarkMode ? "text-amber-400" : "text-amber-600"
                }`}>
                  Your state is not set. You can enter your college name manually.
                </p>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className={`p-3 rounded-xl ${
                isDarkMode 
                  ? "bg-red-900/20 border border-red-700" 
                  : "bg-red-50 border border-red-200"
              }`}>
                <p className={`text-sm ${
                  isDarkMode ? "text-red-400" : "text-red-600"
                }`}>
                  {error}
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !selectedCollege.trim()}
              className={`w-full py-3 rounded-2xl font-bold text-white transition-all ${
                isLoading || !selectedCollege.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? "Saving..." : "Confirm College"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
