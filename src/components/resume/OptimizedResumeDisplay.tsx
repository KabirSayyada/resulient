import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QualificationGap, ScoreData } from "@/types/resume";
import { QualificationWarnings } from "./components/QualificationWarnings";
import { ImprovementSuggestions } from "./components/ImprovementSuggestions";
import { SuggestedSkills } from "./components/SuggestedSkills";
import { useLocation } from "react-router-dom";
import { ScoreBreakdown } from "./ScoreBreakdown";
import ResumeScoreCard from "./ResumeScoreCard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileText, Star, CheckCircle, TrendingUp } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const location = useLocation();
  const isAtsOptimizerPage = location.pathname === "/";
  const optimizationReportRef = useRef<HTMLDivElement>(null);

  const handleOptimizationReportDownload = async () => {
    if (!optimizationReportRef.current) return;
    
    const report = optimizationReportRef.current;
    const canvas = await html2canvas(report, { 
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
      windowWidth: 1200,
      windowHeight: report.scrollHeight
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 20;
    let page = 1;
    
    pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      page++;
    }
    
    pdf.save(`resume-optimization-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  function calculateKeywordScore(resume: string | any, jobDescription: string): number {
    if (typeof resume !== 'string') {
      console.warn('Resume is not a string in calculateKeywordScore', resume);
      return 70;
    }
    
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
  
  function calculateStructureScore(resume: string | any): number {
    if (typeof resume !== 'string') {
      console.warn('Resume is not a string in calculateStructureScore', resume);
      return 70;
    }
    
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
  
  function calculateATSScore(resume: string | any): number {
    if (typeof resume !== 'string') {
      console.warn('Resume is not a string in calculateATSScore', resume);
      return 75;
    }
    
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
  
  function generateSuggestions(keywordScore: number, structureScore: number, atsScore: number, resume: string | any, jobDescription: string): string[] {
    if (typeof resume !== 'string') {
      console.warn('Resume is not a string in generateSuggestions', resume);
      resume = "";
    }
    
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
  
    if (structureScore < 70) {
      suggestions.push(allSuggestions.structure[Math.floor(Math.random() * allSuggestions.structure.length)]);
      suggestions.push(allSuggestions.structure[Math.floor(Math.random() * allSuggestions.structure.length)]);
    }
  
    if (atsScore < 70) {
      suggestions.push(allSuggestions.ats[Math.floor(Math.random() * allSuggestions.ats.length)]);
    }
  
    const categories = ['achievements', 'formatting'];
    categories.forEach(category => {
      const randomSuggestion = allSuggestions[category][Math.floor(Math.random() * allSuggestions[category].length)];
      if (!suggestions.includes(randomSuggestion)) {
        suggestions.push(randomSuggestion);
      }
    });
  
    while (suggestions.length < 5) {
      const randomCategory = Object.keys(allSuggestions)[Math.floor(Math.random() * Object.keys(allSuggestions).length)];
      const randomSuggestion = allSuggestions[randomCategory][Math.floor(Math.random() * allSuggestions[randomCategory].length)];
      if (!suggestions.includes(randomSuggestion)) {
        suggestions.push(randomSuggestion);
      }
    }
  
    return suggestions.sort(() => Math.random() - 0.5).slice(0, 8);
  }

  if (!optimizedResume) return null;

  const keywordScore = calculateKeywordScore(optimizedResume, jobDescription || "");
  const structureScore = calculateStructureScore(optimizedResume);
  const atsScore = calculateATSScore(optimizedResume);
  const overallScore = Math.round((keywordScore + structureScore + atsScore) / 3);

  const suggestions = generateSuggestions(keywordScore, structureScore, atsScore, optimizedResume, jobDescription || "");

  if (isAtsOptimizerPage) {
    return (
      <Card className="border-t-8 border-t-indigo-600 shadow-xl bg-gradient-to-bl from-white via-indigo-50 to-blue-100 relative mt-10 animate-fade-in">
        <CardContent className="p-6">
          <div className="space-y-6" ref={optimizationReportRef}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-indigo-800 mb-2">Resume Optimization Report</h1>
              <p className="text-gray-600 mb-3">
                Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
              <div className="inline-block bg-indigo-50 px-4 py-2 rounded-full text-indigo-700 font-semibold">
                Overall Score: {overallScore}/100
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-bold text-indigo-800 mb-4">Analysis</h2>
                <div className="grid grid-cols-1 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-blue-600 mr-2" />
                          <h3 className="font-semibold text-blue-900">Overall Score</h3>
                        </div>
                        <span className="text-xl font-bold text-blue-700">
                          {overallScore}%
                        </span>
                      </div>
                      <Progress value={overallScore} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-purple-600 mr-2" />
                          <h3 className="font-semibold text-purple-900">ATS Readiness</h3>
                        </div>
                        <span className="text-xl font-bold text-purple-700">
                          {atsScore}%
                        </span>
                      </div>
                      <Progress value={atsScore} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <h3 className="font-semibold text-green-900">Keyword Optimization</h3>
                        </div>
                        <span className="text-xl font-bold text-green-700">
                          {keywordScore}%
                        </span>
                      </div>
                      <Progress value={keywordScore} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <TrendingUp className="h-5 w-5 text-amber-600 mr-2" />
                          <h3 className="font-semibold text-amber-900">Content Structure</h3>
                        </div>
                        <span className="text-xl font-bold text-amber-700">
                          {structureScore}%
                        </span>
                      </div>
                      <Progress value={structureScore} className="h-2" />
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-bold text-indigo-800 mb-4">Improvement Suggestions</h2>
                <ImprovementSuggestions suggestions={suggestions} />
              </div>
            </div>

            {qualificationGaps && qualificationGaps.length > 0 && (
              <div className="mt-6">
                <QualificationWarnings qualificationGaps={qualificationGaps} />
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-inner mt-6">
              <h2 className="text-xl font-bold text-indigo-700 mb-6">Optimized Resume</h2>
              <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md border border-gray-200">
                {optimizedResume}
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button 
                size="lg"
                onClick={handleOptimizationReportDownload}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105 flex items-center gap-3"
              >
                <FileText className="h-5 w-5" />
                Download Full Report (PDF)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-t-8 border-t-indigo-600 shadow-xl bg-gradient-to-bl from-white via-indigo-50 to-blue-100 relative mt-10 animate-fade-in">
      <CardContent>
        <div className="text-center">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">Resume Score</h2>
          <div className="font-bold text-2xl">{overallScore}/100</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedResumeDisplay;
