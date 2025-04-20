
import { Textarea } from "@/components/ui/textarea";

interface JobDescriptionInputProps {
  jobDescription: string;
  setJobDescription: (description: string) => void;
}

export const JobDescriptionInput = ({ jobDescription, setJobDescription }: JobDescriptionInputProps) => {
  return (
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
  );
};
