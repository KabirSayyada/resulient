
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Upload } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Set the PDF.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

const Index = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeContent, setResumeContent] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!jobDescription.trim() || !resumeContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both job description and resume content.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("optimize-resume", {
        body: {
          jobDescription,
          resumeContent,
        }
      });

      if (error) {
        throw new Error(error.message || "Failed to optimize resume");
      }

      setOptimizedResume(data.optimizedResume);
      toast({
        title: "Success!",
        description: "Your resume has been optimized for ATS.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractTextFromPdf = async (file) => {
    try {
      setUploadStatus("Extracting text from PDF...");
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + "\n";
      }
      
      return fullText;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw new Error("Could not extract text from PDF");
    }
  };

  const extractTextFromTxt = async (file) => {
    try {
      const text = await file.text();
      return text;
    } catch (error) {
      console.error("Error extracting text from TXT:", error);
      throw new Error("Could not read text file");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadStatus("Processing file...");
      let text = "";
      
      if (file.type === "application/pdf") {
        text = await extractTextFromPdf(file);
      } else if (file.type === "text/plain") {
        text = await extractTextFromTxt(file);
      } else {
        // For other formats, we'll just show a message that they're not supported
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
        description: error.message || "Failed to process file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ATS Resume Optimizer
          </h1>
          <p className="text-gray-600">
            Optimize your resume to beat Applicant Tracking Systems (ATS)
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <Textarea
              placeholder="Paste the job description here..."
              className="min-h-[150px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

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

          <div className="text-center">
            <Button
              onClick={handleOptimize}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Optimizing..." : "Optimize Resume"}
            </Button>
          </div>

          {optimizedResume && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optimized Resume
              </label>
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">
                  {optimizedResume}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
