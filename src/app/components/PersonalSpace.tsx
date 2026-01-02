import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  ClipboardCheck,
  Lightbulb,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Brain,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Flame,
  BarChart3,
  Loader2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  CareerOnboarding,
  type OnboardingData,
} from "./CareerOnboarding";
import {
  CareerRoadmap,
  type RoadmapData,
} from "./CareerRoadmap";
import { SkillAssessment } from "./SkillAssessment";
import { IndustryTrends } from "./IndustryTrends";
import { SkillGapAnalysis } from "./SkillGapAnalysis";
import { DailyQuests } from "./DailyQuests";
import { generateRoadmap } from "../utils/roadmapGenerator";
import { generateCareerPathWithAI } from "../services/geminiService";

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

interface PracticeTest {
  id: string;
  title: string;
  questions: Question[];
  completed: boolean;
  score?: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
}

interface CareerPath {
  primaryGoal: string;
  timeframe: string;
  currentLevel: string;
  recommendedPaths: RecommendedPath[];
  skills: string[];
  industryFocus: string[];
}

interface RecommendedPath {
  title: string;
  description: string;
  skills: string[];
  color: string;
}

const NOTES_KEY = "unifiedcampus_notes_";
const PRACTICE_TESTS_KEY = "unifiedcampus_practice_tests";
const CAREER_PATH_KEY = "unifiedcampus_career_path_";
const CAREER_ONBOARDING_KEY =
  "unifiedcampus_career_onboarding_";
const SKILL_ASSESSMENT_KEY = "unifiedcampus_skill_assessment_";

