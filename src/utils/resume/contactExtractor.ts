
import { ParsedContact } from "@/types/resumeStructure";
import { EMAIL_REGEX, PHONE_REGEX, LINKEDIN_REGEX } from './constants';
import { extractLocationFromText, formatLocationForDisplay } from './locationExtractor';

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

export function extractContactInfo(lines: string[]): ParsedContact {
  const contact: ParsedContact = {};
  let potentialNames: string[] = [];
  
  console.log('=== Starting enhanced contact extraction ===');
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
    
    // Enhanced location extraction using the new location extractor
    if (!contact.address) {
      const extractedLocation = extractLocationFromText(line);
      if (extractedLocation && extractedLocation.confidence > 70) {
        contact.address = formatLocationForDisplay(extractedLocation);
        console.log('✓ Found location:', contact.address);
        continue;
      }
    }
    
    // Fallback: Extract address (lines with state abbreviations, zip codes, or common address words)
    if (!contact.address && (
      /\b[A-Z]{2}\s+\d{5}/.test(line) || 
      /\d{5}/.test(line) ||
      /\b(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)\b/i.test(line)
    )) {
      contact.address = line;
      console.log('✓ Found address (fallback):', line);
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
        }
        if (partPhoneMatch && !contact.phone) {
          contact.phone = partPhoneMatch[0];
          console.log('  ✓ Found phone in multi-part:', partPhoneMatch[0]);
        }
        if (partLinkedinMatch && !contact.linkedin) {
          contact.linkedin = partLinkedinMatch[0];
          console.log('  ✓ Found LinkedIn in multi-part:', partLinkedinMatch[0]);
        }
        
        // Check for location in parts
        if (!contact.address) {
          const partLocation = extractLocationFromText(part);
          if (partLocation && partLocation.confidence > 60) {
            contact.address = formatLocationForDisplay(partLocation);
            console.log('  ✓ Found location in multi-part:', contact.address);
          }
        }
        
        // Check if remaining part could be a name
        let cleanPart = part;
        if (partEmailMatch) cleanPart = cleanPart.replace(partEmailMatch[0], '').trim();
        if (partPhoneMatch) cleanPart = cleanPart.replace(partPhoneMatch[0], '').trim();
        if (partLinkedinMatch) cleanPart = cleanPart.replace(partLinkedinMatch[0], '').trim();
        
        if (cleanPart && couldBeName(cleanPart) && !potentialNames.includes(cleanPart)) {
          potentialNames.push(cleanPart);
          console.log('  ✓ Found potential name in multi-part:', cleanPart);
        }
      }
    }
    
    // Collect potential names (lines that aren't contact info and could be names)
    if (!isContactInfo(line) && couldBeName(line)) {
      if (!potentialNames.includes(line)) {
        potentialNames.push(line);
        console.log('✓ Added potential name:', line);
      }
    }
  }
  
  console.log('All potential names found:', potentialNames);
  
  // Select the best name candidate
  if (!contact.name && potentialNames.length > 0) {
    // Prefer names that are:
    // 1. Not too short (at least 2 words or 4+ characters)
    // 2. Don't contain numbers or special characters
    // 3. Are reasonable length (not too long)
    const filteredNames = potentialNames.filter(name => {
      const words = name.split(' ').filter(w => w.length > 0);
      return (
        (words.length >= 2 || name.length >= 4) &&
        !name.match(/\d/) &&
        !name.match(/[!@#$%^&*()_+=\[\]{}|\\:";'<>?,./]/) &&
        name.length <= 50
      );
    });
    
    console.log('Filtered potential names:', filteredNames);
    
    // Pick the first good candidate, or fall back to any name
    contact.name = filteredNames[0] || potentialNames[0];
    console.log('✓ Selected final name:', contact.name);
  }
  
  console.log('=== Final extracted contact ===');
  console.log(contact);
  return contact;
}
