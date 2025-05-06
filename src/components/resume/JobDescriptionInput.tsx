
import { Textarea } from "@/components/ui/textarea";

interface JobDescriptionInputProps {
  jobDescription: string;
  setJobDescription: (description: string) => void;
}

export const JobDescriptionInput = ({ jobDescription, setJobDescription }: JobDescriptionInputProps) => {
  return (
    <div className="section-card transition-all group hover:shadow-xl">
      <label className="block text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-2 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-all">
        Job Description
      </label>
      <Textarea
        placeholder="Paste the job description here..."
        className="min-h-[150px] font-mono text-sm bg-white/80 dark:bg-gray-800/80 border border-fuchsia-100 dark:border-fuchsia-900 rounded-lg shadow-inner focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-fuchsia-500 dark:focus:border-fuchsia-700 transition-all resize-y"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Include the entire job description for best optimization results!
      </p>
    </div>
  );
};
