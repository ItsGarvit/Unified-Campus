import type { OnboardingData } from "../components/CareerOnboarding";
import type { RoadmapData } from "../components/CareerRoadmap";

interface StreamCurriculum {
  yearGoals: string[];
  monthlyContent: MonthlyContent[];
}

interface MonthlyContent {
  topic: string;
  weeks: WeekContent[];
}

interface WeekContent {
  focus: string;
  dailyBreakdown: DailyBreakdown;
}

interface DailyBreakdown {
  weekday: string[];
  saturday: string[];
  sunday: string[];
}

// Comprehensive curriculum for each stream with unique weekly progressions
const STREAM_CURRICULA: Record<string, StreamCurriculum> = {
  'web-dev': {
    yearGoals: [
      'Master HTML, CSS, JavaScript fundamentals and build responsive websites',
      'Learn React, Node.js, databases and build full-stack applications',
      'Advanced topics: TypeScript, Testing, DevOps, and real-world projects',
      'System design, performance optimization, and career preparation'
    ],
    monthlyContent: [
      // Year 1 - Months 1-12
      {
        topic: 'HTML5 Fundamentals & Semantic Markup',
        weeks: [
          {
            focus: 'HTML Document Structure & Basic Tags',
            dailyBreakdown: {
              weekday: [
                'Learn HTML document anatomy (<!DOCTYPE>, <html>, <head>, <body>)',
                'Master basic tags: headings, paragraphs, lists, links',
                'Study semantic HTML5 elements',
                'Practice creating multi-page websites'
              ],
              saturday: ['Build a 3-page personal website with navigation'],
              sunday: ['Add images, optimize structure, validate HTML']
            }
          },
          {
            focus: 'Forms, Tables & Input Elements',
            dailyBreakdown: {
              weekday: [
                'Learn form structure and input types',
                'Master form validation attributes',
                'Study table structures and data organization',
                'Practice building contact and registration forms'
              ],
              saturday: ['Build complete registration form with all input types'],
              sunday: ['Create data table with sorting capabilities']
            }
          },
          {
            focus: 'Multimedia & Advanced HTML Features',
            dailyBreakdown: {
              weekday: [
                'Embed videos, audio, and iframes',
                'Learn Canvas and SVG basics',
                'Study HTML5 APIs (Geolocation, Storage)',
                'Practice building media-rich pages'
              ],
              saturday: ['Build portfolio page with video background and audio'],
              sunday: ['Create interactive canvas drawing app']
            }
          },
          {
            focus: 'Accessibility & SEO Best Practices',
            dailyBreakdown: {
              weekday: [
                'Learn ARIA labels and roles',
                'Master semantic HTML for accessibility',
                'Study SEO meta tags and structured data',
                'Practice screen reader compatible markup'
              ],
              saturday: ['Audit and fix accessibility issues in previous projects'],
              sunday: ['Optimize all projects for SEO and accessibility']
            }
          }
        ]
      },
      {
        topic: 'CSS3, Flexbox & Grid Layouts',
        weeks: [
          {
            focus: 'CSS Fundamentals & Box Model',
            dailyBreakdown: {
              weekday: [
                'Master CSS selectors and specificity rules',
                'Deep dive into box model (margin, padding, border)',
                'Learn display properties and positioning',
                'Practice styling complex layouts'
              ],
              saturday: ['Style personal website with custom CSS (no frameworks)'],
              sunday: ['Create CSS style guide with all properties demonstrated']
            }
          },
          {
            focus: 'Flexbox: One-Dimensional Layouts',
            dailyBreakdown: {
              weekday: [
                'Learn flex container and item properties',
                'Master justify-content and align-items',
                'Study flex-grow, flex-shrink, flex-basis',
                'Practice building navigation bars and card layouts'
              ],
              saturday: ['Build responsive navbar with hamburger menu using Flexbox'],
              sunday: ['Create pricing cards layout with Flexbox']
            }
          },
          {
            focus: 'CSS Grid: Two-Dimensional Layouts',
            dailyBreakdown: {
              weekday: [
                'Learn grid container and grid-template properties',
                'Master grid-areas and named lines',
                'Study implicit vs explicit grids',
                'Practice complex dashboard layouts'
              ],
              saturday: ['Build complete dashboard layout using CSS Grid'],
              sunday: ['Create magazine-style article layout with Grid']
            }
          },
          {
            focus: 'Responsive Design & Media Queries',
            dailyBreakdown: {
              weekday: [
                'Learn mobile-first approach and breakpoints',
                'Master media queries for all devices',
                'Study responsive units (rem, em, vw, vh)',
                'Practice fluid typography and images'
              ],
              saturday: ['Make all previous projects fully responsive'],
              sunday: ['Build responsive landing page from scratch']
            }
          }
        ]
      },
      {
        topic: 'Advanced CSS & Animations',
        weeks: [
          {
            focus: 'CSS Transitions & Transforms',
            dailyBreakdown: {
              weekday: [
                'Learn transition properties and timing functions',
                'Master 2D transforms (rotate, scale, translate)',
                'Study 3D transforms and perspective',
                'Practice creating smooth hover effects'
              ],
              saturday: ['Build animated card flip gallery'],
              sunday: ['Create 3D cube navigation menu']
            }
          },
          {
            focus: 'CSS Keyframe Animations',
            dailyBreakdown: {
              weekday: [
                'Master @keyframes syntax and properties',
                'Learn animation timing and delays',
                'Study animation-fill-mode and direction',
                'Practice creating loading animations'
              ],
              saturday: ['Build animated hero section with parallax'],
              sunday: ['Create custom loading spinner collection']
            }
          },
          {
            focus: 'CSS Variables & Modern Features',
            dailyBreakdown: {
              weekday: [
                'Learn CSS custom properties (variables)',
                'Master theming with CSS variables',
                'Study calc(), clamp(), and CSS functions',
                'Practice building dynamic themes'
              ],
              saturday: ['Implement dark/light theme toggle system'],
              sunday: ['Build CSS variable-based design system']
            }
          },
          {
            focus: 'Sass/SCSS Preprocessing',
            dailyBreakdown: {
              weekday: [
                'Learn Sass syntax and nesting',
                'Master mixins and functions',
                'Study partials and imports',
                'Practice modular CSS architecture'
              ],
              saturday: ['Convert previous projects to use Sass'],
              sunday: ['Build reusable Sass component library']
            }
          }
        ]
      },
      {
        topic: 'JavaScript Fundamentals - Part 1',
        weeks: [
          {
            focus: 'Variables, Data Types & Operators',
            dailyBreakdown: {
              weekday: [
                'Learn var, let, const and scoping rules',
                'Master primitive types and type coercion',
                'Study operators and expressions',
                'Practice with console and debugging'
              ],
              saturday: ['Build simple calculator with JS'],
              sunday: ['Create temperature converter app']
            }
          },
          {
            focus: 'Control Flow & Loops',
            dailyBreakdown: {
              weekday: [
                'Master if/else and switch statements',
                'Learn for, while, and do-while loops',
                'Study break and continue keywords',
                'Practice nested loops and patterns'
              ],
              saturday: ['Build number guessing game with validation'],
              sunday: ['Create pattern generator (pyramids, diamonds)']
            }
          },
          {
            focus: 'Functions & Scope',
            dailyBreakdown: {
              weekday: [
                'Learn function declarations and expressions',
                'Master arrow functions and this keyword',
                'Study closures and lexical scope',
                'Practice higher-order functions'
              ],
              saturday: ['Build tip calculator with multiple functions'],
              sunday: ['Create function composition utilities']
            }
          },
          {
            focus: 'Arrays & Array Methods',
            dailyBreakdown: {
              weekday: [
                'Master array creation and manipulation',
                'Learn map, filter, reduce, forEach',
                'Study find, findIndex, some, every',
                'Practice array transformations'
              ],
              saturday: ['Build todo list with array methods'],
              sunday: ['Create data filtering and sorting app']
            }
          }
        ]
      },
      {
        topic: 'JavaScript Fundamentals - Part 2',
        weeks: [
          {
            focus: 'Objects & Object Methods',
            dailyBreakdown: {
              weekday: [
                'Learn object literals and properties',
                'Master object methods and this binding',
                'Study Object.keys, values, entries',
                'Practice object destructuring'
              ],
              saturday: ['Build student grade management system'],
              sunday: ['Create shopping cart with object manipulation']
            }
          },
          {
            focus: 'DOM Manipulation Basics',
            dailyBreakdown: {
              weekday: [
                'Master querySelector and DOM selection',
                'Learn element creation and modification',
                'Study classList and style manipulation',
                'Practice dynamic content generation'
              ],
              saturday: ['Build interactive color picker'],
              sunday: ['Create dynamic content loader']
            }
          },
          {
            focus: 'Event Handling & User Interaction',
            dailyBreakdown: {
              weekday: [
                'Learn addEventListener and event types',
                'Master event bubbling and delegation',
                'Study keyboard and mouse events',
                'Practice form validation'
              ],
              saturday: ['Build interactive accordion component'],
              sunday: ['Create modal popup system with events']
            }
          },
          {
            focus: 'Form Handling & Validation',
            dailyBreakdown: {
              weekday: [
                'Master form submission and preventDefault',
                'Learn real-time input validation',
                'Study regex for pattern matching',
                'Practice error messaging'
              ],
              saturday: ['Build multi-step form with validation'],
              sunday: ['Create password strength checker']
            }
          }
        ]
      },
      {
        topic: 'ES6+ Modern JavaScript',
        weeks: [
          {
            focus: 'Destructuring & Spread/Rest',
            dailyBreakdown: {
              weekday: [
                'Master array and object destructuring',
                'Learn spread operator for arrays/objects',
                'Study rest parameters in functions',
                'Practice modern syntax patterns'
              ],
              saturday: ['Refactor old projects with ES6+ features'],
              sunday: ['Build data merging and extraction utility']
            }
          },
          {
            focus: 'Template Literals & Modules',
            dailyBreakdown: {
              weekday: [
                'Learn template literals and string interpolation',
                'Master import/export module syntax',
                'Study default and named exports',
                'Practice modular code organization'
              ],
              saturday: ['Build reusable utility module library'],
              sunday: ['Create templating system for HTML generation']
            }
          },
          {
            focus: 'Async JavaScript - Promises',
            dailyBreakdown: {
              weekday: [
                'Understand asynchronous programming concepts',
                'Master Promise creation and chaining',
                'Learn .then(), .catch(), .finally()',
                'Practice error handling in async code'
              ],
              saturday: ['Build weather app with API calls (Promises)'],
              sunday: ['Create image loader with promise handling']
            }
          },
          {
            focus: 'Async/Await & Fetch API',
            dailyBreakdown: {
              weekday: [
                'Master async/await syntax',
                'Learn fetch API for HTTP requests',
                'Study try/catch error handling',
                'Practice working with JSON data'
              ],
              saturday: ['Build movie search app using OMDB API'],
              sunday: ['Create cryptocurrency price tracker']
            }
          }
        ]
      },
      {
        topic: 'Git & GitHub Mastery',
        weeks: [
          {
            focus: 'Git Basics & Local Workflow',
            dailyBreakdown: {
              weekday: [
                'Install Git and configure settings',
                'Learn init, add, commit workflow',
                'Master branch creation and switching',
                'Practice commit history and log'
              ],
              saturday: ['Initialize Git for all existing projects'],
              sunday: ['Practice branching strategies']
            }
          },
          {
            focus: 'GitHub & Remote Repositories',
            dailyBreakdown: {
              weekday: [
                'Create GitHub account and SSH setup',
                'Learn push, pull, fetch operations',
                'Master remote repository management',
                'Practice collaboration workflows'
              ],
              saturday: ['Push all projects to GitHub'],
              sunday: ['Create professional README files']
            }
          },
          {
            focus: 'Branching & Merge Strategies',
            dailyBreakdown: {
              weekday: [
                'Master feature branch workflow',
                'Learn merge vs rebase',
                'Study merge conflict resolution',
                'Practice Git flow strategy'
              ],
              saturday: ['Contribute to open source project'],
              sunday: ['Create pull request with proper documentation']
            }
          },
          {
            focus: 'Advanced Git & GitHub Features',
            dailyBreakdown: {
              weekday: [
                'Learn GitHub Issues and Projects',
                'Master GitHub Actions basics',
                'Study .gitignore and Git hooks',
                'Practice collaborative development'
              ],
              saturday: ['Set up automated deployment with GitHub'],
              sunday: ['Create project documentation wiki']
            }
          }
        ]
      },
      {
        topic: 'React Fundamentals',
        weeks: [
          {
            focus: 'React Setup & JSX',
            dailyBreakdown: {
              weekday: [
                'Install Node.js and create React app',
                'Learn JSX syntax and expressions',
                'Master component structure',
                'Practice creating functional components'
              ],
              saturday: ['Build first React app: Hello World enhanced'],
              sunday: ['Create component library showcase']
            }
          },
          {
            focus: 'Props & Component Composition',
            dailyBreakdown: {
              weekday: [
                'Master passing props to components',
                'Learn props destructuring patterns',
                'Study children prop and composition',
                'Practice reusable component design'
              ],
              saturday: ['Build reusable Card and Button components'],
              sunday: ['Create product catalog with props']
            }
          },
          {
            focus: 'State & Event Handling',
            dailyBreakdown: {
              weekday: [
                'Learn useState hook fundamentals',
                'Master state updates and re-renders',
                'Study event handling in React',
                'Practice controlled components'
              ],
              saturday: ['Build counter app with multiple features'],
              sunday: ['Create interactive form with state management']
            }
          },
          {
            focus: 'Lists, Keys & Conditional Rendering',
            dailyBreakdown: {
              weekday: [
                'Master rendering lists with map()',
                'Learn proper key usage',
                'Study conditional rendering patterns',
                'Practice dynamic UI updates'
              ],
              saturday: ['Build todo app with CRUD operations'],
              sunday: ['Create filterable product list']
            }
          }
        ]
      },
      {
        topic: 'React Hooks Deep Dive',
        weeks: [
          {
            focus: 'useEffect & Side Effects',
            dailyBreakdown: {
              weekday: [
                'Understand useEffect lifecycle',
                'Learn dependency array rules',
                'Master cleanup functions',
                'Practice data fetching with useEffect'
              ],
              saturday: ['Build real-time clock with useEffect'],
              sunday: ['Create data fetching component with loading states']
            }
          },
          {
            focus: 'useContext & Global State',
            dailyBreakdown: {
              weekday: [
                'Learn Context API creation',
                'Master useContext hook',
                'Study provider pattern',
                'Practice theme switching with Context'
              ],
              saturday: ['Implement dark mode toggle across app'],
              sunday: ['Build multi-language support system']
            }
          },
          {
            focus: 'useReducer & Complex State',
            dailyBreakdown: {
              weekday: [
                'Master useReducer for complex state',
                'Learn reducer functions and actions',
                'Study state management patterns',
                'Practice shopping cart logic'
              ],
              saturday: ['Build shopping cart with useReducer'],
              sunday: ['Create form wizard with complex state']
            }
          },
          {
            focus: 'Custom Hooks & Optimization',
            dailyBreakdown: {
              weekday: [
                'Learn creating custom hooks',
                'Master useMemo and useCallback',
                'Study React.memo for optimization',
                'Practice performance optimization'
              ],
              saturday: ['Create custom hooks library (useLocalStorage, useFetch)'],
              sunday: ['Optimize previous React projects']
            }
          }
        ]
      },
      {
        topic: 'React Router & SPA Development',
        weeks: [
          {
            focus: 'React Router Setup & Basic Navigation',
            dailyBreakdown: {
              weekday: [
                'Install and configure React Router',
                'Learn BrowserRouter and Routes',
                'Master Link and NavLink components',
                'Practice multi-page SPA structure'
              ],
              saturday: ['Build multi-page portfolio with routing'],
              sunday: ['Create navigation with active link styling']
            }
          },
          {
            focus: 'Dynamic Routes & URL Parameters',
            dailyBreakdown: {
              weekday: [
                'Master dynamic route parameters',
                'Learn useParams hook',
                'Study nested routes',
                'Practice building detail pages'
              ],
              saturday: ['Build blog with dynamic post pages'],
              sunday: ['Create e-commerce product detail system']
            }
          },
          {
            focus: 'Protected Routes & Navigation Guards',
            dailyBreakdown: {
              weekday: [
                'Learn route protection patterns',
                'Master useNavigate hook',
                'Study programmatic navigation',
                'Practice authentication routing'
              ],
              saturday: ['Implement protected dashboard routes'],
              sunday: ['Create login/logout flow with redirects']
            }
          },
          {
            focus: 'Advanced Routing & Code Splitting',
            dailyBreakdown: {
              weekday: [
                'Master lazy loading and Suspense',
                'Learn code splitting strategies',
                'Study route-based splitting',
                'Practice optimizing bundle size'
              ],
              saturday: ['Implement lazy loading for all routes'],
              sunday: ['Build loading fallback components']
            }
          }
        ]
      },
      {
        topic: 'Backend Basics with Node.js',
        weeks: [
          {
            focus: 'Node.js Fundamentals & NPM',
            dailyBreakdown: {
              weekday: [
                'Install Node.js and understand runtime',
                'Learn NPM package management',
                'Master module system (CommonJS)',
                'Practice creating Node.js scripts'
              ],
              saturday: ['Build CLI tool with Node.js'],
              sunday: ['Create file system utility scripts']
            }
          },
          {
            focus: 'Express.js Setup & Routing',
            dailyBreakdown: {
              weekday: [
                'Install Express and create server',
                'Learn routing and HTTP methods',
                'Master request and response objects',
                'Practice building REST endpoints'
              ],
              saturday: ['Build basic REST API with Express'],
              sunday: ['Create API with CRUD operations']
            }
          },
          {
            focus: 'Middleware & Error Handling',
            dailyBreakdown: {
              weekday: [
                'Master Express middleware concept',
                'Learn built-in and custom middleware',
                'Study error handling patterns',
                'Practice logging and validation middleware'
              ],
              saturday: ['Implement authentication middleware'],
              sunday: ['Build comprehensive error handling system']
            }
          },
          {
            focus: 'Static Files & Template Engines',
            dailyBreakdown: {
              weekday: [
                'Learn serving static files',
                'Master EJS or Handlebars templates',
                'Study server-side rendering basics',
                'Practice building server-rendered pages'
              ],
              saturday: ['Build server-rendered blog'],
              sunday: ['Create admin dashboard with templates']
            }
          }
        ]
      },
      {
        topic: 'Express.js & RESTful APIs',
        weeks: [
          {
            focus: 'RESTful API Design Principles',
            dailyBreakdown: {
              weekday: [
                'Learn REST architecture principles',
                'Master resource-based routing',
                'Study HTTP status codes',
                'Practice API endpoint design'
              ],
              saturday: ['Design complete API for blog platform'],
              sunday: ['Document API with proper conventions']
            }
          },
          {
            focus: 'Request Validation & Sanitization',
            dailyBreakdown: {
              weekday: [
                'Learn express-validator library',
                'Master input validation rules',
                'Study data sanitization techniques',
                'Practice validation middleware'
              ],
              saturday: ['Implement validation for all API endpoints'],
              sunday: ['Add security sanitization']
            }
          },
          {
            focus: 'File Uploads & Multer',
            dailyBreakdown: {
              weekday: [
                'Learn file upload handling',
                'Master Multer middleware',
                'Study file storage strategies',
                'Practice image upload and validation'
              ],
              saturday: ['Build file upload API endpoint'],
              sunday: ['Create image gallery with uploads']
            }
          },
          {
            focus: 'API Testing with Postman',
            dailyBreakdown: {
              weekday: [
                'Learn Postman basics',
                'Master creating collections',
                'Study environment variables',
                'Practice automated testing'
              ],
              saturday: ['Create complete Postman collection for API'],
              sunday: ['Write automated test scripts']
            }
          }
        ]
      },
      {
        topic: 'MongoDB & Database Design',
        weeks: [
          {
            focus: 'MongoDB Basics & Setup',
            dailyBreakdown: {
              weekday: [
                'Install MongoDB and Compass',
                'Learn document-based databases',
                'Master CRUD operations in Mongo shell',
                'Practice database and collection creation'
              ],
              saturday: ['Set up MongoDB Atlas cloud database'],
              sunday: ['Practice complex queries and aggregations']
            }
          },
          {
            focus: 'Mongoose ODM',
            dailyBreakdown: {
              weekday: [
                'Learn Mongoose installation and setup',
                'Master schema and model creation',
                'Study validation and constraints',
                'Practice CRUD with Mongoose'
              ],
              saturday: ['Build User model with validation'],
              sunday: ['Create complete data models for blog']
            }
          },
          {
            focus: 'Database Relationships & Population',
            dailyBreakdown: {
              weekday: [
                'Learn referencing vs embedding',
                'Master populate() for relationships',
                'Study one-to-many and many-to-many',
                'Practice complex data relationships'
              ],
              saturday: ['Implement user-posts relationship'],
              sunday: ['Build comments system with nested relationships']
            }
          },
          {
            focus: 'Database Queries & Optimization',
            dailyBreakdown: {
              weekday: [
                'Master advanced query operators',
                'Learn indexing strategies',
                'Study aggregation pipeline',
                'Practice query optimization'
              ],
              saturday: ['Implement search and filtering'],
              sunday: ['Add pagination and sorting']
            }
          }
        ]
      }
    ]
  },
  // Add other streams with similar detailed weekly progressions...
  'mobile-dev': {
    yearGoals: [
      'Learn mobile UI/UX principles and build basic React Native apps',
      'Master React Native, native modules, and complex app development',
      'Advanced features: animations, performance, native development',
      'Production apps, app store deployment, and career readiness'
    ],
    monthlyContent: [] // Would be populated similarly
  },
  'data-science': {
    yearGoals: [
      'Master Python, statistics, and data analysis fundamentals',
      'Learn machine learning, deep learning, and model development',
      'Advanced ML, NLP, computer vision, and real-world projects',
      'MLOps, production systems, and career preparation'
    ],
    monthlyContent: [] // Would be populated similarly
  },
  'devops': {
    yearGoals: [
      'Learn Linux, networking, scripting, and version control basics',
      'Master containerization, CI/CD, and cloud platforms',
      'Advanced orchestration, infrastructure as code, monitoring',
      'Production systems, SRE practices, and career preparation'
    ],
    monthlyContent: [] // Would be populated similarly
  },
  'cyber-security': {
    yearGoals: [
      'Learn networking, OS fundamentals, and security basics',
      'Master ethical hacking, penetration testing, and security tools',
      'Advanced security: malware analysis, forensics, compliance',
      'Security architecture, certifications, and career launch'
    ],
    monthlyContent: [] // Would be populated similarly
  },
  'blockchain': {
    yearGoals: [
      'Learn blockchain fundamentals, cryptography, and smart contracts',
      'Master Solidity, DApp development, and Web3 integration',
      'Advanced blockchain: DeFi, NFTs, Layer 2 solutions',
      'Production DApps, auditing, and career preparation'
    ],
    monthlyContent: [] // Would be populated similarly
  },
  'game-dev': {
    yearGoals: [
      'Learn game design, Unity basics, and 2D game development',
      'Master 3D game development, physics, and advanced Unity',
      'Advanced topics: multiplayer, VR/AR, optimization',
      'Production-quality games, portfolio, and career launch'
    ],
    monthlyContent: [] // Would be populated similarly
  },
  'ui-ux': {
    yearGoals: [
      'Learn design fundamentals, Figma, and basic UI principles',
      'Master UX research, prototyping, and design systems',
      'Advanced design: interaction, animation, accessibility',
      'Production design work, portfolio, and career launch'
    ],
    monthlyContent: [] // Would be populated similarly
  }
};

