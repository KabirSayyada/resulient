import { ParsedResume } from '@/types/resumeStructure';

export const parseOptimizedResumeContent = (content: string): ParsedResume => {
  console.log('=== PARSING OPTIMIZED RESUME CONTENT ===');
  console.log('Content length:', content.length);
  console.log('First 500 chars:', content.substring(0, 500));
  
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  console.log('Total lines after filtering:', lines.length);
  
  const resume: ParsedResume = {
    contact: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: ''
    },
    professionalSummary: '',
    workExperience: [],
    skills: [],
    education: [],
    projects: [],
    certifications: [],
    achievements: [],
    additionalSections: {}
  };

  let currentSection = '';
  let sectionContent: string[] = [];
  let contactProcessed = false;

  // Enhanced contact extraction from the first few lines
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i];
    console.log(`Contact extraction line ${i}: "${line}"`);
    
    // Skip section headers during contact extraction
    if (identifySection(line)) {
      break;
    }
    
    // Name detection (first non-contact-info line)
    if (!resume.contact.name && 
        !line.includes('@') && 
        !line.match(/\d{3}/) &&
        !line.toLowerCase().includes('linkedin') &&
        !line.includes('|') &&
        !line.includes('📍') &&
        !line.includes('📞') &&
        !line.includes('✉️') &&
        !line.includes('🔗') &&
        !line.match(/^[=\-_]{3,}$/) &&
        line.length > 2 && line.length < 60 &&
        line.match(/^[A-Za-z\s\-'\.]+$/)) {
      resume.contact.name = line;
      console.log('Found name:', resume.contact.name);
      continue;
    }
    
    // Contact line with multiple pieces of info
    if (line.includes('|')) {
      const parts = line.split('|').map(p => p.trim());
      parts.forEach(part => {
        if (part.includes('@') && !resume.contact.email) {
          const emailMatch = part.match(/[\w\.-]+@[\w\.-]+\.\w+/);
          if (emailMatch) {
            resume.contact.email = emailMatch[0];
            console.log('Found email:', resume.contact.email);
          }
        } else if (part.match(/(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/) && !resume.contact.phone) {
          const phoneMatch = part.match(/(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/);
          if (phoneMatch) {
            resume.contact.phone = phoneMatch[0];
            console.log('Found phone:', resume.contact.phone);
          }
        } else if ((part.toLowerCase().includes('linkedin') || part.includes('linkedin.com')) && !resume.contact.linkedin) {
          resume.contact.linkedin = part.replace(/^linkedin:?\s*/i, '').trim();
          console.log('Found LinkedIn:', resume.contact.linkedin);
        } else if ((part.includes('.com') || part.includes('http')) && !part.includes('@') && !resume.contact.linkedin) {
          resume.contact.linkedin = part;
          console.log('Found website/LinkedIn:', resume.contact.linkedin);
        } else if (!resume.contact.address && (part.includes(',') || part.match(/[A-Z]{2}\s*\d{5}/))) {
          resume.contact.address = part.replace('📍', '').trim();
          console.log('Found address:', resume.contact.address);
        }
      });
      contactProcessed = true;
    }
    
    // Individual contact info lines
    if (!contactProcessed) {
      if (line.includes('@') && !resume.contact.email) {
        const emailMatch = line.match(/[\w\.-]+@[\w\.-]+\.\w+/);
        if (emailMatch) {
          resume.contact.email = emailMatch[0];
          console.log('Found email:', resume.contact.email);
        }
      } else if (line.match(/(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/) && !resume.contact.phone) {
        const phoneMatch = line.match(/(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/);
        if (phoneMatch) {
          resume.contact.phone = phoneMatch[0];
          console.log('Found phone:', resume.contact.phone);
        }
      } else if ((line.toLowerCase().includes('linkedin') || line.includes('linkedin.com')) && !resume.contact.linkedin) {
        resume.contact.linkedin = line.replace(/^linkedin:?\s*/i, '').trim();
        console.log('Found LinkedIn:', resume.contact.linkedin);
      } else if ((line.includes(',') || line.match(/[A-Z]{2}\s*\d{5}/)) && !resume.contact.address) {
        resume.contact.address = line.replace('📍', '').trim();
        console.log('Found address:', resume.contact.address);
      }
    }
  }

  // Process all lines for sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    console.log(`Processing line ${i}: "${line}"`);
    
    // Skip divider lines
    if (line.match(/^[=\-_]{3,}$/)) {
      console.log('Skipping divider line');
      continue;
    }

    // Detect section headers
    const sectionType = identifySection(line);
    
    if (sectionType) {
      console.log(`Found section: ${line} -> ${sectionType}`);
      
      // Process previous section
      if (currentSection && sectionContent.length > 0) {
        console.log(`Processing previous section: ${currentSection} with ${sectionContent.length} lines`);
        processSectionContent(resume, currentSection, sectionContent);
      }
      
      currentSection = sectionType;
      sectionContent = [];
      continue;
    }

    // Add content to current section
    if (currentSection) {
      sectionContent.push(line);
      console.log(`Added to ${currentSection}: "${line}"`);
    }
  }

  // Process final section
  if (currentSection && sectionContent.length > 0) {
    console.log(`Processing final section: ${currentSection} with ${sectionContent.length} lines`);
    processSectionContent(resume, currentSection, sectionContent);
  }

  console.log('=== FINAL PARSED RESUME ===');
  console.log('Contact:', resume.contact);
  console.log('Professional Summary:', resume.professionalSummary);
  console.log('Professional Summary length:', resume.professionalSummary?.length);
  console.log('Work Experience count:', resume.workExperience.length);
  console.log('Education count:', resume.education.length);
  console.log('Skills count:', resume.skills.length);
  console.log('Projects count:', resume.projects.length);
  console.log('Certifications count:', resume.certifications.length);
  console.log('Achievements count:', resume.achievements.length);
  console.log('Additional sections:', Object.keys(resume.additionalSections));

  return resume;
};

function identifySection(line: string): string | null {
  const upperLine = line.toUpperCase().trim();
  
  // Common section headers - comprehensive list
  const sections = {
    'PROFESSIONAL SUMMARY': 'summary',
    'SUMMARY': 'summary',
    'EXECUTIVE SUMMARY': 'summary',
    'OBJECTIVE': 'summary',
    'CAREER OBJECTIVE': 'summary',
    'CAREER SUMMARY': 'summary',
    'PROFILE': 'summary',
    'ABOUT': 'summary',
    'ABOUT ME': 'summary',
    'PROFESSIONAL PROFILE': 'summary',
    'PROFESSIONAL EXPERIENCE': 'experience',
    'WORK EXPERIENCE': 'experience',
    'EXPERIENCE': 'experience',
    'EMPLOYMENT HISTORY': 'experience',
    'CAREER HISTORY': 'experience',
    'EMPLOYMENT': 'experience',
    'PROFESSIONAL HISTORY': 'experience',
    'WORK HISTORY': 'experience',
    'TECHNICAL SKILLS': 'skills',
    'SKILLS': 'skills',
    'CORE COMPETENCIES': 'skills',
    'COMPETENCIES': 'skills',
    'TECHNOLOGIES': 'skills',
    'KEY SKILLS': 'skills',
    'PROFESSIONAL SKILLS': 'skills',
    'TECHNICAL COMPETENCIES': 'skills',
    'CORE SKILLS': 'skills',
    'SKILL SET': 'skills',
    'EDUCATION': 'education',
    'ACADEMIC BACKGROUND': 'education',
    'QUALIFICATIONS': 'education',
    'ACADEMIC QUALIFICATIONS': 'education',
    'EDUCATIONAL BACKGROUND': 'education',
    'ACADEMIC HISTORY': 'education',
    'PROJECTS': 'projects',
    'KEY PROJECTS': 'projects',
    'NOTABLE PROJECTS': 'projects',
    'SELECTED PROJECTS': 'projects',
    'PROJECT EXPERIENCE': 'projects',
    'RELEVANT PROJECTS': 'projects',
    'CERTIFICATIONS': 'certifications',
    'CERTIFICATES': 'certifications',
    'LICENSES': 'certifications',
    'PROFESSIONAL CERTIFICATIONS': 'certifications',
    'CERTIFICATIONS AND LICENSES': 'certifications',
    'LICENSES AND CERTIFICATIONS': 'certifications',
    'ACHIEVEMENTS': 'achievements',
    'ACCOMPLISHMENTS': 'achievements',
    'AWARDS': 'achievements',
    'HONORS': 'achievements',
    'KEY ACHIEVEMENTS': 'achievements',
    'RECOGNITION': 'achievements',
    'AWARDS AND HONORS': 'achievements',
    'LANGUAGES': 'languages',
    'LANGUAGE SKILLS': 'languages',
    'ADDITIONAL INFORMATION': 'additional',
    'VOLUNTEER EXPERIENCE': 'volunteer',
    'VOLUNTEER WORK': 'volunteer',  
    'VOLUNTEER ACTIVITIES': 'volunteer',
    'VOLUNTEERING': 'volunteer',
    'PUBLICATIONS': 'publications',
    'RESEARCH': 'publications',
    'REFERENCES': 'references',
    'PROFESSIONAL REFERENCES': 'references',
    'INTERESTS': 'interests',
    'HOBBIES': 'interests',
    'PERSONAL INTERESTS': 'interests',
    'HOBBIES AND INTERESTS': 'interests',
    'TRAINING': 'training',
    'PROFESSIONAL DEVELOPMENT': 'training',
    'WORKSHOPS': 'training',
    'COURSES': 'training',
    'CONTINUING EDUCATION': 'training',
    'ADDITIONAL TRAINING': 'training'
  };

  // Exact match first
  if (sections[upperLine]) {
    return sections[upperLine];
  }

  // Partial matches for flexibility - but be more careful
  for (const [key, value] of Object.entries(sections)) {
    if (upperLine === key) {
      return value;
    }
  }

  return null;
}

function processSectionContent(resume: ParsedResume, sectionType: string, content: string[]): void {
  console.log(`Processing section content for: ${sectionType}`);
  console.log('Content:', content);
  
  switch (sectionType) {
    case 'summary':
      resume.professionalSummary = content.join(' ').trim();
      console.log(`Set professional summary to: "${resume.professionalSummary}"`);
      break;
      
    case 'experience':
      resume.workExperience = parseWorkExperience(content);
      console.log(`Parsed ${resume.workExperience.length} work experiences:`, resume.workExperience);
      break;
      
    case 'skills':
      resume.skills = parseSkills(content);
      break;
      
    case 'education':
      resume.education = parseEducation(content);
      break;
      
    case 'projects':
      resume.projects = parseProjects(content);
      break;
      
    case 'certifications':
      resume.certifications = parseCertifications(content);
      break;
      
    case 'achievements':
      resume.achievements = parseAchievements(content);
      break;
      
    case 'languages':
      resume.additionalSections.languages = content.map(line => line.replace(/^[•\-*]\s*/, '').trim()).filter(item => item);
      break;
      
    case 'references':
      resume.additionalSections.references = content.map(line => line.replace(/^[•\-*]\s*/, '').trim()).filter(item => item);
      break;
      
    case 'volunteer':
      resume.additionalSections.volunteer = content.map(line => line.replace(/^[•\-*]\s*/, '').trim()).filter(item => item);
      break;
      
    case 'publications':
      resume.additionalSections.publications = content.map(line => line.replace(/^[•\-*]\s*/, '').trim()).filter(item => item);
      break;
      
    case 'interests':
      resume.additionalSections.interests = content.map(line => line.replace(/^[•\-*]\s*/, '').trim()).filter(item => item);
      break;
      
    case 'training':
      resume.additionalSections.training = content.map(line => line.replace(/^[•\-*]\s*/, '').trim()).filter(item => item);
      break;
      
    case 'additional':
      resume.additionalSections.additional = content.map(line => line.replace(/^[•\-*]\s*/, '').trim()).filter(item => item);
      break;
      
    default:
      // Store unknown sections in additionalSections
      resume.additionalSections[sectionType] = content.map(line => line.replace(/^[•\-*]\s*/, '').trim()).filter(item => item);
      break;
  }
}

function parseWorkExperience(content: string[]) {
  const experiences = [];
  let currentExp = null;
  let i = 0;

  console.log('=== PARSING WORK EXPERIENCE ===');
  console.log('Content lines:', content);

  while (i < content.length) {
    const line = content[i];
    console.log(`Processing experience line ${i}: "${line}"`);

    // Check if this is a bullet point (responsibility)
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      if (currentExp) {
        const responsibility = line.replace(/^[•\-*]\s*/, '').trim();
        currentExp.responsibilities.push(responsibility);
        console.log(`Added responsibility: "${responsibility}"`);
      }
      i++;
      continue;
    }

    // Check if this looks like dates only (e.g., "March 2020 – Present")
    if (line.match(/^\w+\s+\d{4}\s*[–-]\s*(\w+\s+\d{4}|Present)$/i)) {
      if (currentExp) {
        const dateParts = line.split(/\s*[–-]\s*/);
        currentExp.startDate = dateParts[0]?.trim() || '';
        currentExp.endDate = dateParts[1]?.trim() || '';
        console.log(`Added dates: ${currentExp.startDate} - ${currentExp.endDate}`);
      }
      i++;
      continue;
    }

    // Check if this could be a job title (not a bullet point and not just dates)
    if (line.length > 2 && !line.match(/^\d{4}/) && 
        !line.toLowerCase().includes('responsibilities') &&
        !line.toLowerCase().includes('duties')) {
      
      // If we have a current experience, save it
      if (currentExp) {
        experiences.push(currentExp);
        console.log(`Saved experience:`, currentExp);
      }

      // Start new experience
      currentExp = {
        position: line.trim(),
        company: '',
        startDate: '',
        endDate: '',
        responsibilities: []
      };
      console.log(`Started new experience with position: "${line}"`);

      // Look ahead for company name and dates
      if (i + 1 < content.length) {
        const nextLine = content[i + 1];
        console.log(`Next line: "${nextLine}"`);
        
        // If next line contains a dash/separator and looks like company info
        if (nextLine.includes('–') || nextLine.includes('-') || nextLine.includes('|')) {
          const parts = nextLine.split(/[–\-|]/).map(p => p.trim());
          if (parts.length >= 1) {
            currentExp.company = parts[0] || '';
            // Check if there are dates in the same line
            if (parts.length >= 2 && parts[1].match(/\d{4}/)) {
              const datePart = parts.slice(1).join(' ').trim();
              const dateMatch = datePart.match(/(\w+\s+\d{4})\s*[–-]\s*(\w+\s+\d{4}|Present)/i);
              if (dateMatch) {
                currentExp.startDate = dateMatch[1];
                currentExp.endDate = dateMatch[2];
              }
            }
            console.log(`Set company: "${currentExp.company}"`);
            i++; // Skip the next line since we processed it
          }
        } else if (!nextLine.startsWith('•') && !nextLine.startsWith('-') && !nextLine.startsWith('*')) {
          // Next line might be just the company name
          currentExp.company = nextLine.trim();
          console.log(`Set company from next line: "${currentExp.company}"`);
          i++; // Skip the next line
        }
      }
    }

    i++;
  }

  // Add the last experience
  if (currentExp) {
    experiences.push(currentExp);
    console.log(`Saved final experience:`, currentExp);
  }

  console.log(`=== FINAL WORK EXPERIENCES (${experiences.length}) ===`);
  experiences.forEach((exp, idx) => {
    console.log(`Experience ${idx}:`, exp);
  });

  return experiences;
}

function parseSkills(content: string[]) {
  const skills = [];
  
  for (const line of content) {
    // Split by common delimiters
    const lineSkills = line
      .replace(/^[•\-*]\s*/, '')
      .split(/[,|•·]/)
      .map(s => s.trim())
      .filter(s => s && s.length > 1);
    
    skills.push(...lineSkills);
  }
  
  return [...new Set(skills)]; // Remove duplicates
}

function parseEducation(content: string[]) {
  const education = [];
  let currentEdu = null;

  for (const line of content) {
    if (line.includes('|') || line.includes('–') || line.includes(' - ')) {
      if (currentEdu) {
        education.push(currentEdu);
      }
      
      const parts = line.split(/[|–-]/).map(p => p.trim());
      currentEdu = {
        degree: parts[0] || '',
        field: '',
        institution: parts[1] || '',
        graduationDate: parts[2] || ''
      };
    } else if (line.trim() && !currentEdu) {
      currentEdu = {
        degree: line.trim(),
        field: '',
        institution: '',
        graduationDate: ''
      };
    } else if (currentEdu && !currentEdu.institution && line.trim() && !line.match(/\d{4}/)) {
      currentEdu.institution = line.trim();
    } else if (currentEdu && line.trim() && line.match(/\d{4}/)) {
      currentEdu.graduationDate = line.trim();
    }
  }

  if (currentEdu) {
    education.push(currentEdu);
  }

  return education;
}

function parseProjects(content: string[]) {
  const projects = [];
  let currentProject = null;

  for (const line of content) {
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      if (currentProject) {
        currentProject.description += (currentProject.description ? ' ' : '') + 
          line.replace(/^[•\-*]\s*/, '').trim();
      }
    } else if (line.trim() && !line.toLowerCase().startsWith('tech')) {
      if (currentProject) {
        projects.push(currentProject);
      }
      
      currentProject = {
        name: line.trim(),
        description: '',
        technologies: []
      };
    } else if (currentProject && line.toLowerCase().includes('tech')) {
      const techPart = line.split(':')[1];
      if (techPart) {
        currentProject.technologies = techPart.split(',').map(t => t.trim());
      }
    }
  }

  if (currentProject) {
    projects.push(currentProject);
  }

  return projects;
}

function parseCertifications(content: string[]) {
  const certifications = [];

  for (const line of content) {
    if (line.includes('|') || line.includes('–') || line.includes(' - ')) {
      const parts = line.split(/[|–-]/).map(p => p.trim());
      certifications.push({
        name: parts[0] || '',
        issuer: parts[1] || 'Unknown',
        date: parts[2] || ''
      });
    } else if (line.trim()) {
      const cleanLine = line.replace(/^[•\-*]\s*/, '').trim();
      // Check if line has date in parentheses
      const dateMatch = cleanLine.match(/^(.+?)\s*\((.+?)\)$/);
      if (dateMatch) {
        certifications.push({
          name: dateMatch[1].trim(),
          issuer: 'Unknown',
          date: dateMatch[2].trim()
        });
      } else {
        certifications.push({
          name: cleanLine,
          issuer: 'Unknown',
          date: ''
        });
      }
    }
  }

  return certifications;
}

function parseAchievements(content: string[]) {
  return content.map(line => line.replace(/^[•\-*]\s*/, '').trim()).filter(item => item && item.length > 0);
}
