import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { QualificationWarnings } from "./components/QualificationWarnings";
import { ResumeActions } from "./components/ResumeActions";
import { ImprovementSuggestions } from "./components/ImprovementSuggestions";
import { SuggestedSkills } from "./components/SuggestedSkills";
import ResumeScoreCard from "./ResumeScoreCard";
import { QualificationGap } from "@/types/resume";

interface OptimizedResumeDisplayProps {
  optimizedResume: string;
  jobDescription?: string;
  originalResume?: string;
  qualificationGaps?: QualificationGap[];
}

export const OptimizedResumeDisplay = ({
  optimizedResume,
  jobDescription,
  originalResume,
  qualificationGaps
}: OptimizedResumeDisplayProps) => {
  const scoreCardRef = useRef<HTMLDivElement | null>(null);
  const completeReportRef = useRef<HTMLDivElement | null>(null);

  if (!optimizedResume) return null;

  const keywordScore = calculateKeywordScore(optimizedResume, jobDescription || "");
  const structureScore = calculateStructureScore(optimizedResume);
  const atsScore = calculateATSScore(optimizedResume);
  const overallScore = Math.round((keywordScore + structureScore + atsScore) / 3);

  const suggestions = generateSuggestions(keywordScore, structureScore, atsScore, optimizedResume, jobDescription || "");
  const scoreData = {
    overallScore,
    keywordScore,
    structureScore,
    atsScore,
    suggestions,
    timestamp: new Date().toLocaleString(),
  };

  return (
    <Card className="border-t-8 border-t-indigo-600 shadow-xl bg-gradient-to-bl from-white via-indigo-50 to-blue-100 relative mt-10 animate-fade-in">
      <ResumeActions scoreCardRef={scoreCardRef} completeReportRef={completeReportRef} />
      
      <div className="flex flex-col items-center justify-center py-10">
        <div ref={scoreCardRef} className="fixed left-[-9999px] top-0 z-[-1] bg-white">
          <ResumeScoreCard scoreData={scoreData} />
        </div>
        <div className="w-full flex items-center justify-center px-2">
          <ResumeScoreCard scoreData={scoreData} />
        </div>
      </div>

      <div ref={completeReportRef} className="bg-white p-6 rounded-lg mx-6 mb-6 shadow-inner">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">Complete Resume Analysis Report</h1>
          <p className="text-fuchsia-600 font-medium">Generated on {scoreData.timestamp}</p>
          <div className="mt-4 inline-block bg-indigo-50 px-4 py-2 rounded-full text-indigo-700 font-semibold">
            Overall Score: {scoreData.overallScore}/100
          </div>
        </div>

        <ScoreBreakdown scoreData={scoreData} />

        {qualificationGaps && qualificationGaps.length > 0 && (
          <QualificationWarnings qualificationGaps={qualificationGaps} />
        )}

        <ImprovementSuggestions suggestions={suggestions} />
        <SuggestedSkills skills={[]} />
      </div>

      <CardContent>
        <div className="mt-8 text-center text-sm">
          <div className="font-bold mb-2">{scoreData.overallScore}/100</div>
        </div>
      </CardContent>
    </Card>
  );
};

function calculateKeywordScore(resume: string, jobDescription: string): number {
  if (!jobDescription) return 70;

  const jobWords = jobDescription.toLowerCase().split(/\W+/).filter(word =>
    word.length > 3 && !["and", "the", "that", "with", "for", "this"].includes(word)
  );

  const uniqueJobWords = [...new Set(jobWords)];
  const resumeText = resume.toLowerCase();

  let matches = 0;
  uniqueJobWords.forEach(word => {
    if (resumeText.includes(word)) {
      matches++;
    }
  });

  const maxKeywords = Math.min(uniqueJobWords.length, 20);
  const score = Math.round((matches / maxKeywords) * 100);

  return Math.max(0, Math.min(100, score));
}

function calculateStructureScore(resume: string): number {
  let score = 70;

  const sections = ["experience", "education", "skills", "summary", "objective", "projects"];

  let sectionCount = 0;
  sections.forEach(section => {
    if (resume.toLowerCase().includes(section)) {
      sectionCount++;
    }
  });

  score += Math.min(15, sectionCount * 3);

  const bulletPoints = (resume.match(/•|■|-|✓|\*/g) || []).length;
  score += Math.min(10, bulletPoints);

  const wordCount = resume.split(/\s+/).length;
  if (wordCount > 700) {
    score -= Math.min(10, Math.floor((wordCount - 700) / 50));
  }

  return Math.max(0, Math.min(100, score));
}

