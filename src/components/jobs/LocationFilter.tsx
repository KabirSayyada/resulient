
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";

interface LocationFilterProps {
  onLocationChange: (location: string) => void;
  defaultLocation?: string;
  disabled?: boolean;
}

export function LocationFilter({ onLocationChange, defaultLocation = "", disabled = false }: LocationFilterProps) {
  const [location, setLocation] = useState(defaultLocation);

  const handleLocationSubmit = () => {
    onLocationChange(location);
  };

  const handleLocationClear = () => {
    setLocation("");
    onLocationChange("");
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
            <Label htmlFor="job-location" className="text-sm font-medium">
              Override Location (Optional)
            </Label>
            <Input
              id="job-location"
              placeholder="e.g., San Francisco, CA or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={disabled}
            />
            <p className="text-xs text-gray-500">
              Leave empty to use the location from your resume automatically
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleLocationSubmit} 
              variant="outline" 
              size="sm"
              disabled={disabled}
            >
              <Search className="h-4 w-4 mr-1" />
              Apply Location
            </Button>
            {location && (
              <Button 
                onClick={handleLocationClear} 
                variant="ghost" 
                size="sm"
                disabled={disabled}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
