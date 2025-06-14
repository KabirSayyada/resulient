
export function parseSkills(content: string[]): string[] {
  const skills: string[] = [];
  
  for (const line of content) {
    // Split by common delimiters
    const delimiters = /[,;|•\-*]/;
    const lineSkills = line.split(delimiters)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0 && skill.length < 50);
    
    skills.push(...lineSkills);
  }
  
  return [...new Set(skills)]; // Remove duplicates
}