export function generateRoadmap(data: OnboardingData): RoadmapData {
  const currentYear = data.currentYear || 1;
  const graduationYear = data.graduationYear || 4;
  const yearsRemaining = graduationYear - currentYear + 1;
  const primaryInterest = data.interests[0] || 'web-dev';

  // Get curriculum for the primary interest
  const curriculum = STREAM_CURRICULA[primaryInterest] || STREAM_CURRICULA['web-dev'];

  // Define goal label
  const goalLabels: Record<string, string> = {
    'land-first-job': 'Land Your First Tech Job',
    'career-switch': 'Successfully Switch to Tech Career',
    'skill-upgrade': 'Master Advanced Technical Skills',
    'freelance': 'Build Successful Freelance Career',
    'startup': 'Launch Your Tech Startup',
    'promotion': 'Achieve Senior Technical Role'
  };

  const overallGoal = goalLabels[data.primaryGoal] || 'Achieve Career Excellence';

  // Generate years array
  const years = [];
  for (let i = 0; i < yearsRemaining; i++) {
    const yearNumber = currentYear + i;
    years.push(generateYearPlan(yearNumber, i, yearsRemaining, curriculum));
  }

  return {
    overallGoal,
    totalDuration: `${yearsRemaining} year${yearsRemaining > 1 ? 's' : ''}`,
    years
  };
}

