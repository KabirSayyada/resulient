
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Globe, Check } from "lucide-react";

interface LocationFilterProps {
  onLocationChange: (location: string) => void;
  defaultLocation?: string;
  disabled?: boolean;
}

const COUNTRIES = [
  { code: 'US', name: 'United States', iso: 'us' },
  { code: 'CA', name: 'Canada', iso: 'ca' },
  { code: 'GB', name: 'United Kingdom', iso: 'uk' },
  { code: 'AU', name: 'Australia', iso: 'au' },
  { code: 'DE', name: 'Germany', iso: 'de' },
  { code: 'FR', name: 'France', iso: 'fr' },
  { code: 'NL', name: 'Netherlands', iso: 'nl' },
  { code: 'SE', name: 'Sweden', iso: 'se' },
  { code: 'NO', name: 'Norway', iso: 'no' },
  { code: 'DK', name: 'Denmark', iso: 'dk' },
  { code: 'CH', name: 'Switzerland', iso: 'ch' },
  { code: 'IE', name: 'Ireland', iso: 'ie' },
  { code: 'SG', name: 'Singapore', iso: 'sg' },
  { code: 'JP', name: 'Japan', iso: 'jp' },
  { code: 'IN', name: 'India', iso: 'in' },
  { code: 'BR', name: 'Brazil', iso: 'br' },
  { code: 'MX', name: 'Mexico', iso: 'mx' },
  { code: 'ES', name: 'Spain', iso: 'es' },
  { code: 'IT', name: 'Italy', iso: 'it' },
  { code: 'PL', name: 'Poland', iso: 'pl' }
];

export function LocationFilter({ onLocationChange, defaultLocation = "", disabled = false }: LocationFilterProps) {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [city, setCity] = useState('');
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [isLocationApplied, setIsLocationApplied] = useState(false);
  const [appliedLocation, setAppliedLocation] = useState('');

  const handleLocationSubmit = () => {
    let locationString = '';
    
    if (useCustomLocation && city.trim()) {
      // Send in format "city,countryIso" for JSearch API
      const country = COUNTRIES.find(c => c.code === selectedCountry);
      locationString = `${city.trim()},${country?.iso || 'us'}`;
    } else {
      // Use just the lowercase ISO country code
      const country = COUNTRIES.find(c => c.code === selectedCountry);
      locationString = country?.iso || 'us';
    }
    
    console.log('🌍 Setting job search location to:', locationString);
    console.log('🎯 Using JSearch API format: lowercase ISO codes');
    
    onLocationChange(locationString);
    setIsLocationApplied(true);
    setAppliedLocation(locationString);
  };

  const handleLocationClear = () => {
    setCity('');
    setSelectedCountry('US');
    setUseCustomLocation(false);
    setIsLocationApplied(false);
    setAppliedLocation('');
    onLocationChange('us'); // Default to lowercase 'us'
  };

  const selectedCountryName = COUNTRIES.find(c => c.code === selectedCountry)?.name || 'United States';

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
              <SelectTrigger className={`${isLocationApplied ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : ''}`}>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name} ({country.iso})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLocationApplied && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                <Check className="h-4 w-4" />
                <span>Applied: {selectedCountryName} ({appliedLocation})</span>
              </div>
            )}
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
              <div className="space-y-2">
                <Input
                  placeholder="e.g., London, Berlin, Tokyo"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={disabled}
                  className={`${isLocationApplied ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : ''}`}
                />
                {isLocationApplied && city && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                    <Check className="h-4 w-4" />
                    <span>Applied: {city}, {selectedCountryName}</span>
                  </div>
                )}
              </div>
            )}
            
            <p className="text-xs text-gray-500">
              {useCustomLocation 
                ? `Jobs will be searched in the specified city within ${selectedCountryName} using JSearch format`
                : `Jobs will be searched throughout ${selectedCountryName} using JSearch format`
              }
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-3">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                📍 Location and title will be used to compare your resume against competitors in that country
              </p>
            </div>
          </div>
          
          {isLocationApplied && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Check className="h-4 w-4" />
                <span className="font-medium">Location Applied: {appliedLocation}</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                This location will be used for your next job fetch
              </p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={handleLocationSubmit} 
              variant="outline" 
              size="sm"
              disabled={disabled}
              className={`${isLocationApplied ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
            >
              <Search className="h-4 w-4 mr-1" />
              {isLocationApplied ? 'Location Applied' : 'Apply Location Filter'}
            </Button>
            {(selectedCountry !== 'US' || city || useCustomLocation || isLocationApplied) && (
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
