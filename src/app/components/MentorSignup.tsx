import { motion } from "motion/react";
import { useState } from "react";
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowLeft, User, Phone, Briefcase, Building2, Award, GraduationCap, Linkedin, FileText, Target } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface MentorSignupProps {
  onBack: () => void;
  onSwitchToLogin?: () => void;
}

export function MentorSignup({ onBack, onSwitchToLogin }: MentorSignupProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    jobTitle: "",
    company: "",
    experience: "",
    expertise: [] as string[],
    highestQualification: "",
    linkedIn: "",
    bio: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const expertiseOptions = [
    "Software Engineering",
    "Data Science",
    "Machine Learning",
    "Web Development",
    "Mobile Development",
    "DevOps",
    "Cloud Computing",
    "Cybersecurity",
    "UI/UX Design",
    "Product Management",
    "Business Analysis",
    "Digital Marketing",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Validate at least one expertise is selected
    if (formData.expertise.length === 0) {
      setError("Please select at least one area of expertise.");
      return;
    }

    setIsLoading(true);
    try {
      await signup(formData, formData.password, 'mentor');
      // Success - the AuthContext will handle redirecting to dashboard
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleExpertiseToggle = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 flex items-center justify-center p-4">
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

        {/* Signup Card */}
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
              className="inline-block bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 p-4 rounded-3xl mb-4 border-2 border-gray-900 dark:border-gray-100"
            >
              <BookOpen className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
              Mentor Registration
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join UnifiedCampus and start mentoring students
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4">
                <p className="text-red-700 dark:text-red-300 text-center font-medium">
                  ❌ {error}
                </p>
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 transition-all"
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 transition-all"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 transition-all"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 transition-all"
                  placeholder="123-456-7890"
                />
              </div>
            </div>

            {/* Job Title Field */}
            <div>
              <label htmlFor="jobTitle" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Current Job Title
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 transition-all"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
            </div>

            {/* Company Field */}
            <div>
              <label htmlFor="company" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 transition-all"
                  placeholder="e.g., Google, Microsoft, Amazon"
                />
              </div>
            </div>

            {/* Experience Field */}
            <div>
              <label htmlFor="experience" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Years of Experience
              </label>
              <div className="relative">
                <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 transition-all"
                >
                  <option value="">Select Experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
            </div>

            {/* Expertise Field */}
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Target className="inline w-5 h-5 mr-2" />
                Areas of Expertise (select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-700 rounded-2xl border-2 border-gray-900 dark:border-gray-100">
                {expertiseOptions.map(option => (
                  <motion.button
                    key={option}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleExpertiseToggle(option)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                      formData.expertise.includes(option) 
                        ? "bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 text-white border-gray-900 dark:border-gray-100 shadow-md" 
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600"
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
              {formData.expertise.length > 0 && (
                <p className="mt-2 text-sm text-purple-600 dark:text-purple-400">
                  Selected: {formData.expertise.length} area{formData.expertise.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Highest Qualification Field */}
            <div>
              <label htmlFor="highestQualification" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Highest Qualification
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <select
                  id="highestQualification"
                  name="highestQualification"
                  value={formData.highestQualification}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 transition-all"
                >
                  <option value="">Select Qualification</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Professional Certification">Professional Certification</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* LinkedIn Field */}
            <div>
              <label htmlFor="linkedIn" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                LinkedIn Profile (Optional)
              </label>
              <div className="relative">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="url"
                  id="linkedIn"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 transition-all"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            {/* Bio Field */}
            <div>
              <label htmlFor="bio" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Professional Bio
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 transition-all resize-none"
                  placeholder="Share your professional journey, achievements, and what drives you to mentor students..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 text-white font-bold py-4 rounded-2xl border-2 border-gray-900 dark:border-gray-100 shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Mentor Account"}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              {onSwitchToLogin ? (
                <button
                  onClick={onSwitchToLogin}
                  className="text-purple-600 dark:text-purple-400 hover:underline font-bold"
                >
                  Login here
                </button>
              ) : (
                <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline font-bold">
                  Login here
                </a>
              )}
            </p>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-blue-300 to-cyan-300 dark:from-blue-500 dark:to-cyan-500 rounded-[2rem] opacity-50 blur-sm -z-10"
        />
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-10 w-16 h-16 bg-gradient-to-br from-green-300 to-emerald-300 dark:from-green-500 dark:to-emerald-500 rounded-[2rem] opacity-50 blur-sm -z-10"
        />
      </motion.div>
    </div>
  );
}