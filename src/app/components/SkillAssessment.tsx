import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Trophy,
  Target,
  Zap,
  Clock,
  Award,
  Sparkles
} from "lucide-react";

interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

interface SkillAssessmentProps {
  careerStream: string;
  isDarkMode: boolean;
  onComplete: (skillLevel: 'beginner' | 'intermediate' | 'advanced', score: number) => void;
  onSkip: () => void;
}

const assessmentQuestions: Record<string, AssessmentQuestion[]> = {
  "Software Development": [
    {
      id: "sd1",
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "Binary search divides the search space in half each iteration, resulting in O(log n) complexity."
    },
    {
      id: "sd2",
      question: "Which data structure uses LIFO (Last In First Out)?",
      options: ["Queue", "Stack", "Tree", "Graph"],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "A Stack follows LIFO principle where the last element added is the first one removed."
    },
    {
      id: "sd3",
      question: "What does REST stand for in web APIs?",
      options: [
        "Reliable State Transfer",
        "Representational State Transfer",
        "Remote System Technology",
        "Responsive Service Template"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "REST stands for Representational State Transfer, an architectural style for web services."
    },
    {
      id: "sd4",
      question: "In a balanced Binary Search Tree, what is the average time complexity for insertion?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "In a balanced BST, insertion takes O(log n) time as we traverse from root to a leaf."
    },
    {
      id: "sd5",
      question: "What is the purpose of a Virtual DOM in React?",
      options: [
        "To store component state",
        "To minimize direct DOM manipulation and improve performance",
        "To handle routing",
        "To manage API calls"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "Virtual DOM is a lightweight copy of the actual DOM that React uses to minimize expensive DOM operations."
    },
    {
      id: "sd6",
      question: "Which design pattern ensures a class has only one instance?",
      options: ["Factory", "Singleton", "Observer", "Strategy"],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "Singleton pattern restricts instantiation of a class to a single instance."
    },
    {
      id: "sd7",
      question: "What is the space complexity of merge sort?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: 2,
      difficulty: 'hard',
      explanation: "Merge sort requires O(n) additional space for the temporary arrays during merging."
    },
    {
      id: "sd8",
      question: "In database normalization, what does 3NF stand for?",
      options: [
        "Third Normal Format",
        "Three Node Function",
        "Third Normal Form",
        "Triple Normalized Field"
      ],
      correctAnswer: 2,
      difficulty: 'hard',
      explanation: "3NF (Third Normal Form) is a database normalization form that removes transitive dependencies."
    }
  ],
  "Data Science": [
    {
      id: "ds1",
      question: "What is the primary purpose of supervised learning?",
      options: [
        "Clustering data",
        "Learning from labeled data to make predictions",
        "Reducing dimensions",
        "Finding patterns without labels"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "Supervised learning uses labeled training data to learn a function that maps inputs to outputs."
    },
    {
      id: "ds2",
      question: "Which metric is best for imbalanced classification problems?",
      options: ["Accuracy", "F1 Score", "Mean Squared Error", "R²"],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "F1 Score balances precision and recall, making it ideal for imbalanced datasets."
    },
    {
      id: "ds3",
      question: "What does PCA stand for?",
      options: [
        "Primary Component Analysis",
        "Principal Component Analysis",
        "Predictive Cluster Algorithm",
        "Probability Calculation Approach"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "PCA (Principal Component Analysis) is a dimensionality reduction technique."
    },
    {
      id: "ds4",
      question: "In neural networks, what is the purpose of the activation function?",
      options: [
        "To normalize inputs",
        "To introduce non-linearity",
        "To reduce overfitting",
        "To calculate gradients"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "Activation functions introduce non-linearity, allowing neural networks to learn complex patterns."
    },
    {
      id: "ds5",
      question: "What is gradient descent used for?",
      options: [
        "Data preprocessing",
        "Minimizing the loss function",
        "Feature selection",
        "Data visualization"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "Gradient descent is an optimization algorithm used to minimize the loss function."
    },
    {
      id: "ds6",
      question: "What is the curse of dimensionality?",
      options: [
        "Too few features",
        "Data becomes sparse in high-dimensional space",
        "Overfitting on training data",
        "Underfitting on test data"
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "As dimensions increase, data becomes sparse, making distance-based algorithms less effective."
    },
    {
      id: "ds7",
      question: "What is the difference between bagging and boosting?",
      options: [
        "No difference",
        "Bagging uses parallel training, boosting uses sequential",
        "Bagging is for regression, boosting for classification",
        "Bagging reduces bias, boosting reduces variance"
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "Bagging trains models in parallel to reduce variance, while boosting trains sequentially to reduce bias."
    },
    {
      id: "ds8",
      question: "What is the vanishing gradient problem?",
      options: [
        "Gradients become too large",
        "Gradients become too small to update weights effectively",
        "Learning rate is too high",
        "Loss function is incorrect"
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "Vanishing gradients occur when gradients become extremely small, preventing effective weight updates in deep networks."
    }
  ],
  "Product Management": [
    {
      id: "pm1",
      question: "What does MVP stand for in product development?",
      options: [
        "Most Valuable Player",
        "Minimum Viable Product",
        "Maximum Value Proposition",
        "Minimum Value Process"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "MVP (Minimum Viable Product) is a version with just enough features to satisfy early customers."
    },
    {
      id: "pm2",
      question: "What is the primary goal of A/B testing?",
      options: [
        "Testing two different products",
        "Comparing two versions to determine which performs better",
        "Testing accessibility",
        "Beta testing"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "A/B testing compares two versions to determine which one achieves better results."
    },
    {
      id: "pm3",
      question: "What is a product roadmap?",
      options: [
        "A list of bugs",
        "A strategic plan showing product direction over time",
        "User documentation",
        "API documentation"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "A product roadmap is a strategic document that outlines the vision and direction of product development."
    },
    {
      id: "pm4",
      question: "What does OKR stand for?",
      options: [
        "Objective Key Results",
        "Objectives and Key Results",
        "Operational Key Requirements",
        "Outcome Knowledge Review"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "OKR (Objectives and Key Results) is a goal-setting framework used to define and track objectives."
    },
    {
      id: "pm5",
      question: "What is customer acquisition cost (CAC)?",
      options: [
        "Total revenue divided by customers",
        "Cost to acquire a new customer",
        "Customer lifetime value",
        "Marketing budget"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "CAC is the total cost of sales and marketing efforts divided by the number of new customers acquired."
    },
    {
      id: "pm6",
      question: "What is the RICE scoring framework used for?",
      options: [
        "Performance metrics",
        "Prioritizing features (Reach, Impact, Confidence, Effort)",
        "User research",
        "Risk assessment"
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "RICE helps prioritize features based on Reach, Impact, Confidence, and Effort."
    },
    {
      id: "pm7",
      question: "What is churn rate?",
      options: [
        "Customer acquisition rate",
        "Percentage of customers who stop using the product",
        "Revenue growth rate",
        "User engagement rate"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "Churn rate measures the percentage of customers who discontinue their subscription or usage."
    },
    {
      id: "pm8",
      question: "What is the Jobs-to-be-Done framework?",
      options: [
        "A hiring framework",
        "Understanding what customers are trying to accomplish",
        "Project management methodology",
        "Agile framework"
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "Jobs-to-be-Done focuses on understanding the underlying jobs customers hire a product to do."
    }
  ],
  "UI/UX Design": [
    {
      id: "ux1",
      question: "What does UX stand for?",
      options: ["User Experience", "Universal Export", "User Extension", "Unified Experience"],
      correctAnswer: 0,
      difficulty: 'easy',
      explanation: "UX stands for User Experience, focusing on how users interact with and experience a product."
    },
    {
      id: "ux2",
      question: "What is a wireframe?",
      options: [
        "Final design mockup",
        "Low-fidelity sketch of interface layout",
        "HTML/CSS code",
        "User journey map"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "A wireframe is a basic visual guide showing the skeletal framework of a digital interface."
    },
    {
      id: "ux3",
      question: "What is the purpose of user personas?",
      options: [
        "Legal documentation",
        "Representing target user archetypes",
        "Marketing materials",
        "Database schemas"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "User personas are fictional characters representing different user types to guide design decisions."
    },
    {
      id: "ux4",
      question: "What is Fitts's Law?",
      options: [
        "Color theory principle",
        "Time to reach target depends on distance and size",
        "Typography rule",
        "Animation timing function"
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "Fitts's Law states that the time to acquire a target is a function of the distance to and size of the target."
    },
    {
      id: "ux5",
      question: "What is the F-pattern in web design?",
      options: [
        "Font selection pattern",
        "Common eye-tracking pattern users follow",
        "File organization system",
        "Flexbox layout"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "F-pattern describes how users typically scan web content in an F-shaped pattern."
    },
    {
      id: "ux6",
      question: "What is cognitive load in UX?",
      options: [
        "Page loading time",
        "Mental effort required to use an interface",
        "Number of features",
        "Data processing speed"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "Cognitive load refers to the mental effort and working memory used when interacting with an interface."
    },
    {
      id: "ux7",
      question: "What is the difference between UI and UX?",
      options: [
        "No difference",
        "UI is visual design, UX is overall experience",
        "UI is for mobile, UX for web",
        "UI is backend, UX is frontend"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "UI focuses on visual and interactive elements, while UX encompasses the entire user experience."
    },
    {
      id: "ux8",
      question: "What is a design system?",
      options: [
        "Operating system for designers",
        "Collection of reusable components and guidelines",
        "Design software",
        "Project management tool"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "A design system is a comprehensive set of standards, components, and guidelines for creating consistent designs."
    }
  ],
  "Digital Marketing": [
    {
      id: "dm1",
      question: "What does SEO stand for?",
      options: [
        "Search Engine Optimization",
        "Social Engagement Online",
        "Strategic Email Outreach",
        "Secure Electronic Operations"
      ],
      correctAnswer: 0,
      difficulty: 'easy',
      explanation: "SEO (Search Engine Optimization) improves website visibility in search engine results."
    },
    {
      id: "dm2",
      question: "What is CTR in digital marketing?",
      options: [
        "Customer Total Revenue",
        "Click-Through Rate",
        "Conversion Tracking Report",
        "Content Type Ranking"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "CTR (Click-Through Rate) measures the percentage of people who click on a link or ad."
    },
    {
      id: "dm3",
      question: "What is the marketing funnel?",
      options: [
        "Sales pipeline tool",
        "Customer journey from awareness to conversion",
        "Email template",
        "Social media strategy"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "The marketing funnel represents stages customers go through from awareness to purchase."
    },
    {
      id: "dm4",
      question: "What is retargeting in digital advertising?",
      options: [
        "Finding new audiences",
        "Showing ads to people who previously visited your site",
        "Changing ad creative",
        "Optimizing landing pages"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "Retargeting shows ads to users who have previously interacted with your website or app."
    },
    {
      id: "dm5",
      question: "What does CPC stand for?",
      options: [
        "Customer Purchase Cost",
        "Cost Per Click",
        "Conversion Per Campaign",
        "Content Production Center"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "CPC (Cost Per Click) is the amount paid for each click on an advertisement."
    },
    {
      id: "dm6",
      question: "What is A/B testing in marketing?",
      options: [
        "Testing two different markets",
        "Comparing two versions to see which performs better",
        "Testing ads vs blogs",
        "Analyzing brand awareness"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "A/B testing compares two versions of marketing content to determine which performs better."
    },
    {
      id: "dm7",
      question: "What is the customer lifetime value (CLV)?",
      options: [
        "Time customer stays with brand",
        "Total revenue expected from a customer",
        "Customer acquisition cost",
        "Average order value"
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "CLV predicts the total revenue a business can expect from a single customer account."
    },
    {
      id: "dm8",
      question: "What is content marketing?",
      options: [
        "Only blogging",
        "Creating valuable content to attract and engage audience",
        "Social media only",
        "Paid advertising"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "Content marketing involves creating and distributing valuable, relevant content to attract a target audience."
    }
  ],
  "Business Analytics": [
    {
      id: "ba1",
      question: "What does KPI stand for?",
      options: [
        "Key Performance Indicator",
        "Knowledge Process Integration",
        "Key Process Input",
        "Knowledge Performance Index"
      ],
      correctAnswer: 0,
      difficulty: 'easy',
      explanation: "KPI (Key Performance Indicator) is a measurable value showing how effectively objectives are achieved."
    },
    {
      id: "ba2",
      question: "What is data visualization?",
      options: [
        "Data storage",
        "Graphical representation of information",
        "Data encryption",
        "Database design"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "Data visualization presents data in graphical format to make insights easier to understand."
    },
    {
      id: "ba3",
      question: "What is the purpose of cohort analysis?",
      options: [
        "Analyzing individual customers",
        "Studying groups with common characteristics over time",
        "Market segmentation",
        "Competitor analysis"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "Cohort analysis examines behavior of groups sharing common characteristics over time."
    },
    {
      id: "ba4",
      question: "What is the difference between descriptive and predictive analytics?",
      options: [
        "No difference",
        "Descriptive analyzes past, predictive forecasts future",
        "One uses more data",
        "One is more accurate"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "Descriptive analytics explains what happened, while predictive analytics forecasts what might happen."
    },
    {
      id: "ba5",
      question: "What is SQL primarily used for?",
      options: [
        "Web design",
        "Managing and querying databases",
        "Creating animations",
        "Machine learning"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "SQL (Structured Query Language) is used to manage and query relational databases."
    },
    {
      id: "ba6",
      question: "What is a dashboard in business analytics?",
      options: [
        "Car component",
        "Visual display of key metrics and KPIs",
        "Database schema",
        "API endpoint"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "A dashboard provides real-time visual display of important business metrics and KPIs."
    },
    {
      id: "ba7",
      question: "What is ETL in data analytics?",
      options: [
        "Evaluate, Test, Launch",
        "Extract, Transform, Load",
        "Estimate, Track, Learn",
        "Execute, Transfer, Log"
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "ETL is the process of Extracting data from sources, Transforming it, and Loading it into a data warehouse."
    },
    {
      id: "ba8",
      question: "What is the purpose of regression analysis?",
      options: [
        "Data cleaning",
        "Understanding relationships between variables",
        "Data storage",
        "User authentication"
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "Regression analysis examines relationships between dependent and independent variables."
    }
  ],
  "Cloud & DevOps": [
    {
      id: "cd1",
      question: "What does CI/CD stand for?",
      options: [
        "Computer Integration/Computer Deployment",
        "Continuous Integration/Continuous Deployment",
        "Code Integration/Code Distribution",
        "Cloud Infrastructure/Cloud Development"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "CI/CD automates the integration and deployment of code changes."
    },
    {
      id: "cd2",
      question: "What is Docker used for?",
      options: [
        "Database management",
        "Containerization of applications",
        "Web hosting",
        "Email services"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "Docker packages applications and dependencies into containers for consistent deployment."
    },
    {
      id: "cd3",
      question: "What is Infrastructure as Code (IaC)?",
      options: [
        "Writing code for infrastructure",
        "Managing infrastructure through code/configuration files",
        "Cloud storage",
        "API development"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "IaC manages and provisions infrastructure through machine-readable definition files."
    },
    {
      id: "cd4",
      question: "What is Kubernetes?",
      options: [
        "Database system",
        "Container orchestration platform",
        "Programming language",
        "Testing framework"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "Kubernetes orchestrates and manages containerized applications across clusters."
    },
    {
      id: "cd5",
      question: "What is the purpose of load balancing?",
      options: [
        "Data backup",
        "Distributing traffic across multiple servers",
        "Code optimization",
        "Security monitoring"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "Load balancing distributes network traffic across multiple servers to ensure reliability and performance."
    },
    {
      id: "cd6",
      question: "What is microservices architecture?",
      options: [
        "Small applications",
        "Application built as suite of small, independent services",
        "Miniature computers",
        "Mobile-first design"
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "Microservices architecture structures an application as collection of loosely coupled services."
    },
    {
      id: "cd7",
      question: "What is the difference between vertical and horizontal scaling?",
      options: [
        "No difference",
        "Vertical adds resources to server, horizontal adds more servers",
        "One is for databases only",
        "One is more expensive"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "Vertical scaling adds more power to existing server; horizontal scaling adds more servers."
    },
    {
      id: "cd8",
      question: "What is monitoring in DevOps?",
      options: [
        "Security surveillance",
        "Tracking system performance and health",
        "Code review",
        "User testing"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "Monitoring continuously tracks system performance, availability, and health metrics."
    }
  ],
  "Cybersecurity": [
    {
      id: "cs1",
      question: "What does HTTPS stand for?",
      options: [
        "Hyper Text Protocol System",
        "Hyper Text Transfer Protocol Secure",
        "High Tech Protection Service",
        "Host Transfer Protection Standard"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "HTTPS is the secure version of HTTP, encrypting data between browser and server."
    },
    {
      id: "cs2",
      question: "What is phishing?",
      options: [
        "Network scanning",
        "Fraudulent attempt to obtain sensitive information",
        "Password encryption",
        "Firewall testing"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "Phishing is a cyberattack using fraudulent communications to steal sensitive data."
    },
    {
      id: "cs3",
      question: "What is two-factor authentication (2FA)?",
      options: [
        "Two passwords",
        "Security requiring two forms of identification",
        "Dual firewall",
        "Backup authentication"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "2FA requires two different authentication factors to verify user identity."
    },
    {
      id: "cs4",
      question: "What is encryption?",
      options: [
        "Data compression",
        "Converting data into coded form",
        "Data backup",
        "Network routing"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "Encryption converts information into code to prevent unauthorized access."
    },
    {
      id: "cs5",
      question: "What is a firewall?",
      options: [
        "Antivirus software",
        "Network security system controlling traffic",
        "Data backup",
        "Password manager"
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: "A firewall monitors and controls incoming and outgoing network traffic based on security rules."
    },
    {
      id: "cs6",
      question: "What is penetration testing?",
      options: [
        "Performance testing",
        "Authorized simulated attack to find vulnerabilities",
        "User acceptance testing",
        "Load testing"
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "Penetration testing simulates cyberattacks to identify security vulnerabilities."
    },
    {
      id: "cs7",
      question: "What is a DDoS attack?",
      options: [
        "Data theft",
        "Overwhelming system with traffic",
        "Password cracking",
        "Malware installation"
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "DDoS (Distributed Denial of Service) floods a system with traffic to make it unavailable."
    },
    {
      id: "cs8",
      question: "What is the principle of least privilege?",
      options: [
        "Everyone has admin access",
        "Users get minimum access needed for their role",
        "No password required",
        "Public access default"
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "Least privilege means granting users only the minimum access necessary to perform their job."
    }
  ]
};

export function SkillAssessment({ careerStream, isDarkMode, onComplete, onSkip }: SkillAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = assessmentQuestions[careerStream] || assessmentQuestions["Software Development"];

  // Lock body scroll when component is mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (showResults || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    let easyCorrect = 0;
    let mediumCorrect = 0;
    let hardCorrect = 0;

    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctAnswers++;
        if (q.difficulty === 'easy') easyCorrect++;
        if (q.difficulty === 'medium') mediumCorrect++;
        if (q.difficulty === 'hard') hardCorrect++;
      }
    });

    const percentage = (correctAnswers / questions.length) * 100;
    
    // Determine skill level
    let skillLevel: 'beginner' | 'intermediate' | 'advanced';
    
    if (hardCorrect >= 2 && percentage >= 75) {
      skillLevel = 'advanced';
    } else if (mediumCorrect >= 2 && percentage >= 50) {
      skillLevel = 'intermediate';
    } else {
      skillLevel = 'beginner';
    }

    return {
      total: questions.length,
      correct: correctAnswers,
      percentage,
      skillLevel,
      easyCorrect,
      mediumCorrect,
      hardCorrect
    };
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const results = calculateResults();
    setShowResults(true);
    
    setTimeout(() => {
      onComplete(results.skillLevel, results.percentage);
    }, 3000);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;

  if (showResults) {
    const results = calculateResults();
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`max-w-3xl w-full p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl my-8`}
        >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-4"
          >
            Assessment Complete!
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="text-6xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
              {results.percentage.toFixed(0)}%
            </div>
            <p className="text-lg text-gray-500">
              {results.correct} out of {results.total} correct
            </p>
          </motion.div>

          {/* Skill Level Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${
              results.skillLevel === 'advanced'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                : results.skillLevel === 'intermediate'
                ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white'
                : 'bg-gradient-to-r from-green-400 to-teal-500 text-white'
            }`}>
              {results.skillLevel === 'advanced' && <Zap className="w-5 h-5" />}
              {results.skillLevel === 'intermediate' && <Target className="w-5 h-5" />}
              {results.skillLevel === 'beginner' && <Award className="w-5 h-5" />}
              {results.skillLevel.charAt(0).toUpperCase() + results.skillLevel.slice(1)} Level
            </div>
          </motion.div>

          {/* Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`grid grid-cols-3 gap-4 mb-8 p-6 rounded-xl ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <div>
              <div className="text-2xl font-bold text-green-500">{results.easyCorrect}</div>
              <div className="text-sm text-gray-500">Easy Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">{results.mediumCorrect}</div>
              <div className="text-sm text-gray-500">Medium Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">{results.hardCorrect}</div>
              <div className="text-sm text-gray-500">Hard Questions</div>
            </div>
          </motion.div>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`p-6 rounded-xl ${isDarkMode ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'} mb-6`}
          >
            <h3 className="font-semibold mb-2 flex items-center gap-2 justify-center">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Your Personalized Roadmap is Ready!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {results.skillLevel === 'advanced' && 
                "We'll focus on advanced topics and skip the basics to help you master expert-level concepts."}
              {results.skillLevel === 'intermediate' && 
                "We'll skip beginner content and focus on intermediate to advanced topics to accelerate your growth."}
              {results.skillLevel === 'beginner' && 
                "We'll start with fundamentals and build a strong foundation before moving to advanced topics."}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-gray-500"
          >
            Generating your personalized roadmap...
          </motion.p>
        </div>
        </motion.div>
      </motion.div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-2xl p-6`}
      >
        {/* Header */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-8 mb-6`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Skill Assessment</h2>
                <p className="text-sm text-gray-500">{careerStream}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining < 60 ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{formatTime(timeRemaining)}</span>
              </div>

              {/* Skip Button */}
              <button
                onClick={onSkip}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
              >
                Skip Assessment
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-gray-500">{answeredCount} answered</span>
            </div>
            <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              />
            </div>
          </div>

          {/* Difficulty Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              currentQ.difficulty === 'easy'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : currentQ.difficulty === 'medium'
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
            }`}>
              {currentQ.difficulty.charAt(0).toUpperCase() + currentQ.difficulty.slice(1)}
            </span>
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-8 mb-6`}
          >
            <h3 className="text-xl font-semibold mb-6">{currentQ.question}</h3>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQ.id] === index;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQ.id, index)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-[1.02]'
                        : isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'border-white bg-white'
                          : isDarkMode
                          ? 'border-gray-500'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle className="w-5 h-5 text-purple-500" />}
                      </div>
                      <span className={`${isSelected ? 'font-semibold' : ''}`}>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentQuestion === 0
                ? 'opacity-50 cursor-not-allowed'
                : isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Previous
          </button>

          <div className="flex gap-3">
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg transition-all flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={answeredCount < questions.length}
                className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  answeredCount < questions.length
                    ? 'opacity-50 cursor-not-allowed bg-gray-400'
                    : 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg'
                }`}
              >
                Submit Assessment
                <CheckCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Answer Status */}
        <div className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  selectedAnswers[questions[index].id] !== undefined
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : index === currentQuestion
                    ? isDarkMode
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-300 text-gray-900'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