function calculateATSScore(resume: string): number {
  let score = 75;

  const issues = [];

  const hasContactInfo = /email|phone|linkedin/i.test(resume);
  if (hasContactInfo) score += 10;

  const hasProperDates = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s+\d{4}\b/i.test(resume);
  if (hasProperDates) score += 5;

  const standardHeaders = ["work experience", "education", "skills", "professional experience"];
  let headerCount = 0;
  standardHeaders.forEach(header => {
    if (resume.toLowerCase().includes(header)) {
      headerCount++;
    }
  });
  score += Math.min(10, headerCount * 3);

  return Math.max(0, Math.min(100, score));
}

function generateSuggestions(keywordScore: number, structureScore: number, atsScore: number, resume: string, jobDescription: string): string[] {
  const suggestions: string[] = [];
  const allSuggestions = {
    keyword: [
      "Include more job-specific keywords from the job description to improve ATS matching.",
      "Align your skills section with the terminology used in the job posting.",
      "Mirror the language and technical terms found in the job description.",
      "Consider adding industry-standard abbreviations and full terms for better keyword coverage.",
      "Incorporate relevant technical skills and tools mentioned in the job posting.",
    ],
    structure: [
      "Improve your resume structure with clear section headers.",
      "Use bullet points to highlight achievements and responsibilities.",
      "Consider adding a professional summary section at the top.",
      "Organize experiences in reverse chronological order for better readability.",
      "Break down long paragraphs into concise bullet points.",
      "Use consistent formatting throughout your resume.",
      "Add clear section dividers to improve scannability.",
    ],
    ats: [
      "Use a simple, ATS-friendly format without tables or columns.",
      "Include your contact information clearly at the top.",
      "Avoid using headers, footers, or text boxes.",
      "Use standard section headings that ATS systems recognize.",
      "Remove any images, graphics, or special characters.",
      "Stick to common fonts like Arial or Calibri.",
    ],
    achievements: [
      "Quantify your achievements with specific numbers and percentages.",
      "Focus on results and impact rather than just responsibilities.",
      "Include metrics that demonstrate your success.",
      "Highlight specific projects and their outcomes.",
      "Add relevant awards or recognition.",
    ],
    formatting: [
      "Keep your resume concise - aim for 1-2 pages maximum.",
      "Use consistent date formats throughout.",
      "Ensure proper spacing between sections.",
      "Maintain consistent font sizes for better readability.",
      "Use bold text strategically to highlight key information.",
    ]
  };

  // Add keyword-related suggestions if score is low
  if (keywordScore < 70) {
    suggestions.push(allSuggestions.keyword[Math.floor(Math.random() * allSuggestions.keyword.length)]);
    
    if (jobDescription) {
      const jobWords = jobDescription.toLowerCase().split(/\W+/).filter(word =>
        word.length > 4 && !["and", "the", "that", "with", "for", "this"].includes(word)
      );

      const uniqueJobWords = [...new Set(jobWords)];
      const resumeText = resume.toLowerCase();
      const missingKeywords: string[] = [];
      
      uniqueJobWords.forEach(word => {
        if (!resumeText.includes(word) && missingKeywords.length < 3) {
          missingKeywords.push(word);
        }
      });

      if (missingKeywords.length > 0) {
        suggestions.push(`Consider incorporating these keywords: ${missingKeywords.join(", ")}.`);
      }
    }
  }

  // Add structure-related suggestions if score is low
  if (structureScore < 70) {
    suggestions.push(allSuggestions.structure[Math.floor(Math.random() * allSuggestions.structure.length)]);
    suggestions.push(allSuggestions.structure[Math.floor(Math.random() * allSuggestions.structure.length)]);
  }

  // Add ATS-related suggestions if score is low
  if (atsScore < 70) {
    suggestions.push(allSuggestions.ats[Math.floor(Math.random() * allSuggestions.ats.length)]);
  }

  // Always add some general improvement suggestions
  const categories = ['achievements', 'formatting'];
  categories.forEach(category => {
    const randomSuggestion = allSuggestions[category][Math.floor(Math.random() * allSuggestions[category].length)];
    if (!suggestions.includes(randomSuggestion)) {
      suggestions.push(randomSuggestion);
    }
  });

  // Ensure we have at least 5 suggestions but no more than 8
  while (suggestions.length < 5) {
    const randomCategory = Object.keys(allSuggestions)[Math.floor(Math.random() * Object.keys(allSuggestions).length)];
    const randomSuggestion = allSuggestions[randomCategory][Math.floor(Math.random() * allSuggestions[randomCategory].length)];
    if (!suggestions.includes(randomSuggestion)) {
      suggestions.push(randomSuggestion);
    }
  }

  // Shuffle the suggestions array for more randomness
  return suggestions.sort(() => Math.random() - 0.5).slice(0, 8);
}

export default OptimizedResumeDisplay;
