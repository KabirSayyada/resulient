import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Set the PDF.js worker source to match the pdfjs-dist version we're using
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface FileUploadSectionProps {
  resumeContent: string;
  setResumeContent: (content: string) => void;
}

export const FileUploadSection = ({ resumeContent, setResumeContent }: FileUploadSectionProps) => {
  const [uploadStatus, setUploadStatus] = useState("");
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [inputMode, setInputMode] = useState<"pasted" | "uploaded" | "idle">("idle");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPdf = async (file: File) => {
    try {
      setUploadStatus("Extracting text from PDF...");
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        let lastY = null;
        let lastX = null;
        let currentLine = "";
        let pageLines: string[] = [];
        let isBulletPoint = false;
        
        textContent.items.forEach(item => {
          if ('str' in item && item.str.trim()) {
            const currentX = (item as any).transform[4];
            const currentY = (item as any).transform[5];
            if (item.str.trim().match(/^[•\-–—*]/) || 
                (lastX !== null && currentX > lastX + 10 && currentLine.trim().length < 3)) {
              if (currentLine.trim()) {
                pageLines.push(currentLine.trim());
              }
              isBulletPoint = true;
              currentLine = "• " + item.str.trim().replace(/^[•\-–—*]\s*/, '') + " ";
            } 
            else if (lastY !== null && Math.abs(currentY - lastY) > 5) {
              if (currentLine.trim()) {
                pageLines.push(currentLine.trim());
                if (Math.abs(currentY - lastY) > 12) {
                  pageLines.push("");
                }
              }
              currentLine = item.str + " ";
              isBulletPoint = false;
            } 
            else {
              currentLine += item.str + " ";
            }
            lastY = currentY;
            lastX = currentX;
          }
        });
        if (currentLine.trim()) {
          pageLines.push(currentLine.trim());
        }
        const pageText = pageLines.join("\n");
        fullText += pageText + "\n\n";
      }
      fullText = improveTextFormatting(fullText);
      return fullText;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw new Error("Could not extract text from PDF");
    }
  };

  const improveTextFormatting = (text: string): string => {
    const lines = text.split('\n');
    let formattedText = "";
    let previousLineWasBullet = false;
    const sectionHeaders = [
      /^(EDUCATION|EXPERIENCE|SKILLS|SUMMARY|OBJECTIVE|PROJECTS|CERTIFICATIONS|AWARDS|PUBLICATIONS|REFERENCES|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT|QUALIFICATIONS|VOLUNTEER|LEADERSHIP|ACTIVITIES|INTERESTS)(?:\s|:|$)/i
    ];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        if (formattedText && !formattedText.endsWith("\n\n")) {
          formattedText += "\n";
        }
        continue;
      }
      const isHeader = sectionHeaders.some(regex => regex.test(line));
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
      if (isHeader) {
        if (formattedText && !formattedText.endsWith("\n\n\n")) {
          formattedText += "\n\n";
        }
        formattedText += line.toUpperCase() + "\n";
        previousLineWasBullet = false;
      } else if (isBullet) {
        if (!previousLineWasBullet && formattedText && !formattedText.endsWith("\n")) {
          formattedText += "\n";
        }
        formattedText += line + "\n";
        previousLineWasBullet = true;
      } else {
        if (previousLineWasBullet) {
          formattedText += "\n";
        }
        formattedText += line + "\n";
        previousLineWasBullet = false;
      }
    }
    formattedText = formattedText
      .replace(/\n{4,}/g, "\n\n\n")
      .replace(/(\w+):([\w@])/g, "$1: $2");
    return formattedText;
  };

  const extractTextFromTxt = async (file: File) => {
    try {
      const text = await file.text();
      return improveTextFormatting(text);
    } catch (error) {
      console.error("Error extracting text from TXT:", error);
      throw new Error("Could not read text file");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploadStatus("Processing file...");
      let text = "";
      if (file.type === "application/pdf") {
        text = await extractTextFromPdf(file);
      } else if (file.type === "text/plain") {
        text = await extractTextFromTxt(file);
      } else {
        throw new Error("File format not supported. Please upload a PDF or TXT file.");
      }
      if (text) {
        setResumeContent(text);
        setInputMode("uploaded");
        setShowUploadSuccess(true);
        setUploadStatus("");
        toast({
          title: "File Processed Successfully",
          description: "Your resume has been extracted and is ready for optimization.",
        });
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadStatus("");
      setShowUploadSuccess(false);
      setInputMode("idle");
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeContent(e.target.value);
    setInputMode("pasted");
    setShowUploadSuccess(false);
  };

  const handleTextareaFocus = () => {
    if (inputMode === "uploaded") {
      setInputMode("pasted");
      setShowUploadSuccess(false);
      setResumeContent("");
    }
  };

  const resetUploadState = () => {
    setShowUploadSuccess(false);
    setInputMode("idle");
    setResumeContent("");
  };

  const wordCount = resumeContent.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-300">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <FileText className="h-5 w-5" />
          </div>
          Your Current Resume
        </CardTitle>
        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
          Upload your resume file or paste the content below
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Button Section */}
        <div className="border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg p-6 bg-white/50 dark:bg-gray-800/50 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                Upload Resume File
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                Drag and drop or click to browse
              </p>
            </div>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleButtonClick}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.txt"
              onChange={handleFileUpload}
            />
            <p className="text-xs text-green-500 dark:text-green-400">
              Supports PDF and TXT files
            </p>
          </div>
        </div>

        {/* Upload Status */}
        {uploadStatus && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
            <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
            {uploadStatus}
          </div>
        )}

        {/* Success Message */}
        {showUploadSuccess && (
          <div className="flex items-center justify-between bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Resume uploaded successfully!
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetUploadState}
              className="text-green-600 hover:text-green-800 dark:text-green-400"
            >
              Clear
            </Button>
          </div>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-green-200 dark:border-green-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-green-50 dark:bg-green-950 px-3 text-green-600 dark:text-green-400">
              or paste text below
            </span>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <Textarea
            placeholder="Paste your resume content here...

Include all sections:
• Contact information
• Professional summary
• Work experience  
• Education
• Skills
• Any additional relevant sections"
            className="min-h-[200px] text-sm bg-white/80 dark:bg-gray-800/80 border-2 border-green-200 dark:border-green-700 rounded-lg shadow-inner focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 focus:border-green-500 dark:focus:border-green-400 transition-all resize-none"
            value={inputMode === "uploaded" ? "" : resumeContent}
            onChange={handleTextareaChange}
            onFocus={handleTextareaFocus}
            readOnly={inputMode === "uploaded"}
          />
          {wordCount > 0 && (
            <div className="absolute bottom-3 right-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-md">
              {wordCount} words
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-700 dark:text-green-300">
              <span className="font-semibold">Formatting Tip:</span> Add extra blank lines between sections (EDUCATION, EXPERIENCE, etc.) for better analysis. Our AI works best with clearly separated sections.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
