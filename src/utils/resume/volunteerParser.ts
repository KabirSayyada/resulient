
import { ParsedWorkExperience } from "@/types/resumeStructure";
import { extractDates } from './dateExtractor';
import { DATE_PATTERNS } from './constants';

export function parseVolunteerExperience(content: string[]): ParsedWorkExperience[] {
  const experiences: ParsedWorkExperience[] = [];
  let currentExperience: Partial<ParsedWorkExperience> | null = null;
  
  for (const line of content) {
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      // This is a bullet point responsibility
      if (currentExperience) {
        if (!currentExperience.responsibilities) {
          currentExperience.responsibilities = [];
        }
        currentExperience.responsibilities.push(line.replace(/^[•\-*]\s*/, ''));
      }
    } else if (isVolunteerTitleLine(line)) {
      // Save previous experience
      if (currentExperience && (currentExperience.position || currentExperience.company)) {
        experiences.push(fillVolunteerDefaults(currentExperience));
      }
      
      currentExperience = parseVolunteerTitleLine(line);
    } else if (currentExperience && line.trim().length > 10 && !line.match(/^\d{4}/)) {
      // This might be a responsibility without bullet or additional organization info
      if (!currentExperience.company && line.length < 100) {
        currentExperience.company = line;
      } else {
        if (!currentExperience.responsibilities) {
          currentExperience.responsibilities = [];
        }
        currentExperience.responsibilities.push(line);
      }
    }
  }
  
  // Add the last experience
  if (currentExperience && (currentExperience.position || currentExperience.company)) {
    experiences.push(fillVolunteerDefaults(currentExperience));
  }
  
  return experiences;
}

function fillVolunteerDefaults(exp: Partial<ParsedWorkExperience>): ParsedWorkExperience {
  return {
    position: exp.position || 'Volunteer',
    company: exp.company || 'Organization',
    startDate: exp.startDate || '',
    endDate: exp.endDate || '',
    responsibilities: exp.responsibilities || []
  };
}

function isVolunteerTitleLine(line: string): boolean {
  return (
    line.length > 5 && 
    line.length < 200 &&
    !line.startsWith('•') &&
    !line.startsWith('-') &&
    !line.startsWith('*') &&
    (line.includes(' at ') || line.includes(' | ') || line.includes(' - ') || 
     line.includes(' – ') || /\d{4}/.test(line) || line.includes(','))
  );
}

function parseVolunteerTitleLine(line: string): Partial<ParsedWorkExperience> {
  const experience: Partial<ParsedWorkExperience> = {
    responsibilities: []
  };
  
  // Extract dates first
  const dates = extractDates(line);
  if (dates.length >= 1) {
    experience.startDate = dates[0];
    if (dates.length >= 2) {
      experience.endDate = dates[1];
    }
  }
  
  // Remove dates from line for easier parsing
  let cleanLine = line;
  DATE_PATTERNS.forEach(pattern => {
    cleanLine = cleanLine.replace(pattern, '').trim();
  });
  
  // Clean up extra separators
  cleanLine = cleanLine.replace(/\s*[|–-]\s*$/, '').replace(/^\s*[|–-]\s*/, '').trim();
  
  // Try different separation patterns
  const separators = [' at ', ' | ', ' – ', ' - ', ' — ', ','];
  
  for (const separator of separators) {
    if (cleanLine.includes(separator)) {
      const parts = cleanLine.split(separator).map(p => p.trim()).filter(p => p.length > 0);
      if (parts.length >= 2) {
        experience.position = parts[0];
        experience.company = parts[1];
        break;
      }
    }
  }
  
  // If no separator found, try to guess based on line structure
  if (!experience.position && !experience.company) {
    const words = cleanLine.split(/\s+/);
    if (words.length >= 2) {
      // Look for common volunteer position words
      const positionWords = ['volunteer', 'coordinator', 'assistant', 'helper', 'organizer', 'leader', 'mentor', 'tutor'];
      const positionIndex = words.findIndex(word => 
        positionWords.some(posWord => word.toLowerCase().includes(posWord))
      );
      
      if (positionIndex >= 0) {
        experience.position = words.slice(0, positionIndex + 1).join(' ');
        experience.company = words.slice(positionIndex + 1).join(' ');
      } else {
        // Default split
        const midPoint = Math.ceil(words.length / 2);
        experience.position = words.slice(0, midPoint).join(' ');
        experience.company = words.slice(midPoint).join(' ');
      }
    } else {
      experience.position = cleanLine;
      experience.company = 'Organization';
    }
  }
  
  return experience;
}
