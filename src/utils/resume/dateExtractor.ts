
import { DATE_PATTERNS } from './constants';

export function extractDates(text: string): string[] {
  const dates: string[] = [];
  
  DATE_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      dates.push(...matches);
    }
  });
  
  return dates;
}
