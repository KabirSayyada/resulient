
import { ParsedProject } from "@/types/resumeStructure";

export function parseProjects(content: string[]): ParsedProject[] {
  const projects: ParsedProject[] = [];
  let currentProject: Partial<ParsedProject> | null = null;
  
  for (const line of content) {
    if (line.length > 3 && !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*')) {
      // This might be a project title
      if (currentProject && currentProject.name) {
        projects.push({
          name: currentProject.name,
          description: currentProject.description || '',
          technologies: currentProject.technologies || []
        });
      }
      
      currentProject = {
        name: line,
        description: '',
        technologies: []
      };
    } else if (currentProject && line.trim().length > 0) {
      // This is project description or details
      const cleanLine = line.replace(/^[•\-*]\s*/, '');
      if (!currentProject.description) {
        currentProject.description = cleanLine;
      } else {
        currentProject.description += ' ' + cleanLine;
      }
      
      // Look for technology mentions
      const techKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML', 'CSS', 'Java', 'C++'];
      const foundTech = techKeywords.filter(tech => 
        cleanLine.toLowerCase().includes(tech.toLowerCase())
      );
      if (foundTech.length > 0 && currentProject.technologies) {
        currentProject.technologies.push(...foundTech);
      }
    }
  }
  
  if (currentProject && currentProject.name) {
    projects.push({
      name: currentProject.name,
      description: currentProject.description || '',
      technologies: currentProject.technologies || []
    });
  }
  
  return projects;
}
