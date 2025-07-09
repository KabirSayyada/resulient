
// Enhanced location extraction utilities for resumes

export interface ExtractedLocation {
  fullLocation?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  confidence: number; // 0-100 confidence score
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const US_STATE_ABBR = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT',
  'VA', 'WA', 'WV', 'WI', 'WY'
];

const MAJOR_CITIES = [
  // US Cities
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
  'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus',
  'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston',
  'Nashville', 'Detroit', 'Portland', 'Las Vegas', 'Louisville', 'Baltimore', 'Milwaukee',
  'Albuquerque', 'Tucson', 'Fresno', 'Mesa', 'Sacramento', 'Atlanta', 'Kansas City',
  'Colorado Springs', 'Miami', 'Raleigh', 'Omaha', 'Long Beach', 'Virginia Beach', 'Oakland',
  'Minneapolis', 'Tulsa', 'Arlington', 'Tampa', 'New Orleans', 'Wichita', 'Cleveland',
  'Bakersfield', 'Aurora', 'Anaheim', 'Honolulu', 'Santa Ana', 'Corpus Christi', 'Riverside',
  'Lexington', 'Stockton', 'Toledo', 'St. Paul', 'Newark', 'Greensboro', 'Plano', 'Henderson',
  'Lincoln', 'Buffalo', 'Jersey City', 'Chula Vista', 'Orlando', 'Norfolk',
  // International Cities
  'London', 'Paris', 'Berlin', 'Rome', 'Madrid', 'Barcelona', 'Amsterdam', 'Vienna',
  'Prague', 'Warsaw', 'Budapest', 'Stockholm', 'Copenhagen', 'Oslo', 'Helsinki',
  'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton',
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
  'Tokyo', 'Osaka', 'Kyoto', 'Seoul', 'Singapore', 'Hong Kong', 'Shanghai', 'Beijing',
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune',
  'Dubai', 'Abu Dhabi', 'Riyadh', 'Kuwait City', 'Doha',
  'São Paulo', 'Rio de Janeiro', 'Buenos Aires', 'Mexico City', 'Guadalajara'
];

