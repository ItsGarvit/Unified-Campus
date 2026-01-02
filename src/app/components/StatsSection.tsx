import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { Users, GraduationCap, TrendingUp } from "lucide-react";

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-16 px-4 md:px-8 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
            Our Impact in Numbers
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Real-time statistics from our growing community
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-16">
          <StatItem
            icon={<Users className="w-8 h-8" />}
            value={2547}
            label="Students Registered"
            color="text-blue-600 dark:text-blue-400"
            delay={0.2}
            isInView={isInView}
          />
          <StatItem
            icon={<GraduationCap className="w-8 h-8" />}
            value={342}
            label="Expert Mentors"
            color="text-purple-600 dark:text-purple-400"
            delay={0.4}
            isInView={isInView}
          />
          <StatItem
            icon={<TrendingUp className="w-8 h-8" />}
            value={1823}
            label="Successful Placements"
            color="text-green-600 dark:text-green-400"
            delay={0.6}
            isInView={isInView}
          />
        </div>
      </div>
    </section>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  delay: number;
  isInView: boolean;
}

function StatItem({ icon, value, label, color, delay, isInView }: StatItemProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, type: "spring" }}
      className="text-center"
    >
      <motion.div
        className={`flex justify-center mb-4 ${color}`}
        whileHover={{ scale: 1.2, rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      
      <motion.div
        className={`text-6xl font-bold mb-2 ${color}`}
        key={count}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3 }}
      >
        {count.toLocaleString()}
        <span className="text-4xl">+</span>
      </motion.div>
      
      <p className="font-semibold text-gray-800 dark:text-gray-200">{label}</p>
      
      {/* Animated underline */}
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: "60%" } : {}}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        className={`h-1 ${color.replace('text-', 'bg-')} mx-auto mt-3 rounded-full`}
      />
    </motion.div>
  );
}
