
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
        const pageText = textContent.items
          .map(item => ('str' in item ? item.str : ''))
          .join(" ");
        fullText += pageText + "\n";
      }
      
      return fullText;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw new Error("Could not extract text from PDF");
    }
  };

  const extractTextFromTxt = async (file: File) => {
    try {
      const text = await file.text();
      return text;
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
        className="min-h-[200px]"
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
