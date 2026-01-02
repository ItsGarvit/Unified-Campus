import type { OnboardingData } from "../components/CareerOnboarding";
import type { RoadmapData } from "../components/CareerRoadmap";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * Generate a personalized career roadmap using Gemini AI
 */
export async function generateCareerPathWithAI(
  onboardingData: OnboardingData
): Promise<RoadmapData | null> {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not configured. Using fallback static data.');
    return null;
  }

  const prompt = buildPrompt(onboardingData);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error('No content in Gemini response');
    }

    // Parse the JSON response
    const roadmapData = JSON.parse(textContent) as RoadmapData;
    return roadmapData;

  } catch (error) {
    console.error('Error generating career path with Gemini:', error);
    return null;
  }
}

function buildPrompt(data: OnboardingData): string {
  const goalLabels: Record<string, string> = {
    'land-first-job': 'Land My First Tech Job',
    'career-switch': 'Switch Career to Tech',
    'skill-upgrade': 'Upgrade My Current Skills',
    'freelance': 'Start Freelancing',
    'startup': 'Build My Own Startup',
    'promotion': 'Get Promoted to Senior Role'
  };

  const timeframeLabels: Record<string, string> = {
    '3-6-months': '3-6 months',
    '6-12-months': '6-12 months',
    '1-2-years': '1-2 years',
    '2-plus-years': '2+ years'
  };

  const levelLabels: Record<string, string> = {
    'complete-beginner': 'Complete Beginner',
    'some-knowledge': 'Some Knowledge (taken a few courses)',
    'intermediate': 'Intermediate (built some projects)',
    'advanced': 'Advanced (working professionally)'
  };

  const interestLabels: Record<string, string> = {
    'web-dev': 'Web Development',
    'mobile-dev': 'Mobile Development',
    'data-science': 'Data Science & AI',
    'devops': 'DevOps & Cloud',
    'cyber-security': 'Cybersecurity',
    'blockchain': 'Blockchain & Web3',
    'game-dev': 'Game Development',
    'ui-ux': 'UI/UX Design'
  };

  const interests = data.interests.map(i => interestLabels[i] || i).join(', ');

  return `You are an expert career counselor and tech mentor. Create a personalized career roadmap for a student with the following profile:

**Student Profile:**
- Primary Goal: ${goalLabels[data.primaryGoal] || data.primaryGoal}
- Timeframe: ${timeframeLabels[data.timeframe] || data.timeframe}
- Current Level: ${levelLabels[data.currentLevel] || data.currentLevel}
- Interests: ${interests}
- Current Year of Study: Year ${data.currentYear}
- Graduation Year: Year ${data.graduationYear}
- Current Semester: ${data.currentSemester}

Generate a structured career roadmap in the following JSON format. Be specific, practical, and actionable. Include real technologies, skills, and projects that are in demand in the current job market (2024-2025).

{
  "overallGoal": "A motivating one-line description of their career destination",
  "totalDuration": "The total duration (e.g., '12 months', '2 years')",
  "years": [
    {
      "year": 1,
      "title": "Year title (e.g., 'Foundation Building')",
      "goal": "Main goal for this year",
      "months": [
        {
          "month": "Month name (e.g., 'Month 1-2: HTML & CSS Mastery')",
          "goal": "Specific goal for this month",
          "weeks": [
            {
              "week": 1,
              "focus": "Weekly focus area with specific topics",
              "dailyTasks": [
                {
                  "day": "Day name (e.g., 'Monday-Thursday')",
                  "tasks": [
                    {
                      "id": "unique-task-id",
                      "title": "Specific task description",
                      "type": "study|practice|project|review",
                      "duration": "e.g., '2 hours'",
                      "completed": false
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

Important guidelines:
1. Create at least 2-3 years of content based on the timeframe
2. Each year should have 3-4 months of detailed content
3. Each month should have 2-4 weeks
4. Include specific resources (courses, projects, skills) that are relevant to their interests
5. Make the progression logical - basics first, then advanced topics
6. Include portfolio projects and real-world applications
7. Consider the Indian job market context with relevant skills and companies
8. Be encouraging and realistic in the goal descriptions

Return ONLY the valid JSON object, no other text.`;
}

/**
 * Check if Gemini API is configured
 */
export function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY;
}

/**
 * Search for colleges globally using Gemini AI
 */
export async function searchCollegesWithAI(query: string): Promise<string[]> {
  if (!GEMINI_API_KEY) {
    return [];
  }

  const prompt = `Search for colleges/universities globally that match the query: "${query}". 
  Return a JSON array of strings containing only the top 5 most relevant college names. 
  Each name should be the full, official name of the institution.
  Return ONLY the JSON array, no other text.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2, // Lower temperature for more consistent results
          maxOutputTokens: 500,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      return [];
    }

    const colleges = JSON.parse(textContent) as string[];
    return Array.isArray(colleges) ? colleges : [];

  } catch (error) {
    console.error('Error searching colleges with Gemini:', error);
    return [];
  }
}
