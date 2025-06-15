
import { Education } from "@/types/resumeStructure";
import { extractDates } from './dateExtractor';
import { DATE_PATTERNS } from './constants';

export function parseEducation(content: string[]): Education[] {
  const education: Education[] = [];
  
  for (const line of content) {
    if (line.length > 5) {
      const edu: Education = {
        institution: '',
        degree: '',
        graduationDate: ''
      };
      
      // Extract dates
      const dates = extractDates(line);
      if (dates.length > 0) {
        edu.graduationDate = dates[dates.length - 1];
      }
      
      // Remove dates for easier parsing
      let cleanLine = line;
      DATE_PATTERNS.forEach(pattern => {
        cleanLine = cleanLine.replace(pattern, '').trim();
      });
      
      // Look for degree indicators
      const degreePatterns = /\b(B\.?A\.?|B\.?S\.?|M\.?A\.?|M\.?S\.?|PhD|Ph\.D\.?|Bachelor|Master|Associate|Doctor|Diploma|Certificate)\b/i;
      const degreeMatch = cleanLine.match(degreePatterns);
      
      if (degreeMatch) {
        const separators = [' at ', ' from ', ' - ', ' – ', ' | ', ','];
        let parsed = false;
        
        for (const separator of separators) {
          if (cleanLine.includes(separator)) {
            const parts = cleanLine.split(separator).map(p => p.trim());
            if (parts.length >= 2) {
              edu.degree = parts[0];
              edu.institution = parts[1];
              parsed = true;
              break;
            }
          }
        }
        
        if (!parsed) {
          edu.degree = cleanLine;
          edu.institution = 'Institution';
        }
      } else {
        // Assume the whole line is institution if no degree pattern found
        edu.institution = cleanLine;
        edu.degree = 'Degree';
      }
      
      education.push(edu);
    }
  }
  
  return education;
}
