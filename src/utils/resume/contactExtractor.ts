
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
    !line.match(/^[A-Z\s]{10,}$/) // Not a long all-caps header
  );
}

export function isContactInfo(line: string): boolean {
  return EMAIL_REGEX.test(line) || PHONE_REGEX.test(line) || LINKEDIN_REGEX.test(line);
}

export function extractContactInfo(lines: string[]): ParsedContact {
  const contact: ParsedContact = {};
  let potentialNames: string[] = [];
  
  console.log('Extracting contact info from lines:', lines);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    console.log(`Processing line ${i}: "${line}"`);
    
    // Extract email
    const emailMatch = line.match(EMAIL_REGEX);
    if (emailMatch && !contact.email) {
      contact.email = emailMatch[0];
      console.log('Found email:', emailMatch[0]);
    }
    
    // Extract phone
    const phoneMatch = line.match(PHONE_REGEX);
    if (phoneMatch && !contact.phone && line.length < 50) {
      contact.phone = phoneMatch[0];
      console.log('Found phone:', phoneMatch[0]);
    }
    
    // Extract LinkedIn
    const linkedinMatch = line.match(LINKEDIN_REGEX);
    if (linkedinMatch && !contact.linkedin) {
      contact.linkedin = linkedinMatch[0];
      console.log('Found LinkedIn:', linkedinMatch[0]);
    }
    
    // Extract address (lines with state abbreviations, zip codes, or common address words)
    if (!contact.address && (
      /\b[A-Z]{2}\s+\d{5}/.test(line) || 
      /\d{5}/.test(line) ||
      /\b(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)\b/i.test(line)
    )) {
      contact.address = line;
      console.log('Found address:', line);
      continue;
    }
    
    // Handle lines with multiple contact pieces separated by delimiters
    if (line.includes('|') || line.includes('•') || line.includes('-')) {
      const parts = line.split(/[|•\-]/).map(p => p.trim());
      
      for (const part of parts) {
        const partEmailMatch = part.match(EMAIL_REGEX);
        const partPhoneMatch = part.match(PHONE_REGEX);
        const partLinkedinMatch = part.match(LINKEDIN_REGEX);
        
        if (partEmailMatch && !contact.email) {
          contact.email = partEmailMatch[0];
          console.log('Found email in multi-part line:', partEmailMatch[0]);
        }
        if (partPhoneMatch && !contact.phone) {
          contact.phone = partPhoneMatch[0];
          console.log('Found phone in multi-part line:', partPhoneMatch[0]);
        }
        if (partLinkedinMatch && !contact.linkedin) {
          contact.linkedin = partLinkedinMatch[0];
          console.log('Found LinkedIn in multi-part line:', partLinkedinMatch[0]);
        }
        
        // Check if remaining part could be a name
        let cleanPart = part;
        if (partEmailMatch) cleanPart = cleanPart.replace(partEmailMatch[0], '').trim();
        if (partPhoneMatch) cleanPart = cleanPart.replace(partPhoneMatch[0], '').trim();
        if (partLinkedinMatch) cleanPart = cleanPart.replace(partLinkedinMatch[0], '').trim();
        
        if (cleanPart && couldBeName(cleanPart) && !potentialNames.includes(cleanPart)) {
          potentialNames.push(cleanPart);
          console.log('Found potential name in multi-part line:', cleanPart);
        }
      }
    }
    
    // Collect potential names (lines that aren't contact info and aren't too long)
    if (!isContactInfo(line) && couldBeName(line)) {
      if (!potentialNames.includes(line)) {
        potentialNames.push(line);
        console.log('Found potential name:', line);
      }
    }
  }
  
  // Select the best name candidate
  if (!contact.name && potentialNames.length > 0) {
    // Prefer the first short name that doesn't contain contact info
    contact.name = potentialNames
      .filter(name => name.length < 50 && !isContactInfo(name))
      .sort((a, b) => a.length - b.length)[0] || potentialNames[0];
    
    console.log('Selected name:', contact.name);
  }
  
  console.log('Final extracted contact:', contact);
  return contact;
}
