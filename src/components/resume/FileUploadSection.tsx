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
        
        // Advanced text extraction with improved spacing and format detection
        let lastY = null;
        let lastX = null;
        let currentLine = "";
        let pageLines: string[] = [];
        let isBulletPoint = false;
        
        // First pass - gather text by position
        textContent.items.forEach(item => {
          if ('str' in item && item.str.trim()) {
            const currentX = (item as any).transform[4];
            const currentY = (item as any).transform[5];
            
            // Check for bullet point indicators
            if (item.str.trim().match(/^[•\-–—*]/) || 
                (lastX !== null && currentX > lastX + 10 && currentLine.trim().length < 3)) {
              if (currentLine.trim()) {
                pageLines.push(currentLine.trim());
              }
              isBulletPoint = true;
              currentLine = "• " + item.str.trim().replace(/^[•\-–—*]\s*/, '') + " ";
            } 
            // Significant Y position change indicates a new paragraph or section
            else if (lastY !== null && Math.abs(currentY - lastY) > 5) {
              if (currentLine.trim()) {
                pageLines.push(currentLine.trim());
                
                // Add extra blank line for significant spacing (likely a section break)
                if (Math.abs(currentY - lastY) > 12) {
                  pageLines.push("");
                }
              }
              
              currentLine = item.str + " ";
              isBulletPoint = false;
            } 
            // Continuing the same line
            else {
              currentLine += item.str + " ";
            }
            
            lastY = currentY;
            lastX = currentX;
          }
        });
        
        // Add the last line if not empty
        if (currentLine.trim()) {
          pageLines.push(currentLine.trim());
        }
        
        // Join the lines for this page with proper formatting
        const pageText = pageLines.join("\n");
        
        // Add double line breaks between pages for better section separation
        fullText += pageText + "\n\n";
      }
      
      // Post-process to detect and format sections
      fullText = improveTextFormatting(fullText);
      return fullText;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw new Error("Could not extract text from PDF");
    }
  };

  const improveTextFormatting = (text: string): string => {
    // 1. Split into lines
    const lines = text.split('\n');
    let formattedText = "";
    let inSection = false;
    let previousLineWasBullet = false;
    
    // Common section header indicators with stronger matching
    const sectionHeaders = [
      /^(EDUCATION|EXPERIENCE|SKILLS|SUMMARY|OBJECTIVE|PROJECTS|CERTIFICATIONS|AWARDS|PUBLICATIONS|REFERENCES|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT|QUALIFICATIONS|VOLUNTEER|LEADERSHIP|ACTIVITIES|INTERESTS)(?:\s|:|$)/i
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines but maintain some spacing between sections
      if (!line) {
        if (formattedText && !formattedText.endsWith("\n\n")) {
          formattedText += "\n";
        }
        continue;
      }
      
      // Check if this is a section header
      const isHeader = sectionHeaders.some(regex => regex.test(line));
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
      
      if (isHeader) {
        // Add extra spacing before new sections
        if (formattedText && !formattedText.endsWith("\n\n\n")) {
          formattedText += "\n\n";
        }
        
        // Format the header (uppercase for visibility)
        formattedText += line.toUpperCase() + "\n";
        inSection = true;
        previousLineWasBullet = false;
      } else if (isBullet) {
        // For bullet points, preserve the bullet formatting
        if (!previousLineWasBullet && formattedText && !formattedText.endsWith("\n")) {
          formattedText += "\n";
        }
        formattedText += line + "\n";
        previousLineWasBullet = true;
      } else {
        // Regular text - don't add bullets to normal text
        if (previousLineWasBullet) {
          formattedText += "\n";  // Add extra spacing after bullet lists
        }
        formattedText += line + "\n";
        previousLineWasBullet = false;
      }
    }
    
    // Final cleanup
    formattedText = formattedText
      // Remove excessive newlines (more than 3)
      .replace(/\n{4,}/g, "\n\n\n")
      // Ensure proper spacing after colons in fields like "Email: example@email.com"
      .replace(/(\w+):([\w@])/g, "$1: $2")
      // Keep original bullet formatting without making everything a bullet
      .replace(/^[\s•\-–—*]+([^•\-–—*])/gm, "• $1");
      
    return formattedText;
  };

  const extractTextFromTxt = async (file: File) => {
    try {
      const text = await file.text();
      // Apply the same formatting improvements to text files
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
        setUploadStatus("");
        toast({
          title: "File Processed",
          description: "Your resume has been successfully extracted and is ready to optimize.",
        });
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadStatus("");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Your Resume
      </label>
      <Textarea
        placeholder="Paste your current resume content here or upload a file..."
        className="min-h-[200px] font-mono text-sm"
        value={resumeContent}
        onChange={(e) => setResumeContent(e.target.value)}
      />
      
      <div className="mt-4 flex items-center">
        <label className="flex items-center px-4 py-2 bg-white text-blue-500 rounded-md shadow cursor-pointer hover:bg-gray-50 border border-gray-200">
          <Upload className="mr-2 h-4 w-4" />
          <span>Upload Resume</span>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
          />
        </label>
        
        {uploadStatus && (
          <span className="ml-4 text-sm text-gray-600">{uploadStatus}</span>
        )}
        
        <div className="ml-4 text-xs text-gray-500">
          Supported formats: PDF, TXT
        </div>
      </div>
    </div>
  );
};
