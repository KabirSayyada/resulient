
import { ContactInfo } from "@/types/resumeStructure";
import { EMAIL_REGEX, PHONE_REGEX, LINKEDIN_REGEX } from './constants';

export function couldBeName(line: string): boolean {
  // Check if line could be a person's name
  const cleanLine = line.trim();
  console.log(`Checking if "${cleanLine}" could be a name`);
  
  const result = (
    cleanLine.length > 2 && 
    cleanLine.length < 80 && 
    !EMAIL_REGEX.test(cleanLine) && 
    !PHONE_REGEX.test(cleanLine) && 
    !LINKEDIN_REGEX.test(cleanLine) &&
    !cleanLine.includes('http') &&
    !cleanLine.includes('@') &&
    !cleanLine.match(/^\d/) && 
    !cleanLine.includes('|') &&
    !cleanLine.includes('Street') &&
    !cleanLine.includes('Ave') &&
    !cleanLine.includes('Rd') &&
    !cleanLine.includes('Drive') &&
    cleanLine.split(' ').length >= 1 &&
    cleanLine.split(' ').length <= 4 &&
    !cleanLine.match(/^[A-Z\s]{10,}$/) && // Not a long all-caps header
    !cleanLine.match(/^(RESUME|CV|CURRICULUM|VITAE|PROFILE|SUMMARY|OBJECTIVE|EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|CONTACT|PERSONAL|INFORMATION)$/i)
  );
  
  console.log(`"${cleanLine}" could be name: ${result}`);
  return result;
}

export function isContactInfo(line: string): boolean {
  const result = EMAIL_REGEX.test(line) || PHONE_REGEX.test(line) || LINKEDIN_REGEX.test(line);
  console.log(`"${line}" is contact info: ${result}`);
  return result;
}

export function extractContactInfo(lines: string[]): ContactInfo {
  const contact: ContactInfo = {};
  let potentialNames: string[] = [];
  
  console.log('=== Starting contact extraction ===');
  console.log('Input lines:', lines);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    console.log(`Processing line ${i}: "${line}"`);
    
    // Extract email
    const emailMatch = line.match(EMAIL_REGEX);
    if (emailMatch && !contact.email) {
      contact.email = emailMatch[0];
      console.log('✓ Found email:', emailMatch[0]);
    }
    
    // Extract phone
    const phoneMatch = line.match(PHONE_REGEX);
    if (phoneMatch && !contact.phone && line.length < 50) {
      contact.phone = phoneMatch[0];
      console.log('✓ Found phone:', phoneMatch[0]);
    }
    
    // Extract LinkedIn
    const linkedinMatch = line.match(LINKEDIN_REGEX);
    if (linkedinMatch && !contact.linkedin) {
      contact.linkedin = linkedinMatch[0];
      console.log('✓ Found LinkedIn:', linkedinMatch[0]);
    }
    
    // Extract address (lines with state abbreviations, zip codes, or common address words)
    if (!contact.address && (
      /\b[A-Z]{2}\s+\d{5}/.test(line) || 
      /\d{5}/.test(line) ||
      /\b(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)\b/i.test(line)
    )) {
      contact.address = line;
      console.log('✓ Found address:', line);
      continue;
    }
    
    // Handle lines with multiple contact pieces separated by delimiters
    if (line.includes('|') || line.includes('•') || line.includes('-')) {
      console.log('Processing multi-part line:', line);
      const parts = line.split(/[|•\-]/).map(p => p.trim()).filter(p => p.length > 0);
      
      for (const part of parts) {
        console.log('  Checking part:', part);
        
        const partEmailMatch = part.match(EMAIL_REGEX);
        const partPhoneMatch = part.match(PHONE_REGEX);
        const partLinkedinMatch = part.match(LINKEDIN_REGEX);
        
        if (partEmailMatch && !contact.email) {
          contact.email = partEmailMatch[0];
          console.log('  ✓ Found email in multi-part:', partEmailMatch[0]);
        } else if (partPhoneMatch && !contact.phone) {
          contact.phone = partPhoneMatch[0];
          console.log('  ✓ Found phone in multi-part:', partPhoneMatch[0]);
        } else if (partLinkedinMatch && !contact.linkedin) {
          contact.linkedin = partLinkedinMatch[0];
          console.log('  ✓ Found LinkedIn in multi-part:', partLinkedinMatch[0]);
        } else if (part.includes('http') || part.includes('www.')) {
          if (!contact.website) {
            contact.website = part;
            console.log('  ✓ Found website in multi-part:', part);
          }
        } else if (couldBeName(part) && !contact.name) {
          contact.name = part;
          console.log('  ✓ Found name in multi-part:', part);
        }
      }
      continue;
    }
    
    // Check if this could be a name
    if (couldBeName(line) && !contact.name && i < 3) {
      contact.name = line;
      console.log('✓ Found name:', line);
      continue;
    }
    
    // Check for website
    if (!contact.website && (line.includes('http') || line.includes('www.'))) {
      contact.website = line;
      console.log('✓ Found website:', line);
    }
  }
  
  console.log('=== Final extracted contact ===');
  console.log(contact);
  
  return contact;
}
