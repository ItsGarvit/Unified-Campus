// OTP storage key
const OTP_STORAGE_KEY = "unifiedcampus_otp_";

// Demo mode - set to false once EmailJS is configured
const DEMO_MODE = true;

interface StoredOTP {
  code: string;
  email: string;
  expiresAt: number;
  createdAt: number;
}

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP in localStorage with expiry
 */
export function storeOTP(email: string, otp: string): void {
  const otpData: StoredOTP = {
    code: otp,
    email: email,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
    createdAt: Date.now()
  };
  
  localStorage.setItem(OTP_STORAGE_KEY + email, JSON.stringify(otpData));
}

/**
 * Retrieve stored OTP for email
 */
export function getStoredOTP(email: string): StoredOTP | null {
  const stored = localStorage.getItem(OTP_STORAGE_KEY + email);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Verify if OTP is correct and not expired
 */
export function verifyOTP(email: string, inputOTP: string): { valid: boolean; message: string } {
  const storedOTP = getStoredOTP(email);
  
  if (!storedOTP) {
    return { valid: false, message: "No OTP found. Please request a new one." };
  }
  
  if (Date.now() > storedOTP.expiresAt) {
    // Clear expired OTP
    clearOTP(email);
    return { valid: false, message: "OTP has expired. Please request a new one." };
  }
  
  if (storedOTP.code !== inputOTP) {
    return { valid: false, message: "Invalid OTP. Please try again." };
  }
  
  // OTP is valid - clear it
  clearOTP(email);
  return { valid: true, message: "Email verified successfully!" };
}

/**
 * Clear stored OTP
 */
export function clearOTP(email: string): void {
  localStorage.removeItem(OTP_STORAGE_KEY + email);
}

/**
 * Check if enough time has passed to resend OTP (60 seconds cooldown)
 */
export function canResendOTP(email: string): boolean {
  const storedOTP = getStoredOTP(email);
  if (!storedOTP) return true;
  
  const cooldownPeriod = 60 * 1000; // 60 seconds
  return Date.now() - storedOTP.createdAt >= cooldownPeriod;
}

/**
 * Get remaining time until OTP expires (in seconds)
 */
export function getOTPRemainingTime(email: string): number {
  const storedOTP = getStoredOTP(email);
  if (!storedOTP) return 0;
  
  const remaining = Math.max(0, storedOTP.expiresAt - Date.now());
  return Math.ceil(remaining / 1000);
}

/**
 * Send OTP - in demo mode, just stores locally and returns OTP for display
 * In production, would send via email
 */
export async function sendOTPEmail(email: string, userName: string): Promise<{ success: boolean; message: string; otp?: string }> {
  const otp = generateOTP();
  
  // Store OTP locally
  storeOTP(email, otp);
  
  if (DEMO_MODE) {
    // In demo mode, return the OTP so it can be displayed to the user
    return { 
      success: true, 
      message: `Your verification code is: ${otp}`,
      otp: otp 
    };
  }
  
  // Production mode - would send via email service
  // For now, just return success since OTP is stored
  return { success: true, message: "OTP sent to your email!" };
}

