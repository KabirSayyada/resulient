import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
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
          title: "File Processed",
          description: "Your resume has been successfully extracted and is ready to optimize.",
        });
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadStatus("");
      setShowUploadSuccess(false);
      setInputMode("idle");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    }
  };

  // Handle textarea input -- for pasted resumes
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeContent(e.target.value);
    setInputMode("pasted");
    setShowUploadSuccess(false);
  };

  // If the user manually clears or changes content, reset upload state
  const handleTextareaFocus = () => {
    if (inputMode === "uploaded") {
      setInputMode("pasted");
      setShowUploadSuccess(false);
      setResumeContent(""); // clear the parsed text if user is trying to type/paste
    }
  };

  // Optionally, add a method to fully reset the upload state
  const resetUploadState = () => {
    setShowUploadSuccess(false);
    setInputMode("idle");
    setResumeContent("");
  };

  return (
    <div className="bg-gradient-to-tr from-yellow-50 via-fuchsia-50 to-indigo-50 border border-fuchsia-100 rounded-2xl shadow-lg p-6 transition-all group hover:shadow-xl">
      <label className="block text-sm font-semibold text-fuchsia-700 mb-2 group-hover:text-indigo-600 transition-all">
        Your Resume
      </label>
      {/* PASTED resume tip */}
      <div className="mb-3">
        <div className="text-xs text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded px-3 py-2 mb-0">
          <span className="font-semibold">Tip:</span> If you paste your resume, add extra blank lines (press Enter twice) between sections like <b>EDUCATION</b>, <b>EXPERIENCE</b>, etc. This helps group information for best analysis.
        </div>
      </div>
      <Textarea
        placeholder="Paste your current resume content here or upload a file..."
        className="min-h-[200px] font-mono text-sm bg-white/80 border border-indigo-100 rounded-lg shadow-inner focus:ring-2 focus:ring-fuchsia-300 focus:border-indigo-500 transition-all"
        value={inputMode === "uploaded" ? "" : resumeContent}
        onChange={handleTextareaChange}
        onFocus={handleTextareaFocus}
        readOnly={inputMode === "uploaded"}
      />

      <div className="mt-4 flex items-center gap-4 flex-wrap">
        <label className="flex items-center px-4 py-2 bg-gradient-to-br from-indigo-100 via-fuchsia-50 to-yellow-50 text-indigo-600 rounded-md shadow cursor-pointer hover:bg-fuchsia-100 border border-fuchsia-200">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M16 16v6H8v-6m8 0a4 4 0 10-8 0m8 0V8a4 4 0 10-8 0v8"></path></svg>
          <span>Upload Resume</span>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
          />
        </label>
        {uploadStatus && (
          <span className="ml-1 text-sm text-gray-600">{uploadStatus}</span>
        )}
        <div className="text-xs text-gray-500 ml-1">
          Supported formats: PDF, TXT
        </div>
        {/* Show a visual indicator if a resume was uploaded and parsed */}
        {showUploadSuccess && (
          <span className="inline-flex items-center px-3 py-1 ml-2 rounded-full bg-green-100 border border-green-300 text-green-800 text-xs font-semibold">
            <svg
              className="h-4 w-4 mr-1 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707a1 1 0 00-1.414-1.414L9 11.586 7.707 10.293A1 1 0 006.293 11.707l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Resume uploaded and parsed successfully!
            <button
              className="ml-2 text-xs text-indigo-500 underline"
              type="button"
              onClick={resetUploadState}
              tabIndex={-1}
            >
              Undo
            </button>
          </span>
        )}
      </div>
    </div>
  );
};
