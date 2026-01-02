import { motion } from "motion/react";
import { ArrowRight, Users, GraduationCap, Briefcase, BookOpen, Target, TrendingUp } from "lucide-react";
import { useState } from "react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-8 pt-24 pb-16 relative overflow-hidden">
      {/* Background Animated Shapes */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-pink-200/30 to-purple-200/30 dark:from-pink-500/20 dark:to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-green-200/30 dark:from-blue-500/20 dark:to-green-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Welcome Text & CTA */}
        <div className="space-y-8 relative z-10">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-green-200 to-green-300 dark:from-green-600 dark:to-green-700 p-12 rounded-[3rem] shadow-xl"
          >
            <h1 className="text-gray-900 dark:text-gray-100">
              Connect with <span className="font-bold">Top Mentors</span>
              <br />
              Transform Your <span className="font-bold">Career Journey</span>
            </h1>
            <p className="mt-4 text-gray-800 dark:text-gray-200">
              Join thousands of students and mentors building successful careers together
            </p>
          </motion.div>

          <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05, x: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="bg-white dark:bg-gray-800 px-8 py-4 rounded-full shadow-xl font-semibold flex items-center gap-3 border-2 border-gray-900 dark:border-gray-100 group"
          >
            <span className="text-gray-900 dark:text-gray-100">GET STARTED</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-gray-900 dark:text-gray-100" />
          </motion.button>
        </div>

        {/* Right Side - Animated Tiles */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative h-[400px] bg-gradient-to-br from-yellow-200 to-yellow-300 dark:from-yellow-600 dark:to-yellow-700 rounded-[3rem] shadow-xl p-8 flex items-center justify-center overflow-hidden"
        >
          {/* Floating particles in background */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 left-10 w-4 h-4 bg-white/50 rounded-full blur-sm"
          />
          <motion.div
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-20 right-16 w-3 h-3 bg-white/50 rounded-full blur-sm"
          />
          <motion.div
            animate={{
              y: [0, -25, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-32 right-20 w-5 h-5 bg-white/50 rounded-full blur-sm"
          />
          
          {/* Animated Icon Tiles Grid */}
          <div className="grid grid-cols-3 gap-6 relative z-10">
            <AnimatedIconTile 
              icon={<Users />} 
              delay={0.5} 
              color="from-pink-400 to-rose-400"
              label="Students"
            />
            <AnimatedIconTile 
              icon={<GraduationCap />} 
              delay={0.6} 
              color="from-yellow-400 to-amber-400"
              label="Mentors"
            />
            <AnimatedIconTile 
              icon={<Briefcase />} 
              delay={0.7} 
              color="from-red-400 to-pink-400"
              label="Jobs"
            />
            <AnimatedIconTile 
              icon={<BookOpen />} 
              delay={0.8} 
              color="from-blue-400 to-cyan-400"
              label="Learn"
            />
            <AnimatedIconTile 
              icon={<Target />} 
              delay={0.9} 
              color="from-purple-400 to-fuchsia-400"
              label="Goals"
            />
            <AnimatedIconTile 
              icon={<TrendingUp />} 
              delay={1.0} 
              color="from-green-400 to-emerald-400"
              label="Growth"
            />
          </div>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          {/* Mouse Icon */}
          <div className="w-6 h-10 border-2 border-gray-900 dark:border-gray-200 rounded-full p-1 relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-gray-900 dark:bg-gray-200 rounded-full mx-auto"
            />
          </div>
          
          {/* Down Arrows */}
          <div className="flex flex-col gap-1">
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-200"
            />
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-200"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

interface AnimatedIconTileProps {
  icon: React.ReactNode;
  delay: number;
  color: string;
  label: string;
}

function AnimatedIconTile({ icon, delay, color, label }: AnimatedIconTileProps) {
  const [showLabel, setShowLabel] = useState(false);
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{
        scale: 1,
        rotate: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 200,
      }}
      whileHover={{
        scale: 1.2,
        rotate: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 },
      }}
      onHoverStart={() => setShowLabel(true)}
      onHoverEnd={() => setShowLabel(false)}
      className={`relative w-20 h-20 bg-gradient-to-br ${color} rounded-2xl shadow-lg flex items-center justify-center text-white cursor-pointer`}
    >
      <motion.div
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        {icon}
      </motion.div>
      
      {/* Tooltip label */}
      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shadow-lg"
        >
          {label}
        </motion.div>
      )}
    </motion.div>
  );
}