export function PersonalSpace({
  isDarkMode,
}: {
  isDarkMode: boolean;
}) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<
    "notes" | "tests" | "career" | "trends" | "gaps" | "quests"
  >("notes");
  const [notes, setNotes] = useState<Note[]>([]);
  const [practiceTests, setPracticeTests] = useState<
    PracticeTest[]
  >([]);
  const [editingNote, setEditingNote] = useState<string | null>(
    null,
  );
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [activeTest, setActiveTest] =
    useState<PracticeTest | null>(null);
  const [careerPath, setCareerPath] =
    useState<CareerPath | null>(null);
  const [careerOnboarding, setCareerOnboarding] =
    useState<OnboardingData | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSkillAssessment, setShowSkillAssessment] =
    useState(false);
  const [skillLevel, setSkillLevel] = useState<
    "beginner" | "intermediate" | "advanced" | null
  >(null);
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [aiRoadmap, setAiRoadmap] = useState<RoadmapData | null>(null);

  useEffect(() => {
    if (user) {
      loadNotes();
      loadPracticeTests();
      loadCareerPath();
      loadCareerOnboarding();
      loadSkillAssessment();
      loadAiRoadmap();
    }
  }, [user]);

  // Check if we should show onboarding when career section is opened
  useEffect(() => {
    if (activeSection === "career" && !careerOnboarding) {
      setShowOnboarding(true);
    }
  }, [activeSection, careerOnboarding]);

  const loadNotes = () => {
    const stored = localStorage.getItem(NOTES_KEY + user?.id);
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  };

  const loadPracticeTests = () => {
    const stored = localStorage.getItem(PRACTICE_TESTS_KEY);
    if (stored) {
      setPracticeTests(JSON.parse(stored));
    } else {
      // Initialize with sample tests
      const sampleTests: PracticeTest[] = [
        {
          id: "1",
          title: "Data Structures Fundamentals",
          completed: false,
          questions: [
            {
              id: "q1",
              question:
                "What is the time complexity of accessing an element in an array by index?",
              options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
              correctAnswer: 0,
            },
            {
              id: "q2",
              question:
                "Which data structure follows LIFO (Last In First Out) principle?",
              options: [
                "Queue",
                "Stack",
                "Array",
                "Linked List",
              ],
              correctAnswer: 1,
            },
            {
              id: "q3",
              question:
                "What is the worst-case time complexity of Binary Search?",
              options: [
                "O(1)",
                "O(n)",
                "O(log n)",
                "O(n log n)",
              ],
              correctAnswer: 2,
            },
            {
              id: "q4",
              question:
                "Which operation is most efficient in a Linked List compared to an Array?",
              options: [
                "Random access",
                "Insertion at beginning",
                "Search",
                "Accessing last element",
              ],
              correctAnswer: 1,
            },
            {
              id: "q5",
              question:
                "In a hash table, what happens when two keys hash to the same index?",
              options: [
                "Error occurs",
                "Collision",
                "Data is lost",
                "Array expands",
              ],
              correctAnswer: 1,
            },
          ],
        },
        {
          id: "2",
          title: "Object-Oriented Programming",
          completed: false,
          questions: [
            {
              id: "q1",
              question:
                "Which OOP principle allows a class to inherit properties from another class?",
              options: [
                "Encapsulation",
                "Inheritance",
                "Polymorphism",
                "Abstraction",
              ],
              correctAnswer: 1,
            },
            {
              id: "q2",
              question: "What is the purpose of encapsulation?",
              options: [
                "Code reusability",
                "Data hiding",
                "Multiple forms",
                "Dynamic binding",
              ],
              correctAnswer: 1,
            },
            {
              id: "q3",
              question:
                "Which keyword is used to prevent method overriding in most OOP languages?",
              options: ["static", "final", "const", "private"],
              correctAnswer: 1,
            },
            {
              id: "q4",
              question:
                "What does polymorphism allow you to do?",
              options: [
                "Hide data",
                "Use one interface for multiple forms",
                "Inherit properties",
                "Create objects",
              ],
              correctAnswer: 1,
            },
            {
              id: "q5",
              question: "What is an abstract class?",
              options: [
                "A class with all methods implemented",
                "A class that cannot be instantiated",
                "A class with no methods",
                "A final class",
              ],
              correctAnswer: 1,
            },
          ],
        },
        {
          id: "3",
          title: "Database Management Systems",
          completed: false,
          questions: [
            {
              id: "q1",
              question:
                "What does ACID stand for in database transactions?",
              options: [
                "Atomicity, Consistency, Isolation, Durability",
                "Access, Control, Integrity, Data",
                "Array, Class, Interface, Database",
                "Auto, Create, Insert, Delete",
              ],
              correctAnswer: 0,
            },
            {
              id: "q2",
              question:
                "Which SQL clause is used to filter records?",
              options: ["SELECT", "WHERE", "FROM", "ORDER BY"],
              correctAnswer: 1,
            },
            {
              id: "q3",
              question:
                "What type of relationship exists when one record in a table relates to multiple records in another?",
              options: [
                "One-to-One",
                "One-to-Many",
                "Many-to-Many",
                "None",
              ],
              correctAnswer: 1,
            },
            {
              id: "q4",
              question: "What is a primary key?",
              options: [
                "A key that can be null",
                "A unique identifier for a record",
                "A foreign key reference",
                "An index",
              ],
              correctAnswer: 1,
            },
            {
              id: "q5",
              question:
                "Which normal form eliminates transitive dependencies?",
              options: ["1NF", "2NF", "3NF", "BCNF"],
              correctAnswer: 2,
            },
          ],
        },
      ];
      localStorage.setItem(
        PRACTICE_TESTS_KEY,
        JSON.stringify(sampleTests),
      );
      setPracticeTests(sampleTests);
    }
  };

  const loadCareerPath = () => {
    const stored = localStorage.getItem(
      CAREER_PATH_KEY + user?.id,
    );
    if (stored) {
      setCareerPath(JSON.parse(stored));
    } else {
      // Initialize with sample career path
      const sampleCareerPath: CareerPath = {
        primaryGoal: "Career Advancement",
        timeframe: "1-2 Years",
        currentLevel: "Entry Level",
        recommendedPaths: [
          {
            title: "Full Stack Developer",
            description:
              "High demand, versatile role combining frontend and backend skills.",
            skills: ["React", "Node.js", "SQL"],
            color: "blue",
          },
          {
            title: "Data Scientist",
            description:
              "Growing field with excellent compensation and impact.",
            skills: ["Python", "ML", "Statistics"],
            color: "green",
          },
          {
            title: "DevOps Engineer",
            description:
              "Critical role bridging development and operations.",
            skills: ["Docker", "K8s", "AWS"],
            color: "purple",
          },
        ],
        skills: [
          "TypeScript",
          "React",
          "Python",
          "Docker",
          "AWS",
          "GraphQL",
          "MongoDB",
          "Kubernetes",
        ],
        industryFocus: [
          "AI/Machine Learning",
          "Cloud Computing",
          "Cybersecurity",
          "Web3/Blockchain",
        ],
      };
      localStorage.setItem(
        CAREER_PATH_KEY + user?.id,
        JSON.stringify(sampleCareerPath),
      );
      setCareerPath(sampleCareerPath);
    }
  };

  const loadCareerOnboarding = () => {
    const stored = localStorage.getItem(
      CAREER_ONBOARDING_KEY + user?.id,
    );
    if (stored) {
      setCareerOnboarding(JSON.parse(stored));
    } else {
      // Initialize with default value
      localStorage.setItem(
        CAREER_ONBOARDING_KEY + user?.id,
        JSON.stringify(null),
      );
      setCareerOnboarding(null);
    }
  };

  const loadSkillAssessment = () => {
    const stored = localStorage.getItem(
      SKILL_ASSESSMENT_KEY + user?.id,
    );
    if (stored) {
      setSkillLevel(JSON.parse(stored));
    } else {
      // Initialize with default value
      localStorage.setItem(
        SKILL_ASSESSMENT_KEY + user?.id,
        JSON.stringify(null),
      );
      setSkillLevel(null);
    }
  };

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem(
      NOTES_KEY + user?.id,
      JSON.stringify(updatedNotes),
    );
    setNotes(updatedNotes);
  };

  const handleAddNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const newNote: Note = {
      id: `${Date.now()}_${Math.random()}`,
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      timestamp: Date.now(),
    };

    saveNotes([...notes, newNote]);
    setNewNoteTitle("");
    setNewNoteContent("");
  };

  const handleDeleteNote = (id: string) => {
    saveNotes(notes.filter((note) => note.id !== id));
  };

  const handleStartTest = (test: PracticeTest) => {
    setActiveTest({
      ...test,
      questions: test.questions.map((q) => ({
        ...q,
        selectedAnswer: undefined,
      })),
    });
  };

  const handleAnswerSelect = (
    questionId: string,
    answerIndex: number,
  ) => {
    if (!activeTest) return;

    setActiveTest({
      ...activeTest,
      questions: activeTest.questions.map((q) =>
        q.id === questionId
          ? { ...q, selectedAnswer: answerIndex }
          : q,
      ),
    });
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;

    const correctAnswers = activeTest.questions.filter(
      (q) => q.selectedAnswer === q.correctAnswer,
    ).length;
    const score = Math.round(
      (correctAnswers / activeTest.questions.length) * 100,
    );

    const updatedTest = {
      ...activeTest,
      completed: true,
      score,
    };

    const updatedTests = practiceTests.map((t) =>
      t.id === activeTest.id ? updatedTest : t,
    );

    localStorage.setItem(
      PRACTICE_TESTS_KEY,
      JSON.stringify(updatedTests),
    );
    setPracticeTests(updatedTests);
    setActiveTest(updatedTest);
  };

  const generateCareerPath = (
    data: OnboardingData,
  ): CareerPath => {
    // Map interests to career paths
    const pathsMap: Record<string, RecommendedPath> = {
      "web-dev": {
        title: "Full Stack Developer",
        description:
          "Build complete web applications from frontend to backend.",
        skills: [
          "React",
          "Node.js",
          "TypeScript",
          "PostgreSQL",
        ],
        color: "blue",
      },
      "mobile-dev": {
        title: "Mobile App Developer",
        description:
          "Create native and cross-platform mobile applications.",
        skills: ["React Native", "Swift", "Kotlin", "Flutter"],
        color: "purple",
      },
      "data-science": {
        title: "Data Scientist / AI Engineer",
        description:
          "Build AI models and analyze data for insights.",
        skills: ["Python", "TensorFlow", "Pandas", "SQL"],
        color: "green",
      },
      devops: {
        title: "DevOps Engineer",
        description:
          "Automate infrastructure and deployment pipelines.",
        skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
        color: "orange",
      },
      "cyber-security": {
        title: "Cybersecurity Specialist",
        description:
          "Protect systems and data from security threats.",
        skills: [
          "Network Security",
          "Penetration Testing",
          "Cryptography",
          "SIEM",
        ],
        color: "red",
      },
      blockchain: {
        title: "Blockchain Developer",
        description:
          "Build decentralized applications and smart contracts.",
        skills: [
          "Solidity",
          "Web3.js",
          "Ethereum",
          "Smart Contracts",
        ],
        color: "indigo",
      },
      "game-dev": {
        title: "Game Developer",
        description: "Create interactive gaming experiences.",
        skills: ["Unity", "Unreal Engine", "C#", "3D Modeling"],
        color: "pink",
      },
      "ui-ux": {
        title: "UI/UX Designer",
        description:
          "Design beautiful and intuitive user interfaces.",
        skills: [
          "Figma",
          "Design Systems",
          "User Research",
          "Prototyping",
        ],
        color: "teal",
      },
    };

    const recommendedPaths = data.interests
      .slice(0, 3)
      .map((interest) => pathsMap[interest])
      .filter(Boolean);

    // Generate skills based on interests and level
    const allSkills = data.interests.flatMap(
      (interest) => pathsMap[interest]?.skills || [],
    );
    const uniqueSkills = Array.from(new Set(allSkills));

    // Industry focus based on interests
    const industryMap: Record<string, string> = {
      "web-dev": "Web Technologies",
      "mobile-dev": "Mobile Computing",
      "data-science": "AI/Machine Learning",
      devops: "Cloud Computing",
      "cyber-security": "Cybersecurity",
      blockchain: "Web3/Blockchain",
      "game-dev": "Gaming Industry",
      "ui-ux": "Design & UX",
    };

    const industryFocus = data.interests
      .map((interest) => industryMap[interest])
      .filter(Boolean);

    return {
      primaryGoal: data.primaryGoal,
      timeframe: data.timeframe,
      currentLevel: data.currentLevel,
      recommendedPaths,
      skills: uniqueSkills.slice(0, 8),
      industryFocus: industryFocus.slice(0, 4),
    };
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    // Generate personalized career path
    const newCareerPath = generateCareerPath(data);

    // Save onboarding data immediately
    localStorage.setItem(
      CAREER_ONBOARDING_KEY + user?.id,
      JSON.stringify(data),
    );
    localStorage.setItem(
      CAREER_PATH_KEY + user?.id,
      JSON.stringify(newCareerPath),
    );

    setCareerOnboarding(data);
    setCareerPath(newCareerPath);
    setShowOnboarding(false);

    // Show skill assessment if not completed yet
    if (!skillLevel) {
      setShowSkillAssessment(true);
    }

    // Generate AI-powered roadmap in background
    setIsGeneratingPath(true);
    try {
      const aiGeneratedRoadmap = await generateCareerPathWithAI(data);
      if (aiGeneratedRoadmap) {
        setAiRoadmap(aiGeneratedRoadmap);
        // Store AI roadmap for persistence
        localStorage.setItem(
          `unifiedcampus_ai_roadmap_${user?.id}`,
          JSON.stringify(aiGeneratedRoadmap)
        );
      } else {
        // Fallback to static roadmap generator
        const fallbackRoadmap = generateRoadmap(data);
        setAiRoadmap(fallbackRoadmap);
      }
    } catch (error) {
      console.error('Failed to generate AI roadmap:', error);
      // Use fallback
      const fallbackRoadmap = generateRoadmap(data);
      setAiRoadmap(fallbackRoadmap);
    } finally {
      setIsGeneratingPath(false);
    }
  };

  const handleOnboardingSkip = () => {
    // Mark as completed but use default path
    const defaultData: OnboardingData = {
      primaryGoal: "career-switch",
      timeframe: "1-2-years",
      currentLevel: "some-knowledge",
      interests: ["web-dev", "data-science"],
      currentYear: 1,
      graduationYear: 4,
      currentSemester: "1",
    };

    localStorage.setItem(
      CAREER_ONBOARDING_KEY + user?.id,
      JSON.stringify(defaultData),
    );
    setCareerOnboarding(defaultData);
    setShowOnboarding(false);
  };

  const handleSkillAssessmentComplete = (
    level: "beginner" | "intermediate" | "advanced",
  ) => {
    localStorage.setItem(
      SKILL_ASSESSMENT_KEY + user?.id,
      JSON.stringify(level),
    );
    setSkillLevel(level);
    setShowSkillAssessment(false);
  };

  const getCareerStreamName = (interest: string): string => {
    const streamMap: Record<string, string> = {
      "web-dev": "Web Development",
      "mobile-dev": "Mobile Development",
      "data-science": "Data Science",
      devops: "DevOps",
      "cyber-security": "Cybersecurity",
      blockchain: "Blockchain",
      "game-dev": "Game Development",
      "ui-ux": "UI/UX Design",
    };
    return streamMap[interest] || "Unknown Stream";
  };

  const renderNotes = () => (
    <div className="space-y-6">
      {/* Add Note Form */}
      <div
        className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-sm p-6`}
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Note
        </h3>
        <input
          type="text"
          placeholder="Note title..."
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          className={`w-full px-4 py-2 mb-3 rounded-lg border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-50 border-gray-200"
          } outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <textarea
          placeholder="Note content..."
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          rows={4}
          className={`w-full px-4 py-2 mb-3 rounded-lg border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-50 border-gray-200"
          } outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <button
          onClick={handleAddNote}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
        >
          Add Note
        </button>
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-400">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No notes yet. Create your first note!</p>
          </div>
        ) : (
          notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-sm p-6`}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold">{note.title}</h4>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {note.content}
              </p>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(note.timestamp).toLocaleDateString()}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  const renderTests = () => {
    if (activeTest) {
      const allAnswered = activeTest.questions.every(
        (q) => q.selectedAnswer !== undefined,
      );

      return (
        <div className="space-y-6">
          <div
            className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-sm p-6`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {activeTest.title}
              </h3>
              <button
                onClick={() => setActiveTest(null)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeTest.completed ? (
              <div className="text-center py-12">
                <div
                  className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    activeTest.score! >= 70
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-orange-100 dark:bg-orange-900"
                  }`}
                >
                  <span
                    className={`text-4xl font-bold ${
                      activeTest.score! >= 70
                        ? "text-green-600 dark:text-green-400"
                        : "text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    {activeTest.score}%
                  </span>
                </div>
                <h4 className="text-2xl font-bold mb-2">
                  Test Completed!
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You scored {activeTest.score}% on this test
                </p>

                {/* Show answers */}
                <div className="space-y-4 mt-8">
                  {activeTest.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className={`text-left p-4 rounded-lg ${
                        q.selectedAnswer === q.correctAnswer
                          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                          : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      }`}
                    >
                      <p className="font-medium mb-2">
                        {idx + 1}. {q.question}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">
                          Your answer:{" "}
                        </span>
                        <span
                          className={
                            q.selectedAnswer === q.correctAnswer
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {q.options[q.selectedAnswer!]}
                        </span>
                      </p>
                      {q.selectedAnswer !== q.correctAnswer && (
                        <p className="text-sm">
                          <span className="font-medium">
                            Correct answer:{" "}
                          </span>
                          <span className="text-green-600 dark:text-green-400">
                            {q.options[q.correctAnswer]}
                          </span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {activeTest.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}
                    >
                      <p className="font-medium mb-3">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((option, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() =>
                              handleAnswerSelect(q.id, optIdx)
                            }
                            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                              q.selectedAnswer === optIdx
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                : isDarkMode
                                  ? "border-gray-600 hover:border-gray-500"
                                  : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSubmitTest}
                  disabled={!allAnswered}
                  className="mt-6 w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium"
                >
                  Submit Test
                </button>
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {practiceTests.map((test) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-sm p-6`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  test.completed
                    ? "bg-green-100 dark:bg-green-900"
                    : "bg-blue-100 dark:bg-blue-900"
                }`}
              >
                {test.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <ClipboardCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{test.title}</h4>
                <p className="text-sm text-gray-500">
                  {test.questions.length} questions
                </p>
              </div>
            </div>

            {test.completed && test.score !== undefined && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Score: {test.score}%
                </p>
              </div>
            )}

            <button
              onClick={() => handleStartTest(test)}
              className={`w-full px-4 py-2 ${
                test.completed
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white rounded-lg font-medium`}
            >
              {test.completed ? "Review Test" : "Start Test"}
            </button>
          </motion.div>
        ))}
      </div>
    );
  };

  const loadAiRoadmap = () => {
    const stored = localStorage.getItem(`unifiedcampus_ai_roadmap_${user?.id}`);
    if (stored) {
      try {
        setAiRoadmap(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse AI roadmap:', e);
      }
    }
  };

  const renderCareerGuide = () => {
    // Use AI roadmap if available, otherwise fall back to static generator
    const roadmapData = aiRoadmap || (careerOnboarding ? generateRoadmap(careerOnboarding) : null);

    return (
      <div className="space-y-6">
        {/* AI Career Guide Header */}
        <div
          className={`${isDarkMode ? "bg-gradient-to-r from-purple-900 to-blue-900" : "bg-gradient-to-r from-purple-500 to-blue-500"} rounded-2xl shadow-sm p-8 text-white`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">
                AI Career Guide
              </h3>
              <p className="text-sm opacity-90">
                Powered by Agentic AI • Updated Quarterly
              </p>
            </div>
          </div>
        </div>

        {/* Loading State for AI Generation */}
        {isGeneratingPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-sm p-8 text-center`}
          >
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-500 animate-spin" />
            <h4 className="text-lg font-semibold mb-2">Generating Your Personalized Career Path...</h4>
            <p className="text-sm text-gray-500">Our AI is analyzing your goals and interests to create the perfect roadmap for you.</p>
          </motion.div>
        )}

        {/* Career Roadmap */}
        {roadmapData && !isGeneratingPath && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-2xl font-bold">
                Your Personalized Career Roadmap
              </h3>
              {aiRoadmap && (
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Generated
                </span>
              )}
            </div>
            <CareerRoadmap
              isDarkMode={isDarkMode}
              roadmapData={roadmapData}
            />
          </div>
        )}

        {/* Career Paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-sm p-6`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-blue-500" />
              <h4 className="text-lg font-bold">
                Recommended Career Paths
              </h4>
            </div>
            <div className="space-y-3">
              {careerPath?.recommendedPaths.map((path, idx) => (
                <div
                  key={idx}
                  className={`p-4 bg-${path.color}-50 dark:bg-${path.color}-900/20 rounded-lg`}
                >
                  <h5 className="font-semibold mb-1">
                    {path.title}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {path.description}
                  </p>
                  <div className="flex gap-2">
                    {path.skills.map((skill, skillIdx) => (
                      <span
                        key={skillIdx}
                        className="text-xs px-2 py-1 bg-${path.color}-100 dark:bg-${path.color}-900 text-${path.color}-700 dark:text-${path.color}-300 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-sm p-6`}
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <h4 className="text-lg font-bold">
                Industry Trends
              </h4>
            </div>
            <div className="space-y-4">
              {careerPath?.industryFocus.map((focus, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {focus}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      ↑ 85%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Skills Development */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-sm p-6`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-purple-500" />
            <h4 className="text-lg font-bold">
              Recommended Skills to Learn
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {careerPath?.skills.map((skill, idx) => (
              <div
                key={idx}
                className={`p-4 text-center rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-50 hover:bg-gray-100"
                } transition-colors cursor-pointer`}
              >
                <p className="font-medium">{skill}</p>
                <p className="text-xs text-gray-500 mt-1">
                  In demand
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Last updated: January 2026 • Next update: April 2026
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Tabs */}
      <div
        className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            Personal Space
          </h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveSection("notes")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === "notes"
                  ? "bg-blue-500 text-white"
                  : isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Notes
            </button>
            <button
              onClick={() => setActiveSection("tests")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === "tests"
                  ? "bg-blue-500 text-white"
                  : isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <ClipboardCheck className="w-4 h-4 inline mr-2" />
              Practice Tests
            </button>
            <button
              onClick={() => setActiveSection("career")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === "career"
                  ? "bg-blue-500 text-white"
                  : isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Lightbulb className="w-4 h-4 inline mr-2" />
              Career Guide
            </button>
            <button
              onClick={() => setActiveSection("trends")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === "trends"
                  ? "bg-blue-500 text-white"
                  : isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Industry Trends
            </button>
            <button
              onClick={() => setActiveSection("gaps")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === "gaps"
                  ? "bg-blue-500 text-white"
                  : isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Skill Gaps
            </button>
            <button
              onClick={() => setActiveSection("quests")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === "quests"
                  ? "bg-blue-500 text-white"
                  : isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Flame className="w-4 h-4 inline mr-2" />
              Daily Quests
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeSection === "notes" && renderNotes()}
        {activeSection === "tests" && renderTests()}
        {activeSection === "career" && renderCareerGuide()}
        {activeSection === "trends" && (
          <IndustryTrends
            isDarkMode={isDarkMode}
            userSkills={careerPath?.skills || []}
            targetRole="Software Engineer"
            location="Bangalore"
          />
        )}
        {activeSection === "gaps" && (
          <SkillGapAnalysis
            isDarkMode={isDarkMode}
            targetRole="Software Engineer"
            testResults={practiceTests
              .filter((t) => t.completed)
              .map((t) => ({
                testId: t.id,
                testName: t.title,
                score: t.score || 0,
                topicScores: [
                  { topic: t.title, score: t.score || 0 },
                ],
                timestamp: Date.now(),
              }))}
            userSkillLevel={skillLevel || "beginner"}
          />
        )}
        {activeSection === "quests" && user && (
          <DailyQuests
            isDarkMode={isDarkMode}
            userId={user.id}
          />
        )}
      </div>

      {/* Career Onboarding */}
      {showOnboarding && (
        <CareerOnboarding
          isDarkMode={isDarkMode}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {/* Skill Assessment */}
      {showSkillAssessment && careerOnboarding && (
        <SkillAssessment
          careerStream={getCareerStreamName(
            careerOnboarding.interests[0],
          )}
          isDarkMode={isDarkMode}
          onComplete={handleSkillAssessmentComplete}
          onSkip={() => setShowSkillAssessment(false)}
        />
      )}
    </div>
  );
}