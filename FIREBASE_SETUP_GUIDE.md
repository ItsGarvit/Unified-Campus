# Firebase Setup Guide for UnifiedCampus

## Overview

Your UnifiedCampus platform now uses **Firebase Authentication** and **Firestore Database** for secure user authentication and data storage. This guide will help you set up your Firebase project.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "UnifiedCampus")
4. Optional: Enable Google Analytics (recommended for tracking)
5. Click **"Create project"**

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **web icon (</>)** to add a web app
2. Give your app a nickname (e.g., "UnifiedCampus Web")
3. Optional: Check "Also set up Firebase Hosting" if you want to deploy later
4. Click **"Register app"**
5. You'll see your Firebase configuration - **keep this page open!**

## Step 3: Get Your Firebase Configuration

Copy the `firebaseConfig` object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 4: Add Configuration to Your Project

1. Open the file `/src/app/config/firebase.ts`
2. Replace the placeholder values with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

## Step 5: Enable Authentication Methods

1. In Firebase Console, go to **Build → Authentication**
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable **"Email/Password"** authentication:
   - Click on "Email/Password"
   - Toggle the **"Enable"** switch
   - Click **"Save"**

## Step 6: Set Up Firestore Database

1. In Firebase Console, go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll add security rules next)
4. Select your Firestore location (choose closest to your users)
5. Click **"Enable"**

## Step 7: Configure Firestore Security Rules

1. Go to **Firestore Database → Rules** tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only authenticated users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Prevent unauthorized access to all other documents
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

## Step 8: Optional - Set Up Firestore Indexes

For better query performance, you can add indexes. For now, Firestore will suggest indexes as needed.

## Testing Your Setup

1. Run your application
2. Try creating a new account (Student or Mentor)
3. Check your Firebase Console:
   - **Authentication → Users** - You should see the new user
   - **Firestore Database → Data** - You should see a `users` collection with the user data

## Security Notes

⚠️ **Important Security Reminders:**

1. **Never commit your Firebase config to public repositories** if you have sensitive data
2. The `apiKey` in Firebase config is safe to expose (it's needed for the frontend)
3. Security is enforced through Firestore security rules, not by hiding the config
4. Always use proper security rules to protect your data
5. Enable **App Check** in production for additional security

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
This error means Firebase Authentication is not properly set up. **Follow these steps exactly:**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**
3. **Enable Authentication**:
   - Click on **"Build"** in the left sidebar
   - Click on **"Authentication"**
   - Click the **"Get Started"** button
   - Go to the **"Sign-in method"** tab
   - Click on **"Email/Password"**
   - Toggle **"Enable"** to ON
   - Click **"Save"**
4. **Verify your configuration** in `/src/app/config/firebase.ts`:
   - Make sure all placeholder values are replaced with your actual Firebase values
   - The `apiKey`, `authDomain`, `projectId`, and `appId` must all be correct
5. **Refresh your application**

### "Firebase: Firebase App named '[DEFAULT]' already exists"
- This has been fixed in the code
- If you still see this, clear your browser cache and restart the dev server

### "Firebase: Error (auth/unauthorized-domain)"
- Go to **Authentication → Settings → Authorized domains**
- Add your deployment domain (e.g., `localhost`, `your-app.com`)

### "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure the user is authenticated before accessing data

### "Cannot find module 'firebase/auth'"
- The Firebase package is already installed
- If you see this error, try restarting your development server

## Features Implemented

✅ **User Authentication**
- Email/Password signup and login
- Separate authentication for Students and Mentors
- Session persistence across page refreshes
- Secure logout functionality

✅ **User Data Storage**
- Student profiles with academic details
- Mentor profiles with professional details
- GPS-based location auto-fill
- All data stored securely in Firestore

✅ **Security**
- Password validation (minimum 6 characters)
- Email validation
- User type verification on login
- Protected user data with Firestore rules

## Next Steps

After setting up Firebase, you can:

1. **Customize the user experience** - Add profile editing, password reset, etc.
2. **Add more features** - Implement mentorship matching, scheduling, etc.
3. **Deploy your app** - Use Firebase Hosting or another platform
4. **Monitor usage** - Check Firebase Console for user analytics

## Support

If you encounter any issues:
1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review the [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
3. Check the [Firestore Getting Started Guide](https://firebase.google.com/docs/firestore)

---

**Your UnifiedCampus platform is now powered by Firebase! 🚀**