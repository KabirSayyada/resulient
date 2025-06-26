
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { JobSearchFilters } from "@/hooks/useJobSearch";

interface JobFiltersProps {
  filters: JobSearchFilters;
  onFiltersChange: (filters: JobSearchFilters) => void;
  onClearFilters: () => void;
}

export function JobFilters({ filters, onFiltersChange, onClearFilters }: JobFiltersProps) {
  const updateFilter = (key: keyof JobSearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="keywords">Keywords</Label>
          <Input
            id="keywords"
            placeholder="e.g., React, JavaScript, Manager"
            value={filters.keywords || ''}
            onChange={(e) => updateFilter('keywords', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g., New York, Remote"
            value={filters.location || ''}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="jobType">Job Type</Label>
          <Select value={filters.jobType || ''} onValueChange={(value) => updateFilter('jobType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any job type</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="workArrangement">Work Arrangement</Label>
          <Select value={filters.workArrangement || ''} onValueChange={(value) => updateFilter('workArrangement', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any arrangement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any arrangement</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="onsite">On-site</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="experienceLevel">Experience Level</Label>
          <Select value={filters.experienceLevel || ''} onValueChange={(value) => updateFilter('experienceLevel', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any level</SelectItem>
              <SelectItem value="entry-level">Entry Level</SelectItem>
              <SelectItem value="mid-level">Mid Level</SelectItem>
              <SelectItem value="senior-level">Senior Level</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="salaryMin">Min Salary</Label>
            <Input
              id="salaryMin"
              type="number"
              placeholder="40000"
              value={filters.salaryMin || ''}
              onChange={(e) => updateFilter('salaryMin', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
          <div>
            <Label htmlFor="salaryMax">Max Salary</Label>
            <Input
              id="salaryMax"
              type="number"
              placeholder="120000"
              value={filters.salaryMax || ''}
              onChange={(e) => updateFilter('salaryMax', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>
        
        <Button variant="outline" onClick={onClearFilters} className="w-full">
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}