function generateYearPlan(
  yearNumber: number,
  yearIndex: number,
  totalYears: number,
  curriculum: StreamCurriculum
) {
  const title = `Year ${yearNumber}: ${getYearTitle(yearIndex)}`;
  const goal = curriculum.yearGoals[yearIndex] || 'Continue professional development and mastery';

  // Get 12 months of content for this year
  const monthStartIndex = yearIndex * 12;
  const yearMonthlyContent = curriculum.monthlyContent.slice(monthStartIndex, monthStartIndex + 12);

  const months = [];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  for (let i = 0; i < 12; i++) {
    const content = yearMonthlyContent[i];
    if (content) {
      months.push(generateMonthPlan(monthNames[i], content));
    } else {
      // Fallback for months without defined content
      months.push(generateFallbackMonth(monthNames[i], i));
    }
  }

  return {
    year: yearNumber,
    title,
    goal,
    months
  };
}

function getYearTitle(yearIndex: number): string {
  const titles = [
    'Foundation Building',
    'Skill Development',
    'Practical Application',
    'Career Launch'
  ];
  return titles[yearIndex] || 'Advanced Mastery';
}

function generateMonthPlan(monthName: string, content: MonthlyContent) {
  const weeks = content.weeks.map((weekContent, index) => ({
    week: index + 1,
    focus: weekContent.focus,
    dailyTasks: generateWeekDailyTasks(weekContent)
  }));

  return {
    month: monthName,
    goal: content.topic,
    weeks
  };
}

