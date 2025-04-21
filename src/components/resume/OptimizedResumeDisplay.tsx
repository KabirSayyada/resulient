import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, Star, Award, Medal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OptimizedResumeDisplayProps {
  optimizedResume: string;
  jobDescription?: string;
  originalResume?: string;
}

export const OptimizedResumeDisplay = ({
  optimizedResume,
  jobDescription,
  originalResume
}: OptimizedResumeDisplayProps) => {
  const { toast } = useToast();
  const [showScoreDetails, setShowScoreDetails] = useState(false);

  if (!optimizedResume) return null;

  // Calculate scores based on the optimized resume
  const keywordScore = calculateKeywordScore(optimizedResume, jobDescription || "");
  const structureScore = calculateStructureScore(optimizedResume);
  const atsScore = calculateATSScore(optimizedResume);
  const overallScore = Math.round((keywordScore + structureScore + atsScore) / 3);

  // Generate improvement suggestions
  const suggestions = generateSuggestions(keywordScore, structureScore, atsScore, optimizedResume, jobDescription || "");

  const handleDownload = () => {
    // Create a blob with the resume content and score report
    const scoreReport = `
RESUME STRENGTH REPORT
======================
Overall Score: ${overallScore}/100
Keyword Optimization: ${keywordScore}/100
Content Structure: ${structureScore}/100
ATS Readiness: ${atsScore}/100

IMPROVEMENT SUGGESTIONS:
${suggestions.join("\n")}

OPTIMIZED RESUME:
${optimizedResume}
    `;

    const blob = new Blob([scoreReport], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and click it
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-strength-report.txt";
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report downloaded",
      description: "Your resume strength report has been downloaded successfully.",
    });
  };

  const getScoreCategory = (score: number) => {
    if (score >= 90) return { text: "Excellent", color: "text-green-600" };
    if (score >= 75) return { text: "Good", color: "text-blue-600" };
    if (score >= 60) return { text: "Average", color: "text-yellow-600" };
    return { text: "Needs Improvement", color: "text-red-600" };
  };

  const overallCategory = getScoreCategory(overallScore);

  // Enhanced resume rendering: REMOVE ALL BULLETS/LISTS, only emphasize section headers and add clean spacing
  const renderResumeWithSpacing = (text: string) => {
    // Identify sections and split content
    const sections: { title: string; content: string }[] = [];
    const sectionRegex = /^(EDUCATION|EXPERIENCE|SKILLS|SUMMARY|OBJECTIVE|PROJECTS|CERTIFICATIONS|AWARDS|PUBLICATIONS|REFERENCES|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT|QUALIFICATIONS|VOLUNTEER|LEADERSHIP|ACTIVITIES|INTERESTS)(?:\s|:|$)/i;
    
    // Split text into lines, then into sections
    const lines = text.split('\n');
    let currentSection = { title: '', content: '' };
    let inSection = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      const sectionMatch = trimmedLine.match(sectionRegex);
      if (sectionMatch) {
        if (inSection && currentSection.content.trim()) {
          sections.push({ ...currentSection });
        }
        currentSection = { title: trimmedLine, content: '' };
        inSection = true;
      } else if (inSection) {
        currentSection.content += line + '\n';
      } else if (trimmedLine) {
        if (!currentSection.title) {
          currentSection = { title: 'Header', content: '' };
        }
        currentSection.content += line + '\n';
      }
    });
    if (currentSection.content.trim()) {
      sections.push(currentSection);
    }
    // Render sections with only spacing and header styling
    return sections.map((section, i) => (
      <div key={i} className={i === 0 ? "mb-8" : "mt-12 mb-8"}>
        {section.title !== 'Header' && (
          <div className="text-lg md:text-xl font-extrabold text-indigo-700 uppercase tracking-wide mb-6 mt-2">
            {section.title}
          </div>
        )}
        {renderSectionContent(section.content)}
      </div>
    ));
  };

  // Renders plain paragraphs with spacing, no lists, no bullets
  const renderSectionContent = (content: string) => {
    // Split into paragraphs by double line break, or fallback to single lines if needed
    const paragraphs = content.split(/\n{2,}/).filter(para => para.trim());
    return paragraphs.map((para, i) => (
      <p key={i} className="mb-4 text-sm text-gray-800 whitespace-pre-line">{para.trim()}</p>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold flex items-center">
              <span>Resume Analysis</span>
              <Badge variant="outline" className="ml-2 bg-blue-50">
                {overallCategory.text}
              </Badge>
            </CardTitle>
            <CardDescription>
              Comprehensive analysis of your optimized resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className={`text-lg font-bold ${overallCategory.color}`}>{overallScore}/100</span>
                </div>
                <Progress value={overallScore} className="h-3" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center">
                    <Star className="mr-1 h-4 w-4 text-yellow-500" />
                    Keyword Optimization
                  </span>
                  <span className={`text-sm font-medium ${getScoreCategory(keywordScore).color}`}>{keywordScore}/100</span>
                </div>
                <Progress value={keywordScore} className="h-2 bg-yellow-100" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center">
                    <Medal className="mr-1 h-4 w-4 text-blue-500" />
                    Content Structure
                  </span>
                  <span className={`text-sm font-medium ${getScoreCategory(structureScore).color}`}>{structureScore}/100</span>
                </div>
                <Progress value={structureScore} className="h-2 bg-blue-100" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center">
                    <Award className="mr-1 h-4 w-4 text-purple-500" />
                    ATS Readiness
                  </span>
                  <span className={`text-sm font-medium ${getScoreCategory(atsScore).color}`}>{atsScore}/100</span>
                </div>
                <Progress value={atsScore} className="h-2 bg-purple-100" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownload} className="w-full">
              <FileDown className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </CardFooter>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">
              Improvement Suggestions
            </CardTitle>
            <CardDescription>
              Actionable tips to enhance your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => setShowScoreDetails(!showScoreDetails)}
              className="w-full"
            >
              {showScoreDetails ? "Hide Details" : "Show Details"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {showScoreDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Keyword Analysis</h4>
                <p className="text-sm text-gray-600">
                  Your resume matches {Math.round(keywordScore / 10)} out of 10 key job requirements.
                  The more job-specific keywords your resume contains, the better it performs in ATS systems.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Structure Review</h4>
                <p className="text-sm text-gray-600">
                  Your resume's structure is {getScoreCategory(structureScore).text.toLowerCase()}.
                  Well-structured resumes have clear sections, appropriate headers,
                  and a logical flow that makes information easy to scan.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">ATS Optimization</h4>
                <p className="text-sm text-gray-600">
                  Your resume's ATS compatibility is {getScoreCategory(atsScore).text.toLowerCase()}.
                  This measures how well your resume would be parsed by Applicant Tracking Systems,
                  considering formatting, file type, and machine readability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Optimized Resume
        </label>
        <div className="bg-white p-4 rounded-md border border-gray-200 max-h-[500px] overflow-y-auto font-mono leading-relaxed shadow-inner">
          <div className="resume-display">
            {renderResumeWithSpacing(optimizedResume)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for scoring and analysis
function calculateKeywordScore(resume: string, jobDescription: string): number {
  if (!jobDescription) return 70; // Default score if no job description

  // Extract potential keywords from job description (simplified version)
  const jobWords = jobDescription.toLowerCase().split(/\W+/).filter(word =>
    word.length > 3 && !["and", "the", "that", "with", "for", "this"].includes(word)
  );

  // Count unique important words
  const uniqueJobWords = [...new Set(jobWords)];
  const resumeText = resume.toLowerCase();

  // Count matches
  let matches = 0;
  uniqueJobWords.forEach(word => {
    if (resumeText.includes(word)) {
      matches++;
    }
  });

  // Calculate score based on keyword matches
  const maxKeywords = Math.min(uniqueJobWords.length, 20); // Cap at 20 keywords
  const score = Math.round((matches / maxKeywords) * 100);

  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
}

function calculateStructureScore(resume: string): number {
  // Basic structure analysis (simplified)
  let score = 70; // Start with a baseline score

  // Check for section headers
  const sections = ["experience", "education", "skills", "summary", "objective", "projects"];

  let sectionCount = 0;
  sections.forEach(section => {
    if (resume.toLowerCase().includes(section)) {
      sectionCount++;
    }
  });

  // Adjust score based on sections (max +15)
  score += Math.min(15, sectionCount * 3);

  // Check for bullet points (max +10)
  const bulletPoints = (resume.match(/•|■|-|✓|\*/g) || []).length;
  score += Math.min(10, bulletPoints);

  // Check for conciseness (penalize if too long) (max -10)
  const wordCount = resume.split(/\s+/).length;
  if (wordCount > 700) {
    score -= Math.min(10, Math.floor((wordCount - 700) / 50));
  }

  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
}

function calculateATSScore(resume: string): number {
  // ATS friendliness analysis (simplified)
  let score = 75; // Start with a baseline score

  // Check for common ATS issues
  const issues = [];

  // Complex formatting (tables, columns) is hard to detect in text
  // But we can check for some indicators of good ATS practices

  // Check for contact info (max +10)
  const hasContactInfo = /email|phone|linkedin/i.test(resume);
  if (hasContactInfo) score += 10;

  // Check for proper date formatting (max +5)
  const hasProperDates = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s+\d{4}\b/i.test(resume);
  if (hasProperDates) score += 5;

  // Check for standard section headers (max +10)
  const standardHeaders = ["work experience", "education", "skills", "professional experience"];
  let headerCount = 0;
  standardHeaders.forEach(header => {
    if (resume.toLowerCase().includes(header)) {
      headerCount++;
    }
  });
  score += Math.min(10, headerCount * 3);

  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
}

function generateSuggestions(keywordScore: number, structureScore: number, atsScore: number, resume: string, jobDescription: string): string[] {
  const suggestions: string[] = [];

  // Keyword-based suggestions
  if (keywordScore < 70) {
    suggestions.push("Include more job-specific keywords from the job description to improve ATS matching.");

    // Extract missing keywords (simplified)
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

  // Structure-based suggestions
  if (structureScore < 70) {
    suggestions.push("Improve your resume structure with clear section headers (Summary, Experience, Education, Skills).");
    suggestions.push("Use bullet points to highlight achievements and responsibilities for better readability.");
  }

  // ATS-based suggestions
  if (atsScore < 70) {
    suggestions.push("Use a simple, ATS-friendly format without tables, columns, or unusual formatting.");
    suggestions.push("Include your contact information clearly at the top of your resume.");
  }

  // General improvements
  if (suggestions.length < 3) {
    suggestions.push("Quantify your achievements with specific numbers, percentages, or metrics.");
  }

  if (suggestions.length < 4) {
    suggestions.push("Keep your resume concise - aim for 1-2 pages maximum.");
  }

  return suggestions;
}

export default OptimizedResumeDisplay;
