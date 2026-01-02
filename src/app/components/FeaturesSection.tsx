import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Target, Zap, Shield, Users, BookOpen, Award } from "lucide-react";

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const features = [
    {
      icon: <Target className="w-10 h-10" />,
      title: "Personalized Matching",
      description:
        "Our AI-powered algorithm matches you with mentors based on your goals, interests, and career aspirations.",
      color: "from-pink-300 to-purple-300 dark:from-pink-500 dark:to-purple-500",
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Real-Time Communication",
      description:
        "Connect instantly with mentors through chat, video calls, and scheduled sessions for seamless learning.",
      color: "from-yellow-300 to-orange-300 dark:from-yellow-500 dark:to-orange-500",
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Verified Professionals",
      description:
        "All mentors are thoroughly vetted industry experts with proven track records in their fields.",
      color: "from-blue-300 to-cyan-300 dark:from-blue-500 dark:to-cyan-500",
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Community Network",
      description:
        "Join a vibrant community of learners and professionals sharing knowledge and opportunities.",
      color: "from-green-300 to-emerald-300 dark:from-green-500 dark:to-emerald-500",
    },
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: "Resource Library",
      description:
        "Access curated learning materials, interview prep guides, and career development resources.",
      color: "from-rose-300 to-pink-300 dark:from-rose-500 dark:to-pink-500",
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Placement Support",
      description:
        "Get dedicated support throughout your job search with resume reviews and mock interviews.",
      color: "from-indigo-300 to-purple-300 dark:from-indigo-500 dark:to-purple-500",
    },
  ];

  return (
    <section id="features" ref={ref} className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-600 dark:to-yellow-700 px-12 py-4 rounded-full shadow-xl border-2 border-gray-900 dark:border-gray-100">
            <h2 className="font-bold text-gray-900 dark:text-gray-100">
              CORE FEATURES WE OFFER
            </h2>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
  };
  index: number;
  isInView: boolean;
}

function FeatureCard({ feature, index, isInView }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="flex gap-6 items-start"
    >
      {/* Icon */}
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
        className={`flex-shrink-0 w-32 h-32 bg-gradient-to-br ${feature.color} rounded-3xl shadow-lg flex items-center justify-center border-2 border-gray-900 dark:border-gray-100`}
      >
        <div className="text-gray-900 dark:text-gray-100">{feature.icon}</div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-3xl shadow-lg border-2 border-gray-900 dark:border-gray-100">
        <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">
          {feature.title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
      </div>
    </motion.div>
  );
}