function generateWeekDailyTasks(weekContent: WeekContent) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dailyTasks = [];

  for (let i = 0; i < 7; i++) {
    const day = days[i];
    let tasks;

    if (i < 5) {
      // Weekday - use the 4 weekday activities for this week
      const activity = weekContent.dailyBreakdown.weekday[i] || weekContent.dailyBreakdown.weekday[0];
      tasks = [
        {
          id: `${day}-1`,
          title: `Study: ${activity}`,
          type: 'study' as const,
          duration: '1-2 hours'
        },
        {
          id: `${day}-2`,
          title: `Practice: Hands-on coding for ${activity}`,
          type: 'practice' as const,
          duration: '1-2 hours'
        },
        {
          id: `${day}-3`,
          title: 'Watch tutorial or read documentation',
          type: 'study' as const,
          duration: '30-45 minutes'
        },
        {
          id: `${day}-4`,
          title: 'Review concepts and take notes',
          type: 'review' as const,
          duration: '30 minutes'
        }
      ];
    } else if (i === 5) {
      // Saturday
      const saturdayProject = weekContent.dailyBreakdown.saturday[0] || 'Work on weekly project';
      tasks = [
        {
          id: `${day}-1`,
          title: saturdayProject,
          type: 'project' as const,
          duration: '3-4 hours'
        },
        {
          id: `${day}-2`,
          title: 'Document progress and write README',
          type: 'review' as const,
          duration: '1 hour'
        }
      ];
    } else {
      // Sunday
      const sundayProject = weekContent.dailyBreakdown.sunday[0] || 'Complete and refine weekly project';
      tasks = [
        {
          id: `${day}-1`,
          title: sundayProject,
          type: 'project' as const,
          duration: '2-3 hours'
        },
        {
          id: `${day}-2`,
          title: 'Review weekly learnings and plan ahead',
          type: 'review' as const,
          duration: '1 hour'
        }
      ];
    }

    dailyTasks.push({ day, tasks });
  }

  return dailyTasks;
}

