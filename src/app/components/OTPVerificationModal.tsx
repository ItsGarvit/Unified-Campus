import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, X, Loader2, CheckCircle, RefreshCw } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./ui/input-otp";
import { toast } from "sonner";

interface OTPVerificationModalProps {
  email: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export function OTPVerificationModal({
  email,
  userName,
  isOpen,
  onClose,
  onVerified
}: OTPVerificationModalProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Send OTP when modal opens
  useEffect(() => {
    if (isOpen && !isVerified) {
      handleSendOTP();
    }
  }, [isOpen]);

  // Timer for OTP expiry
  useEffect(() => {
    if (!isOpen || isVerified || remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isVerified, remainingTime]);

  const handleSendOTP = async () => {
    setIsSending(true);
    setError(null);
    setOtp(""); // Clear previous input

    try {
      // Call Netlify Function
      const response = await fetch('/.netlify/functions/sendOtp', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification code sent to your email!");
        setRemainingTime(300); // Reset timer to 5 minutes
        setCanResend(false);
      } else {
        throw new Error(data.error || "Failed to send OTP");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate OTP");
      setError(err.message || "Failed to generate OTP. Please try again.");
      setCanResend(true); // Allow retry if it failed
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Call Netlify Function to Verify
      const response = await fetch('/.netlify/functions/verifyOtp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        setIsVerified(true);
        toast.success("Email Verified Successfully!");
        
        // Notify parent after a brief delay
        setTimeout(() => {
          onVerified();
        }, 1500);
      } else {
        throw new Error(data.error || "Verification failed");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Invalid OTP");
      toast.error(err.message || "Invalid OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 border-4 border-gray-900 dark:border-gray-100 relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              animate={isVerified ? { scale: [1, 1.2, 1] } : {}}
              className={`inline-block p-4 rounded-3xl mb-4 border-2 border-gray-900 dark:border-gray-100 ${
                isVerified
                  ? "bg-gradient-to-br from-green-400 to-emerald-400"
                  : "bg-gradient-to-br from-blue-400 to-cyan-400"
              }`}
            >
              {isVerified ? (
                <CheckCircle className="w-12 h-12 text-white" />
              ) : (
                <Mail className="w-12 h-12 text-white" />
              )}
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {isVerified ? "Email Verified!" : "Verify Your Email"}
            </h2>
            
            {!isVerified && (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Enter the 6-digit code sent to<br />
                <span className="font-semibold text-gray-900 dark:text-gray-100">{email}</span>
              </p>
            )}
          </div>

          {!isVerified ? (
            <>
              {/* OTP Input */}
              <div className="flex justify-center mb-6">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={isVerifying || isSending}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-sm text-center mb-4">{error}</p>
              )}

              {/* Timer and Resend */}
              <div className="text-center mb-6">
                {remainingTime > 0 ? (
                  <p className="text-sm text-gray-500">
                    OTP expires in <span className="font-semibold">{formatTime(remainingTime)}</span>
                  </p>
                ) : (
                  <p className="text-sm text-red-500">OTP expired</p>
                )}
                
                <button
                  onClick={handleSendOTP}
                  disabled={!canResend || isSending}
                  className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1 mx-auto"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      {canResend ? "Resend OTP" : `Resend in ${remainingTime}s`}
                    </>
                  )}
                </button>
              </div>

              {/* Verify Button */}
              <motion.button
                whileHover={{ scale: isVerifying ? 1 : 1.02 }}
                whileTap={{ scale: isVerifying ? 1 : 0.98 }}
                onClick={handleVerify}
                disabled={isVerifying || otp.length !== 6}
                className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-500 text-white font-bold py-4 rounded-2xl border-2 border-gray-900 dark:border-gray-100 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </motion.button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your email has been verified successfully!
              </p>
              <p className="text-sm text-gray-500">
                Continuing with registration...
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}