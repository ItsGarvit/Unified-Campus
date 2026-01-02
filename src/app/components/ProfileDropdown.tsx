import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, Trash2, ChevronDown, AlertTriangle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface ProfileDropdownProps {
  isDarkMode?: boolean;
}

export function ProfileDropdown({ isDarkMode = false }: ProfileDropdownProps) {
  const { user, logout, deleteAccount } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowDeleteConfirm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsOpen(false);
    logout();
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
    } catch (error) {
      console.error("Failed to delete account:", error);
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <div ref={dropdownRef} className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-shadow">
          {user.fullName.charAt(0)}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""} ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && !showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-xl border overflow-hidden ${
              isDarkMode 
                ? "bg-gray-800 border-gray-700" 
                : "bg-white border-gray-200"
            }`}
          >
            {/* User Info */}
            <div className={`px-4 py-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
              <p className={`font-semibold truncate ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                {user.fullName}
              </p>
              <p className={`text-sm truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {user.email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={handleSignOut}
                className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors ${
                  isDarkMode 
                    ? "text-gray-300 hover:bg-gray-700" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Sign Out</span>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors ${
                  isDarkMode 
                    ? "text-red-400 hover:bg-red-900/20" 
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span className="font-medium">Delete Account</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-xl border overflow-hidden ${
              isDarkMode 
                ? "bg-gray-800 border-gray-700" 
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full ${isDarkMode ? "bg-red-900/30" : "bg-red-100"}`}>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className={`font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                  Delete Account?
                </h3>
              </div>
              
              <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                This action cannot be undone. All your data will be permanently deleted.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setIsOpen(false);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl font-medium text-sm transition-colors ${
                    isDarkMode 
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 py-2 px-3 rounded-xl font-medium text-sm bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
