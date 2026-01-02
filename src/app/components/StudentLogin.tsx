import { motion } from "motion/react";
import { useState } from "react";
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface StudentLoginProps {
  onBack: () => void;
  onSwitchToSignup?: () => void;
}

export function StudentLogin({ onBack, onSwitchToSignup }: StudentLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password, 'student');
      // Success - the AuthContext will handle redirecting to dashboard
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </motion.button>

        {/* Login Card */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl p-8 md:p-12 border-4 border-gray-900 dark:border-gray-100"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block bg-gradient-to-br from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-500 p-4 rounded-3xl mb-4 border-2 border-gray-900 dark:border-gray-100"
            >
              <GraduationCap className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
              Student Login
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Continue your learning journey
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4">
                <p className="text-red-700 dark:text-red-300 text-center font-medium">
                  ❌ {error}
                </p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-gray-900 dark:border-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-300"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-500 text-white font-bold py-4 rounded-2xl border-2 border-gray-900 dark:border-gray-100 shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login to Dashboard"}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              {onSwitchToSignup ? (
                <button
                  onClick={onSwitchToSignup}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                >
                  Sign up as a student
                </button>
              ) : (
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
                  Sign up as a student
                </a>
              )}
            </p>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-300 dark:from-pink-500 dark:to-purple-500 rounded-[2rem] opacity-50 blur-sm -z-10"
        />
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-10 w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-300 dark:from-yellow-500 dark:to-orange-500 rounded-[2rem] opacity-50 blur-sm -z-10"
        />
      </motion.div>
    </div>
  );
}