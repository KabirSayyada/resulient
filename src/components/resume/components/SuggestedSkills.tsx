
interface SuggestedSkillsProps {
  skills: string[];
}

export const SuggestedSkills = ({ skills }: SuggestedSkillsProps) => {
  return (
    <div className="mt-8 mb-6">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">Suggested Skills</h2>
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
