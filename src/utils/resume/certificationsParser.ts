
import { ParsedCertification } from "@/types/resumeStructure";
import { extractDates } from './dateExtractor';

export function parseCertifications(content: string[]): ParsedCertification[] {
  const certifications: ParsedCertification[] = [];
  
  for (const line of content) {
    if (line.length > 3) {
      const cert: ParsedCertification = {
        name: line,
        issuer: 'Unknown'
      };
      
      // Extract dates
      const dates = extractDates(line);
      if (dates.length > 0) {
        cert.date = dates[0];
      }
      
      // Look for issuer patterns
      const issuerPatterns = [
        /\b(?:by|from|issued by)\s+(.+)/i,
        /\b(?:-|–|—)\s*(.+)$/,
        /\|\s*(.+)$/
      ];
      
      for (const pattern of issuerPatterns) {
        const issuerMatch = line.match(pattern);
        if (issuerMatch) {
          cert.issuer = issuerMatch[1].trim();
          cert.name = line.replace(issuerMatch[0], '').trim();
          break;
        }
      }
      
      certifications.push(cert);
    }
  }
  
  return certifications;
}
