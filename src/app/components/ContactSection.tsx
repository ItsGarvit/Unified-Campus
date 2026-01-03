import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Web3Forms configuration - Get your free access key at https://web3forms.com/
// Just enter garvitbankoti@gmail.com, verify, and copy the access key
const WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE"; // Replace with your Web3Forms access key

export function ContactSection() {
  const ref = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(ref, { once: true });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Use Web3Forms API - free and simple
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Contact Message from ${formData.name} - UnifiedCampus`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        toast.success("Message sent successfully! 🎉");
        
        // Reset form
        setFormData({ name: "", email: "", message: "" });
        
        // Reset success state after 3 seconds
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact Form Error:", error);
      toast.error("Failed to send message. Please try again or email us directly.");
    } finally {
      setIsLoading(false);
    }
  };

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
                    <p className="text-gray-800 dark:text-gray-200">garvitbankoti@gmail.com</p>
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
              ref={formRef}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-600 dark:to-pink-600 p-8 rounded-3xl shadow-lg border-2 border-gray-900 dark:border-gray-100 space-y-4"
            >
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={4}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-colors ${
                  isSuccess 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Message Sent Successfully!
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}