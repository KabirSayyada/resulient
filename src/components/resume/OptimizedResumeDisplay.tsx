import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, Star, Award, Medal, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QualificationWarnings } from "./components/QualificationWarnings";

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
  const { toast } = useToast();
  const [showScoreDetails, setShowScoreDetails] = useState(false);
  const reportRef = useRef<HTMLDivElement | null>(null);

  if (!optimizedResume) return null;

  const keywordScore = calculateKeywordScore(optimizedResume, jobDescription || "");
  const structureScore = calculateStructureScore(optimizedResume);
  const atsScore = calculateATSScore(optimizedResume);
  const overallScore = Math.round((keywordScore + structureScore + atsScore) / 3);

  const suggestions = generateSuggestions(keywordScore, structureScore, atsScore, optimizedResume, jobDescription || "");

  const handleDownload = () => {
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

    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-strength-report.txt";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report downloaded",
      description: "Your resume strength report has been downloaded successfully.",
    });
  };

  const handlePDFDownload = async () => {
    if (!reportRef.current) return;
    
    try {
      const report = reportRef.current;
      const canvas = await html2canvas(report, { 
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
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
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      
      let heightLeft = imgHeight;
      let position = 20;
      
      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`resume-optimization-report-${new Date().toISOString().split("T")[0]}.pdf`);
      
      toast({
        title: "PDF Report downloaded",
        description: "Your beautifully formatted resume report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error generating PDF",
        description: "There was an error creating your PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getScoreCategory = (score: number) => {
    if (score >= 90) return { text: "Excellent", color: "text-green-600" };
    if (score >= 75) return { text: "Good", color: "text-blue-600" };
    if (score >= 60) return { text: "Average", color: "text-yellow-600" };
    return { text: "Needs Improvement", color: "text-red-600" };
  };

  const overallCategory = getScoreCategory(overallScore);

  return (
    <div className="space-y-6">
      <div ref={reportRef} className="bg-white p-6 rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">Resume Optimization Report</h1>
          <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
          <div className="mt-4 inline-block bg-indigo-50 px-4 py-2 rounded-full text-indigo-700 font-semibold">
            Overall Score: {overallScore}/100 • {overallCategory.text}
          </div>
        </div>
        
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
          </Card>
        </div>

        {qualificationGaps && qualificationGaps.length > 0 && (
          <QualificationWarnings qualificationGaps={qualificationGaps} />
        )}

        {showScoreDetails && (
          <Card className="mt-6">
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

        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Optimized Resume
          </label>
          <div className="bg-white p-4 rounded-md border border-gray-200 max-h-[500px] overflow-y-auto font-mono leading-relaxed shadow-inner">
            <pre className="text-sm text-gray-800 whitespace-pre-line">{optimizedResume}</pre>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          onClick={() => setShowScoreDetails(!showScoreDetails)}
        >
          {showScoreDetails ? "Hide Details" : "Show Details"}
        </Button>
        
        <Button onClick={handleDownload}>
          <FileDown className="mr-2 h-4 w-4" /> Text Report
        </Button>
        
        <Button 
          onClick={handlePDFDownload}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <FileText className="mr-2 h-4 w-4" /> PDF Report
        </Button>
      </div>
    </div>
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

  if (keywordScore < 70) {
    suggestions.push("Include more job-specific keywords from the job description to improve ATS matching.");

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
    suggestions.push("Improve your resume structure with clear section headers (Summary, Experience, Education, Skills).");
    suggestions.push("Use bullet points to highlight achievements and responsibilities for better readability.");
  }

  if (atsScore < 70) {
    suggestions.push("Use a simple, ATS-friendly format without tables, columns, or unusual formatting.");
    suggestions.push("Include your contact information clearly at the top of your resume.");
  }

  if (suggestions.length < 3) {
    suggestions.push("Quantify your achievements with specific numbers, percentages, or metrics.");
  }

  if (suggestions.length < 4) {
    suggestions.push("Keep your resume concise - aim for 1-2 pages maximum.");
  }

  suggestions.push("Use standard section headings that ATS systems recognize (e.g., 'Work Experience' instead of 'Career Journey').");
  suggestions.push("Avoid using headers, footers, or text boxes as ATS systems often can't parse them properly.");
  suggestions.push("Consider including a 'Skills' section with relevant technical and soft skills prominently displayed.");

  return suggestions;
}

export default OptimizedResumeDisplay;
