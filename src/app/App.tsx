import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { AboutSection } from "./components/AboutSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { ContactSection } from "./components/ContactSection";
import { GetStartedModal } from "./components/GetStartedModal";
import { StudentLogin } from "./components/StudentLogin";
import { MentorLogin } from "./components/MentorLogin";
import { StudentSignup } from "./components/StudentSignup";
import { MentorSignup } from "./components/MentorSignup";
import { StudentDashboard } from "./components/StudentDashboard";
import { MentorDashboard } from "./components/MentorDashboard";
import { Footer } from "./components/Footer";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentView, setCurrentView] = useState<
    "landing" | "student-login" | "mentor-login" | "student-signup" | "mentor-signup"
  >("landing");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleNavigateToLogin = (role: "student" | "mentor") => {
    setCurrentView(role === "student" ? "student-signup" : "mentor-signup");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  console.log("App rendering, theme:", theme);

  // Show dashboard if authenticated
  if (isAuthenticated && user) {
    if (user.userType === 'student') {
      return <StudentDashboard />;
    } else if (user.userType === 'mentor') {
      return <MentorDashboard />;
    }
  }

  // Show login screens
  if (currentView === "student-login") {
    return (
      <StudentLogin
        onBack={handleBackToLanding}
        onSwitchToSignup={() => setCurrentView("student-signup")}
      />
    );
  }

  if (currentView === "mentor-login") {
    return (
      <MentorLogin
        onBack={handleBackToLanding}
        onSwitchToSignup={() => setCurrentView("mentor-signup")}
      />
    );
  }

  // Show signup screens
  if (currentView === "student-signup") {
    return (
      <StudentSignup
        onBack={handleBackToLanding}
        onSwitchToLogin={() => setCurrentView("student-login")}
        userLocation={userLocation}
      />
    );
  }

  if (currentView === "mentor-signup") {
    return (
      <MentorSignup
        onBack={handleBackToLanding}
        onSwitchToLogin={() => setCurrentView("mentor-login")}
      />
    );
  }

  // Show landing page
  return (
    <div 
      style={{ 
        width: '100%', 
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #dbeafe, #e9d5ff, #fce7f3)',
        position: 'relative'
      }}
    >
      <Header
        onGetStarted={() => setIsModalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main style={{ width: '100%' }}>
        <HeroSection onGetStarted={() => setIsModalOpen(true)} />
        <StatsSection />
        <AboutSection />
        <FeaturesSection />
        <ContactSection />
      </main>

      <Footer />

      <GetStartedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNavigateToLogin={handleNavigateToLogin}
        onLocationCaptured={setUserLocation}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}