// Patterns for different location formats
const LOCATION_PATTERNS = [
  // City, State ZIP
  /([A-Za-z\s.'-]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/,
  // City, State
  /([A-Za-z\s.'-]+),\s*([A-Z]{2}|[A-Za-z\s]+)\b/,
  // State ZIP
  /([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/,
  // Just ZIP code
  /\b(\d{5}(?:-\d{4})?)\b/,
  // International formats (City, Country)
  /([A-Za-z\s.'-]+),\s*([A-Za-z\s]+)$/,
  // Remote/Virtual indicators
  /(Remote|Virtual|Work from Home|WFH|Distributed|Anywhere)/i
];

export function extractLocationFromText(text: string): ExtractedLocation | null {
  if (!text || text.trim().length === 0) return null;

  const locations: ExtractedLocation[] = [];
  const cleanText = text.trim();

  console.log(`Extracting location from: "${cleanText}"`);

  // Check for remote work indicators first (highest confidence)
  const remoteMatch = cleanText.match(/(Remote|Virtual|Work from Home|WFH|Distributed|Anywhere)/i);
  if (remoteMatch) {
    locations.push({
      fullLocation: 'Remote',
      confidence: 95
    });
  }

  // Try each location pattern
  for (const pattern of LOCATION_PATTERNS) {
    const match = cleanText.match(pattern);
    if (match) {
      const location = parseLocationMatch(match, pattern);
      if (location) {
        locations.push(location);
      }
    }
  }

  // Try to find cities and states in the text
  const cityStateLocation = extractCityState(cleanText);
  if (cityStateLocation) {
    locations.push(cityStateLocation);
  }

  // Return the location with highest confidence
  if (locations.length > 0) {
    locations.sort((a, b) => b.confidence - a.confidence);
    console.log(`Found location: ${JSON.stringify(locations[0])}`);
    return locations[0];
  }

  console.log('No location found');
  return null;
}

function parseLocationMatch(match: RegExpMatchArray, pattern: RegExp): ExtractedLocation | null {
  const matchStr = match[0];
  
  // City, State ZIP pattern
  if (pattern.source.includes('([A-Za-z\\s.\'\\-]+),\\s*([A-Z]{2})\\s+(\\d{5}')) {
    const city = match[1]?.trim();
    const state = match[2]?.trim();
    const zipCode = match[3]?.trim();
    
    if (isValidState(state)) {
      return {
        fullLocation: matchStr,
        city,
        state,
        zipCode,
        confidence: 90
      };
    }
  }

  // City, State pattern
  if (pattern.source.includes('([A-Za-z\\s.\'\\-]+),\\s*([A-Z]{2}|[A-Za-z\\s]+)')) {
    const city = match[1]?.trim();
    const stateOrCountry = match[2]?.trim();
    
    if (isValidState(stateOrCountry)) {
      return {
        fullLocation: matchStr,
        city,
        state: stateOrCountry,
        confidence: 85
      };
    } else if (stateOrCountry && stateOrCountry.length > 2) {
      // Might be a country or full state name
      const stateAbbr = getStateAbbreviation(stateOrCountry);
      if (stateAbbr) {
        return {
          fullLocation: matchStr,
          city,
          state: stateAbbr,
          confidence: 80
        };
      } else {
        return {
          fullLocation: matchStr,
          city,
          country: stateOrCountry,
          confidence: 75
        };
      }
    }
  }

  // State ZIP pattern
  if (pattern.source.includes('([A-Z]{2})\\s+(\\d{5}')) {
    const state = match[1]?.trim();
    const zipCode = match[2]?.trim();
    
    if (isValidState(state)) {
      return {
        fullLocation: matchStr,
        state,
        zipCode,
        confidence: 70
      };
    }
  }

  // Just ZIP code
  if (pattern.source.includes('\\b(\\d{5}')) {
    const zipCode = match[1]?.trim();
    return {
      fullLocation: matchStr,
      zipCode,
      confidence: 60
    };
  }

  return null;
}

function extractCityState(text: string): ExtractedLocation | null {
  const words = text.split(/\s+/);
  
  // Look for major cities
  for (const city of MAJOR_CITIES) {
    const cityWords = city.split(' ');
    if (cityWords.length === 1) {
      if (words.some(word => word.toLowerCase() === city.toLowerCase())) {
        return {
          fullLocation: city,
          city,
          confidence: 65
        };
      }
    } else {
      // Multi-word city names
      const cityRegex = new RegExp(`\\b${city.replace(/\s+/g, '\\s+')}\\b`, 'i');
      if (cityRegex.test(text)) {
        return {
          fullLocation: city,
          city,
          confidence: 65
        };
      }
    }
  }

  // Look for states
  for (const state of US_STATES) {
    const stateRegex = new RegExp(`\\b${state}\\b`, 'i');
    if (stateRegex.test(text)) {
      return {
        fullLocation: state,
        state: getStateAbbreviation(state) || state,
        confidence: 60
      };
    }
  }

  for (const stateAbbr of US_STATE_ABBR) {
    const stateRegex = new RegExp(`\\b${stateAbbr}\\b`);
    if (stateRegex.test(text)) {
      return {
        fullLocation: stateAbbr,
        state: stateAbbr,
        confidence: 60
      };
    }
  }

  return null;
}

function isValidState(state: string): boolean {
  if (!state) return false;
  const upperState = state.toUpperCase();
  return US_STATE_ABBR.includes(upperState) || 
         US_STATES.some(s => s.toUpperCase() === upperState);
}

function getStateAbbreviation(stateName: string): string | null {
  if (!stateName) return null;
  
  const upperStateName = stateName.toUpperCase();
  
  // If it's already an abbreviation
  if (US_STATE_ABBR.includes(upperStateName)) {
    return upperStateName;
  }
  
  // Find the full state name and return abbreviation
  const stateIndex = US_STATES.findIndex(s => s.toUpperCase() === upperStateName);
  if (stateIndex !== -1) {
    return US_STATE_ABBR[stateIndex];
  }
  
  return null;
}

export function extractLocationFromResumeContent(resumeContent: string): ExtractedLocation | null {
  if (!resumeContent) return null;

  const lines = resumeContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const allLocations: ExtractedLocation[] = [];

  console.log('=== EXTRACTING LOCATION FROM RESUME ===');
  
  // Strategy 1: Look in the first 15 lines (header/contact area)
  const headerLines = lines.slice(0, 15);
  for (const line of headerLines) {
    const location = extractLocationFromText(line);
    if (location) {
      location.confidence += 10; // Boost confidence for header locations
      allLocations.push(location);
      console.log(`Found location in header: ${JSON.stringify(location)}`);
    }
  }

  // Strategy 2: Look for address-like patterns throughout the resume
  for (const line of lines) {
    // Skip lines that are clearly section headers
    if (line.match(/^[A-Z\s]{5,}$/) || line.includes('===') || line.includes('---')) {
      continue;
    }

    // Look for lines with address indicators
    if (line.includes(',') || line.match(/\d{5}/) || 
        line.toLowerCase().includes('address') || 
        line.toLowerCase().includes('location')) {
      
      const location = extractLocationFromText(line);
      if (location) {
        allLocations.push(location);
        console.log(`Found location in content: ${JSON.stringify(location)}`);
      }
    }
  }

  // Strategy 3: Look in work experience sections for location clues
  let inWorkSection = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect work experience section
    if (line.toLowerCase().includes('experience') || 
        line.toLowerCase().includes('employment') ||
        line.toLowerCase().includes('work history')) {
      inWorkSection = true;
      continue;
    }
    
    // Detect end of work section
    if (inWorkSection && (line.toLowerCase().includes('education') || 
                         line.toLowerCase().includes('skills') ||
                         line.toLowerCase().includes('projects'))) {
      inWorkSection = false;
    }
    
    if (inWorkSection && line.includes(',')) {
      const location = extractLocationFromText(line);
      if (location) {
        location.confidence -= 5; // Slightly lower confidence for work locations
        allLocations.push(location);
        console.log(`Found location in work section: ${JSON.stringify(location)}`);
      }
    }
  }

  // Return the highest confidence location
  if (allLocations.length > 0) {
    allLocations.sort((a, b) => b.confidence - a.confidence);
    const bestLocation = allLocations[0];
    console.log(`Best location found: ${JSON.stringify(bestLocation)}`);
    return bestLocation;
  }

  console.log('No location found in resume');
  return null;
}

export function formatLocationForDisplay(location: ExtractedLocation): string {
  if (!location) return 'Unknown';
  
  if (location.fullLocation) {
    return location.fullLocation;
  }
  
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.state) parts.push(location.state);
  if (location.country && !location.state) parts.push(location.country);
  
  return parts.length > 0 ? parts.join(', ') : 'Location Available';
}

export function normalizeLocationForComparison(location: string): string {
  if (!location) return '';
  
  return location
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}
