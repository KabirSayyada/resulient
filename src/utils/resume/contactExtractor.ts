
import { ParsedContact } from "@/types/resumeStructure";
import { EMAIL_REGEX, PHONE_REGEX, LINKEDIN_REGEX } from './constants';

export function couldBeName(line: string): boolean {
  // Check if line could be a person's name
  return (
    line.length > 2 && 
    line.length < 80 && 
    !EMAIL_REGEX.test(line) && 
    !PHONE_REGEX.test(line) && 
    !LINKEDIN_REGEX.test(line) &&
    !line.includes('http') &&
    !line.includes('@') &&
    !line.match(/^\d/) && 
    !line.includes('|') &&
    !line.includes('Street') &&
    !line.includes('Ave') &&
    !line.includes('Rd') &&
    !line.includes('Drive') &&
    line.split(' ').length >= 1 &&
    line.split(' ').length <= 4 &&
    !line.match(/^[A-Z\s]+$/) // Not all caps unless very short
  );
}

export function isContactInfo(line: string): boolean {
  return EMAIL_REGEX.test(line) || PHONE_REGEX.test(line) || LINKEDIN_REGEX.test(line);
}

export function extractContactInfo(lines: string[]): ParsedContact {
  const contact: ParsedContact = {};
  let potentialNames: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Extract email
    const emailMatch = line.match(EMAIL_REGEX);
    if (emailMatch && !contact.email) {
      contact.email = emailMatch[0];
      // If this line only contains email, continue to next line
      if (line.trim() === emailMatch[0]) continue;
    }
    
    // Extract phone
    const phoneMatch = line.match(PHONE_REGEX);
    if (phoneMatch && !contact.phone && line.length < 50) {
      contact.phone = phoneMatch[0];
      // If this line only contains phone, continue to next line
      if (line.trim().replace(/[^\d]/g, '') === phoneMatch[0].replace(/[^\d]/g, '')) continue;
    }
    
    // Extract LinkedIn
    const linkedinMatch = line.match(LINKEDIN_REGEX);
    if (linkedinMatch && !contact.linkedin) {
      contact.linkedin = linkedinMatch[0];
      // If this line only contains linkedin, continue to next line
      if (line.includes('linkedin')) continue;
    }
    
    // Extract address (lines with state abbreviations, zip codes, or common address words)
    if (!contact.address && (
      /\b[A-Z]{2}\s+\d{5}/.test(line) || 
      /\d{5}/.test(line) ||
      /\b(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)\b/i.test(line)
    )) {
      contact.address = line;
      continue;
    }
    
    // Collect potential names (lines that aren't contact info)
    if (couldBeName(line) && !isContactInfo(line)) {
      potentialNames.push(line);
    }
    
    // If we have multiple contact pieces and this line has mixed contact info
    if ((emailMatch || phoneMatch || linkedinMatch) && line.length > 20) {
      // Try to extract non-contact parts as potential name
      let cleanLine = line;
      if (emailMatch) cleanLine = cleanLine.replace(emailMatch[0], '').trim();
      if (phoneMatch) cleanLine = cleanLine.replace(phoneMatch[0], '').trim();
      if (linkedinMatch) cleanLine = cleanLine.replace(linkedinMatch[0], '').trim();
      cleanLine = cleanLine.replace(/[|•\-–]/g, ' ').replace(/\s+/g, ' ').trim();
      
      if (cleanLine && couldBeName(cleanLine)) {
        potentialNames.push(cleanLine);
      }
    }
  }
  
  // Select the best name candidate (usually the first one that looks like a name)
  if (!contact.name && potentialNames.length > 0) {
    // Prefer shorter names that appear early
    contact.name = potentialNames
      .filter(name => name.length < 50)
      .sort((a, b) => a.length - b.length)[0];
  }
  
  return contact;
}
