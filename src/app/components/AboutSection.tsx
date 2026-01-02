import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Heart, Sparkles } from "lucide-react";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="about" ref={ref} className="py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-green-200 to-blue-200 dark:from-green-600 dark:to-blue-600 p-12 rounded-[3rem] shadow-2xl border-2 border-gray-900 dark:border-gray-100"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-pink-600 dark:text-pink-300" />
            <h2 className="font-bold text-gray-900 dark:text-gray-100">About UnifiedCampus</h2>
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </div>
          
          <div className="space-y-6 text-gray-800 dark:text-gray-200">
            <p>
              UnifiedCampus is revolutionizing the way students connect with industry professionals. 
              We believe that everyone deserves access to quality mentorship and career guidance, 
              regardless of their background or location.
            </p>
            
            <p>
              Our platform leverages cutting-edge technology to create meaningful connections 
              between ambitious students and experienced mentors. Through personalized matching, 
              real-time communication, and comprehensive career support, we're helping thousands 
              of students achieve their career goals.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                🎯 Our Mission: To democratize access to mentorship and empower the next 
                generation of professionals through meaningful connections and expert guidance.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}