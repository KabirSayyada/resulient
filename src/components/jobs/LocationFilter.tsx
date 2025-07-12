
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Globe } from "lucide-react";

interface LocationFilterProps {
  onLocationChange: (location: string) => void;
  defaultLocation?: string;
  disabled?: boolean;
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'SG', name: 'Singapore' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'PL', name: 'Poland' }
];

export function LocationFilter({ onLocationChange, defaultLocation = "", disabled = false }: LocationFilterProps) {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [city, setCity] = useState('');
  const [useCustomLocation, setUseCustomLocation] = useState(false);

  const handleLocationSubmit = () => {
    let locationString = '';
    
    if (useCustomLocation && city.trim()) {
      // Use custom city with selected country
      const country = COUNTRIES.find(c => c.code === selectedCountry);
      locationString = `${city.trim()}, ${country?.name || 'United States'}`;
    } else if (!useCustomLocation) {
      // Use just the country
      const country = COUNTRIES.find(c => c.code === selectedCountry);
      locationString = country?.name || 'United States';
    }
    
    console.log('Setting job search location to:', locationString);
    onLocationChange(locationString);
  };

  const handleLocationClear = () => {
    setCity('');
    setSelectedCountry('US');
    setUseCustomLocation(false);
    onLocationChange('');
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5" />
          Job Location Preference
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Target Country
            </Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry} disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="use-custom-location"
                checked={useCustomLocation}
                onChange={(e) => setUseCustomLocation(e.target.checked)}
                disabled={disabled}
                className="rounded"
              />
              <Label htmlFor="use-custom-location" className="text-sm font-medium">
                Specify city/region (optional)
              </Label>
            </div>
            
            {useCustomLocation && (
              <Input
                placeholder="e.g., New York, London, Remote"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={disabled}
              />
            )}
            
            <p className="text-xs text-gray-500">
              {useCustomLocation 
                ? "Jobs will be searched in the specified city/region within the selected country"
                : "Jobs will be searched throughout the selected country"
              }
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-3">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                📊 We use your job title to score your resume against thousands of people with the same title in your target location - they are your competition!
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleLocationSubmit} 
              variant="outline" 
              size="sm"
              disabled={disabled}
            >
              <Search className="h-4 w-4 mr-1" />
              Apply Location Filter
            </Button>
            {(selectedCountry !== 'US' || city || useCustomLocation) && (
              <Button 
                onClick={handleLocationClear} 
                variant="ghost" 
                size="sm"
                disabled={disabled}
              >
                Reset to Default
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
