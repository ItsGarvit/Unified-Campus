import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Set to true to use demo mode (localStorage) instead of Firebase
// Change to false once you've configured Firebase
export const USE_DEMO_MODE = false; // <--- MAKE SURE THIS IS FALSE

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_authDomain,
  projectId: import.meta.env.VITE_FIREBASE_projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_appId,
  measurementId: import.meta.env.VITE_FIREBASE_measurementId
};

// Validate Firebase configuration
function validateFirebaseConfig() {

    // ADD THIS LINE HERE:
  console.log("DEBUG: Current Config:", firebaseConfig);

  const missingFields = [];
  
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
    missingFields.push('apiKey');
  }
  if (!firebaseConfig.authDomain || firebaseConfig.authDomain.includes("YOUR_PROJECT_ID")) {
    missingFields.push('authDomain');
  }
  if (!firebaseConfig.projectId || firebaseConfig.projectId === "YOUR_PROJECT_ID") {
    missingFields.push('projectId');
  }
  if (!firebaseConfig.appId || firebaseConfig.appId === "YOUR_APP_ID") {
    missingFields.push('appId');
  }

  if (missingFields.length > 0) {
    console.warn(
      '⚠️ Firebase Configuration Incomplete\n\n' +
      'Missing or invalid Firebase configuration fields: ' + missingFields.join(', ') + '\n\n' +
      '📝 Currently running in DEMO MODE (using localStorage)\n\n' +
      'To use Firebase:\n' +
      '1. Go to https://console.firebase.google.com/\n' +
      '2. Create a project and get your configuration\n' +
      '3. Update /src/app/config/firebase.ts with your values\n' +
      '4. Set USE_DEMO_MODE = false\n' +
      '5. Enable Email/Password authentication in Firebase Console\n\n' +
      'See FIREBASE_SETUP_GUIDE.md for detailed instructions.'
    );
    
    return false;
  }
  
  return true;
}

let app: any = null;
let auth: any = null;
let db: any = null;

// Only initialize Firebase if not in demo mode and config is valid
if (!USE_DEMO_MODE) {
  const isConfigValid = validateFirebaseConfig();
  
  if (isConfigValid) {
    // Initialize Firebase - check if app already exists
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    // Initialize Firebase Authentication
    auth = getAuth(app);
    
    // Initialize Firestore
    db = getFirestore(app);
    
    console.log('✅ Firebase initialized successfully');
  } else {
    console.error('❌ Firebase configuration is invalid. Please update your config or enable DEMO MODE.');
  }
} else {
  console.log('🎭 Running in DEMO MODE - using localStorage instead of Firebase');
}

export { auth, db };
export default app;