
interface SuggestedSkillsProps {
  skills: string[];
}

export const SuggestedSkills = ({ skills }: SuggestedSkillsProps) => {
  if (!skills || skills.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4 mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Suggested Skills</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((skill, index) => (
          <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};
