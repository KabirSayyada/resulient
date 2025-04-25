import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Upload } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { LegalFooter } from "@/components/LegalFooter";

const ResumeScoring = () => {
  const [resumeText, setResumeText] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setResumeText(reader.result as string);
    };

    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async () => {
    if (!resumeText) {
      toast({
        title: "Please enter or upload your resume.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/resume/score`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resume: resumeText, userId: user?.id }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (error: any) {
      toast({
        title: "Error scoring resume",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    toast({
      title: "Copied!",
      description: "Results copied to clipboard",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume_analysis.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto p-4 flex-grow">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Resume Scoring
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-md p-4 mb-4 cursor-pointer bg-white"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-center text-gray-600">
                  Drop the files here ...
                </p>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-6 w-6 inline-block mb-2" />
                  <p className="text-gray-600">
                    Drag 'n' drop some files here, or click to select files
                  </p>
                </div>
              )}
            </div>
            <Textarea
              placeholder="Paste your resume text here..."
              className="flex-grow bg-white"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
            <Button
              className="mt-4 w-full md:w-auto"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Scoring..." : "Score Resume"}
            </Button>
          </div>

          <div>
            {loading && (
              <div className="space-y-4">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-40" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-24" />
              </div>
            )}

            {results && (
              <div className="bg-white rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Analysis Results</h2>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={handleCopy}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy JSON
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download JSON
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <Badge variant="secondary">
                    Overall Score: {results.overall_score}
                  </Badge>
                </div>

                <Accordion type="single" collapsible>
                  {Object.entries(results)
                    .filter(([key]) => key !== "resume")
                    .map(([key, value]: [string, any]) => (
                      <AccordionItem key={key} value={key}>
                        <AccordionTrigger>
                          {key.replace(/_/g, " ")}
                        </AccordionTrigger>
                        <AccordionContent>
                          {typeof value === "string" ? (
                            <p>{value}</p>
                          ) : (
                            <pre className="text-sm">
                              {JSON.stringify(value, null, 2)}
                            </pre>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-auto pb-6">
        <LegalFooter />
      </div>
    </div>
  );
};

export default ResumeScoring;
