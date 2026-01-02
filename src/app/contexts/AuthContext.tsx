import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  deleteUser,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, USE_DEMO_MODE } from '../config/firebase';

export interface User {
  id: string;
  email: string;
  userType: 'student' | 'mentor';
  fullName: string;
  // Student specific fields
  phone?: string;
  college?: string;
  collegeVerified?: boolean; // New: true if college selected from dropdown
  branch?: string;
  year?: string;
  region?: string;
  city?: string;
  state?: string;
  // Mentor specific fields
  jobTitle?: string;
  company?: string;
  experience?: string;
  expertise?: string[];
  highestQualification?: string;
  linkedIn?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: 'student' | 'mentor') => Promise<boolean>;
  signup: (userData: any, password: string, userType: 'student' | 'mentor') => Promise<boolean>;
  logout: () => void;
  updateUserId: (newId: string) => Promise<boolean>;
  updateCollege: (college: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo mode helpers (localStorage-based)
const DEMO_USERS_KEY = 'unifiedcampus_demo_users';
const DEMO_CURRENT_USER_KEY = 'unifiedcampus_demo_current_user';

function getDemoUsers(): User[] {
  const users = localStorage.getItem(DEMO_USERS_KEY);
  return users ? JSON.parse(users) : [];
}

function generateStudentId(fullName: string): string {
  // Generate ID from name: firstnamelastname1234
  const namePart = fullName.replace(/\s+/g, '').toLowerCase();
  const randomNumber = Math.floor(Math.random() * 9000) + 1000; // 4-digit random number
  return `${namePart}${randomNumber}`;
}

function saveDemoUser(user: User) {
  const users = getDemoUsers();
  users.push(user);
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
}

function getDemoCurrentUser(): User | null {
  const user = localStorage.getItem(DEMO_CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
}

function setDemoCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(DEMO_CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(DEMO_CURRENT_USER_KEY);
  }
}

function findDemoUser(email: string, password: string): User | null {
  const users = getDemoUsers();
  // In demo mode, we're storing password hash as a simple concat (not secure, just for demo)
  const hashedPassword = btoa(password); // Basic encoding for demo
  return users.find(u => u.email === email && (u as any).password === hashedPassword) || null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    if (USE_DEMO_MODE) {
      // Demo mode: Check localStorage
      const currentUser = getDemoCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    } else {
      // Firebase mode: Listen for auth state changes
      if (auth) {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // Fetch user data from Firestore
            try {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                setUser(userData);
                setIsAuthenticated(true);
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } else {
        setLoading(false);
      }
    }
  }, []);

  const signup = async (userData: any, password: string, userType: 'student' | 'mentor'): Promise<boolean> => {
    try {
      if (USE_DEMO_MODE) {
        // Demo mode signup
        const users = getDemoUsers();
        
        // Check if email already exists
        if (users.some(u => u.email === userData.email)) {
          throw new Error('Email already registered');
        }

        // Validate password
        if (password.length < 6) {
          throw new Error('Password should be at least 6 characters');
        }

        // Create user object
        const newUser: User = {
          id: userType === 'student' ? generateStudentId(userData.fullName) : `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: userData.email,
          userType,
          fullName: userData.fullName,
          ...(userType === 'student' ? {
            phone: userData.phone,
            college: userData.college,
            collegeVerified: true, // New users verified
            branch: userData.branch,
            year: userData.year,
            region: userData.region,
            city: userData.city,
            state: userData.state,
          } : {
            phone: userData.phone,
            jobTitle: userData.jobTitle,
            company: userData.company,
            experience: userData.experience,
            expertise: userData.expertise,
            highestQualification: userData.highestQualification,
            linkedIn: userData.linkedIn,
            bio: userData.bio,
          })
        };

        // Store password hash (simple encoding for demo)
        (newUser as any).password = btoa(password);

        // Save user
        saveDemoUser(newUser);
        setDemoCurrentUser(newUser);

        // Update local state
        setUser(newUser);
        setIsAuthenticated(true);

        return true;
      } else {
        // Firebase signup
        if (!auth || !db) {
          throw new Error('Firebase is not configured. Please set up Firebase or enable demo mode.');
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          password
        );

        // Create user object
        const newUser: User = {
          id: userCredential.user.uid,
          email: userData.email,
          userType,
          fullName: userData.fullName,
          ...(userType === 'student' ? {
            phone: userData.phone,
            college: userData.college,
            collegeVerified: true, // New users verified
            branch: userData.branch,
            year: userData.year,
            region: userData.region,
            city: userData.city,
            state: userData.state,
          } : {
            phone: userData.phone,
            jobTitle: userData.jobTitle,
            company: userData.company,
            experience: userData.experience,
            expertise: userData.expertise,
            highestQualification: userData.highestQualification,
            linkedIn: userData.linkedIn,
            bio: userData.bio,
          })
        };

        // Store user data in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), newUser);

        // Update local state
        setUser(newUser);
        setIsAuthenticated(true);

        return true;
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already registered');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      }
      throw error;
    }
  };

  const login = async (email: string, password: string, userType: 'student' | 'mentor'): Promise<boolean> => {
    try {
      if (USE_DEMO_MODE) {
        // Demo mode login
        const demoUser = findDemoUser(email, password);
        
        if (!demoUser) {
          throw new Error('Invalid email or password');
        }

        // Verify user type matches
        if (demoUser.userType !== userType) {
          throw new Error(`This account is registered as a ${demoUser.userType}. Please use the correct login page.`);
        }

        // Update state
        setDemoCurrentUser(demoUser);
        setUser(demoUser);
        setIsAuthenticated(true);

        return true;
      } else {
        // Firebase login
        if (!auth || !db) {
          throw new Error('Firebase is not configured. Please set up Firebase or enable demo mode.');
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        
        if (!userDoc.exists()) {
          throw new Error('User data not found');
        }

        const userData = userDoc.data() as User;

        // Verify user type matches
        if (userData.userType !== userType) {
          await signOut(auth);
          throw new Error(`This account is registered as a ${userData.userType}. Please use the correct login page.`);
        }

        // Update local state
        setUser(userData);
        setIsAuthenticated(true);

        return true;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many login attempts. Please try again later.');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (USE_DEMO_MODE) {
        // Demo mode logout
        setDemoCurrentUser(null);
      } else {
        // Firebase logout
        if (auth) {
          await signOut(auth);
        }
      }
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserId = async (newId: string): Promise<boolean> => {
    try {
      if (USE_DEMO_MODE) {
        // Demo mode update user ID
        if (!user) {
          throw new Error('User not found');
        }

        const updatedUser: User = {
          ...user,
          id: newId
        };

        // Update user in localStorage
        const users = getDemoUsers();
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
          // Preserve the password field
          const passwordField = (users[userIndex] as any).password;
          users[userIndex] = { ...updatedUser, password: passwordField } as any;
          localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
        }

        // Update current user in localStorage
        setDemoCurrentUser(updatedUser);

        // Update local state
        setUser(updatedUser);

        return true;
      } else {
        // Firebase update user ID
        if (!auth || !db) {
          throw new Error('Firebase is not configured. Please set up Firebase or enable demo mode.');
        }

        if (!user) {
          throw new Error('User not found');
        }

        const updatedUser: User = {
          ...user,
          id: newId
        };

        // Update user data in Firestore
        await setDoc(doc(db, 'users', user.id), updatedUser);

        // Update local state
        setUser(updatedUser);

        return true;
      }
    } catch (error: any) {
      console.error('Update user ID error:', error);
      throw error;
    }
  };

  const updateCollege = async (college: string): Promise<boolean> => {
    try {
      if (USE_DEMO_MODE) {
        // Demo mode update college
        if (!user) {
          throw new Error('User not found');
        }

        const updatedUser: User = {
          ...user,
          college,
          collegeVerified: true
        };

        // Update user in localStorage
        const users = getDemoUsers();
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
          const passwordField = (users[userIndex] as any).password;
          users[userIndex] = { ...updatedUser, password: passwordField } as any;
          localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
        }

        // Update current user in localStorage
        setDemoCurrentUser(updatedUser);
        setUser(updatedUser);

        return true;
      } else {
        // Firebase update college
        if (!auth || !db) {
          throw new Error('Firebase is not configured.');
        }

        if (!user) {
          throw new Error('User not found');
        }

        const updatedUser: User = {
          ...user,
          college,
          collegeVerified: true
        };

        await setDoc(doc(db, 'users', user.id), updatedUser);
        setUser(updatedUser);

        return true;
      }
    } catch (error: any) {
      console.error('Update college error:', error);
      throw error;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      if (USE_DEMO_MODE) {
        // Demo mode delete account
        if (!user) {
          throw new Error('User not found');
        }

        // Remove user from localStorage
        const users = getDemoUsers();
        const updatedUsers = users.filter(u => u.email !== user.email);
        localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(updatedUsers));

        // Clear current user
        setDemoCurrentUser(null);
        setUser(null);
        setIsAuthenticated(false);

        return true;
      } else {
        // Firebase delete account
        if (!auth || !db) {
          throw new Error('Firebase is not configured.');
        }

        const currentUser = auth.currentUser;
        if (!currentUser || !user) {
          throw new Error('User not found');
        }

        // Delete user document from Firestore
        await deleteDoc(doc(db, 'users', user.id));

        // Delete Firebase auth user
        await deleteUser(currentUser);

        // Update local state
        setUser(null);
        setIsAuthenticated(false);

        return true;
      }
    } catch (error: any) {
      console.error('Delete account error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUserId, updateCollege, deleteAccount, isAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During hot reload, context might temporarily be undefined
    // Return a safe default to prevent crashes
    if (typeof window !== 'undefined' && (window as any).__REACT_REFRESH__) {
      return {
        user: null,
        login: async () => false,
        signup: async () => false,
        logout: () => {},
        updateUserId: async () => false,
        updateCollege: async () => false,
        deleteAccount: async () => false,
        isAuthenticated: false,
        loading: true
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}