function generateFallbackMonth(monthName: string, monthIndex: number) {
  return {
    month: monthName,
    goal: `Advanced Topics & Project Work - Month ${monthIndex + 1}`,
    weeks: [
      {
        week: 1,
        focus: 'Learning new concepts and fundamentals',
        dailyTasks: generateGenericWeek(1)
      },
      {
        week: 2,
        focus: 'Practicing and building mini projects',
        dailyTasks: generateGenericWeek(2)
      },
      {
        week: 3,
        focus: 'Advanced implementation and optimization',
        dailyTasks: generateGenericWeek(3)
      },
      {
        week: 4,
        focus: 'Final project and comprehensive review',
        dailyTasks: generateGenericWeek(4)
      }
    ]
  };
}

function generateGenericWeek(weekNumber: number) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map((day, index) => {
    if (index < 5) {
      return {
        day,
        tasks: [
          { id: `${day}-1`, title: 'Study core concepts', type: 'study' as const, duration: '1-2 hours' },
          { id: `${day}-2`, title: 'Practice exercises', type: 'practice' as const, duration: '1-2 hours' },
          { id: `${day}-3`, title: 'Watch tutorials', type: 'study' as const, duration: '30-45 min' },
          { id: `${day}-4`, title: 'Code review', type: 'review' as const, duration: '30 min' }
        ]
      };
    } else if (index === 5) {
      return {
        day,
        tasks: [
          { id: `${day}-1`, title: 'Build weekly project', type: 'project' as const, duration: '3-4 hours' },
          { id: `${day}-2`, title: 'Document and test', type: 'review' as const, duration: '1 hour' }
        ]
      };
    } else {
      return {
        day,
        tasks: [
          { id: `${day}-1`, title: 'Complete and polish project', type: 'project' as const, duration: '2-3 hours' },
          { id: `${day}-2`, title: 'Weekly review and planning', type: 'review' as const, duration: '1 hour' }
        ]
      };
    }
  });
}
