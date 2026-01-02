import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="contact" ref={ref} className="py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-center mb-12 font-bold text-gray-900 dark:text-gray-100">
            Get In Touch
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-600 dark:to-purple-600 p-6 rounded-3xl shadow-lg border-2 border-gray-900 dark:border-gray-100">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Email</p>
                    <p className="text-gray-800 dark:text-gray-200">contact@unifiedcampus.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-200 to-yellow-200 dark:from-green-600 dark:to-yellow-600 p-6 rounded-3xl shadow-lg border-2 border-gray-900 dark:border-gray-100">
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Phone</p>
                    <p className="text-gray-800 dark:text-gray-200">+91 9977958848</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-200 to-orange-200 dark:from-pink-600 dark:to-orange-600 p-6 rounded-3xl shadow-lg border-2 border-gray-900 dark:border-gray-100">
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Location</p>
                    <p className="text-gray-800 dark:text-gray-200">Indore, MP</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-600 dark:to-pink-600 p-8 rounded-3xl shadow-lg border-2 border-gray-900 dark:border-gray-100 space-y-4"
            >
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                Send Message
                <Send className="w-5 h-5" />
              </motion.button>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}