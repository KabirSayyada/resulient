import { QualificationGap } from "@/types/resume";

export function formatResumeContent(content: string | any): string {
  // Handle case where content might be an object
  if (typeof content === 'object' && content !== null) {
    // If it's an object with an optimizedResume property, extract that
    if (content.optimizedResume) {
      return String(content.optimizedResume);
    }
    // Otherwise convert object to string representation
    return JSON.stringify(content, null, 2);
  }
  
  // Ensure content is a string
  if (typeof content !== 'string') {
    return String(content || '');
  }
  
  // Clean up any JSON formatting artifacts that might have slipped through
  return content
    .replace(/^["']|["']$/g, '') // Remove leading/trailing quotes
    .replace(/\\n/g, '\n') // Convert escaped newlines to actual newlines
    .replace(/\\"/g, '"') // Convert escaped quotes to regular quotes
    .replace(/^\{|\}$/g, '') // Remove leading/trailing braces if they exist
    .trim();
}

export function calculateKeywordScore(resume: string | any, jobDescription: string): number {
  // Ensure resume is a string before processing
  const resumeText = typeof resume === 'string' ? resume : 
                     typeof resume === 'object' && resume !== null ? JSON.stringify(resume) : 
                     String(resume || '');
  const jobDesc = typeof jobDescription === 'string' ? jobDescription : String(jobDescription || '');
  
  if (!resumeText.trim() || !jobDesc.trim()) return 0;
  
  const jobKeywords = extractKeywords(jobDesc.toLowerCase());
  const resumeKeywords = extractKeywords(resumeText.toLowerCase());
  
  if (jobKeywords.length === 0) return 50; // Default score if no keywords
  
  const matchedKeywords = jobKeywords.filter(keyword => 
    resumeKeywords.some(resumeKeyword => resumeKeyword.includes(keyword) || keyword.includes(resumeKeyword))
  );
  
  const score = Math.min(100, Math.round((matchedKeywords.length / jobKeywords.length) * 100));
  return Math.max(10, score); // Minimum score of 10
}

export function calculateStructureScore(resume: string | any): number {
  // Ensure resume is a string before processing
  const resumeText = typeof resume === 'string' ? resume : 
                     typeof resume === 'object' && resume !== null ? JSON.stringify(resume) : 
                     String(resume || '');
  
  if (!resumeText.trim()) return 0;
  
  let score = 0;
  const content = resumeText.toLowerCase();
  
  // Check for essential sections (20 points each)
  const sections = [
    { name: 'contact', keywords: ['email', 'phone', '@'] },
    { name: 'experience', keywords: ['experience', 'work', 'employment'] },
    { name: 'education', keywords: ['education', 'degree', 'university', 'college'] },
    { name: 'skills', keywords: ['skills', 'technical', 'proficient'] }
  ];
  
  sections.forEach(section => {
    if (section.keywords.some(keyword => content.includes(keyword))) {
      score += 20;
    }
  });
  
  // Check for bullet points (10 points)
  if (content.includes('•') || content.includes('-') || content.includes('*')) {
    score += 10;
  }
  
  // Check for proper formatting (10 points)
  if (resumeText.split('\n').length > 5) {
    score += 10;
  }
  
  return Math.min(100, score);
}

export function calculateATSScore(resume: string | any): number {
  // Ensure resume is a string before processing
  const resumeText = typeof resume === 'string' ? resume : 
                     typeof resume === 'object' && resume !== null ? JSON.stringify(resume) : 
                     String(resume || '');
  
  if (!resumeText.trim()) return 0;
  
  let score = 0;
  const content = resumeText.toLowerCase();
  
  // Standard formatting (30 points)
  if (!content.includes('table') && !content.includes('column')) score += 15;
  if (content.includes('\n')) score += 15;
  
  // Clear section headers (30 points)
  const headers = ['summary', 'experience', 'education', 'skills'];
  const foundHeaders = headers.filter(header => content.includes(header));
  score += (foundHeaders.length / headers.length) * 30;
  
  // Proper use of keywords (25 points)
  const commonKeywords = ['managed', 'developed', 'created', 'implemented', 'improved'];
  const foundKeywords = commonKeywords.filter(keyword => content.includes(keyword));
  score += (foundKeywords.length / commonKeywords.length) * 25;
  
  // Contact information (15 points)
  if (content.includes('@') && (content.includes('phone') || /\d{3}/.test(content))) {
    score += 15;
  }
  
  return Math.min(100, Math.round(score));
}

export function generateSuggestions(
  keywordScore: number,
  structureScore: number,
  atsScore: number,
  resume: string | any,
  jobDescription: string
): string[] {
  const suggestions: string[] = [];
  
  // Ensure resume is a string before processing
  const resumeText = typeof resume === 'string' ? resume : 
                     typeof resume === 'object' && resume !== null ? JSON.stringify(resume) : 
                     String(resume || '');
  const content = resumeText.toLowerCase();
  
  if (keywordScore < 60) {
    suggestions.push("Include more relevant keywords from the job description");
    suggestions.push("Align your skills section with the job requirements");
  }
  
  if (structureScore < 70) {
    suggestions.push("Add clear section headers (Summary, Experience, Education, Skills)");
    suggestions.push("Use bullet points to organize information");
  }
  
  if (atsScore < 75) {
    suggestions.push("Avoid tables, columns, and complex formatting");
    suggestions.push("Use standard section names that ATS systems recognize");
    suggestions.push("Include contact information in a clear format");
  }
  
  // Specific suggestions based on missing elements
  if (!content.includes('summary') && !content.includes('objective')) {
    suggestions.push("Add a professional summary or objective statement");
  }
  
  if (!content.includes('@')) {
    suggestions.push("Include your email address in the contact section");
  }
  
  return suggestions.slice(0, 5); // Limit to 5 suggestions
}

function extractKeywords(text: string): string[] {
  // Remove common stop words and extract meaningful keywords
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'
  ]);
  
  return text
    .split(/\W+/)
    .filter(word => word.length > 2 && !stopWords.has(word.toLowerCase()))
    .map(word => word.toLowerCase());
}

export function findQualificationGaps(resume: string | any, jobDescription: string): QualificationGap[] {
  // Ensure inputs are strings before processing
  const resumeText = typeof resume === 'string' ? resume : 
                     typeof resume === 'object' && resume !== null ? JSON.stringify(resume) : 
                     String(resume || '');
  const jobDesc = typeof jobDescription === 'string' ? jobDescription : String(jobDescription || '');
  
  const gaps: QualificationGap[] = [];
  
  if (!resumeText.trim() || !jobDesc.trim()) return gaps;
  
  const jobKeywords = extractKeywords(jobDesc.toLowerCase());
  const resumeKeywords = extractKeywords(resumeText.toLowerCase());
  
  // Find missing critical skills
  const criticalSkills = jobKeywords.filter(keyword => 
    keyword.length > 3 && 
    !resumeKeywords.some(resumeKeyword => 
      resumeKeyword.includes(keyword) || keyword.includes(resumeKeyword)
    )
  );
  
  criticalSkills.slice(0, 3).forEach(skill => {
    gaps.push({
      skill: skill,
      importance: 'Important - This skill appears in the job description',
      howToAcquire: `Consider adding "${skill}" to your skills section or highlighting relevant experience with this technology/skill`
    });
  });
  
  return gaps;
}
