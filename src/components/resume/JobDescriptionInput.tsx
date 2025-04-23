
import { Textarea } from "@/components/ui/textarea";

interface JobDescriptionInputProps {
  jobDescription: string;
  setJobDescription: (description: string) => void;
}

export const JobDescriptionInput = ({ jobDescription, setJobDescription }: JobDescriptionInputProps) => {
  return (
    <div className="bg-gradient-to-tr from-yellow-50 via-indigo-50 to-fuchsia-50 border border-indigo-100 rounded-2xl shadow-lg p-6 transition-all group hover:shadow-xl">
      <label className="block text-sm font-semibold text-indigo-700 mb-2 group-hover:text-fuchsia-600 transition-all">
        Job Description
      </label>
      <Textarea
        placeholder="Paste the job description here..."
        className="min-h-[150px] font-mono text-sm bg-white/80 border border-fuchsia-100 rounded-lg shadow-inner focus:ring-2 focus:ring-indigo-300 focus:border-fuchsia-500 transition-all"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <p className="text-xs text-gray-500 mt-2">
        Include the entire job description for best optimization results!
      </p>
    </div>
  );
};
