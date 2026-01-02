import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

interface HeaderProps {
  onGetStarted: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function Header({ onGetStarted, theme, toggleTheme }: HeaderProps) {
  const [activeLink, setActiveLink] = useState("");

  const scrollToSection = (id: string) => {
    setActiveLink(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-3 rounded-2xl shadow-lg">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 4L4 10V22L16 28L28 22V10L16 4Z"
                  fill="white"
                  fillOpacity="0.9"
                />
                <path
                  d="M16 12L10 15V21L16 24L22 21V15L16 12Z"
                  fill="url(#gradient)"
                />
                <defs>
                  <linearGradient id="gradient" x1="10" y1="12" x2="22" y2="24">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
              UnifiedCampus
            </span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {["about", "features", "contact"].map((item) => (
                <li key={item}>
                  <motion.button
                    onClick={() => scrollToSection(item)}
                    className={`capitalize font-medium relative transition-colors ${
                      activeLink === item
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {item}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Login/Signup & Theme Toggle */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-6 py-3 rounded-full font-semibold shadow-lg text-white hover:shadow-xl transition-shadow"
            >
              Login / Signup
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="bg-gray-800 dark:bg-gray-200 p-3 rounded-full shadow-lg"
              transition={{ duration: 0.3 }}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-yellow-300" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>
      
      {/* Separator Line */}
      <div className="fixed top-[76px] left-0 right-0 z-40 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
    </>
  );
}