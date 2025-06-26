
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase, DollarSign, X } from "lucide-react";

export interface JobFilters {
  search: string;
  location: string;
  jobType: string;
  salaryRange: string;
}

interface JobFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onClearFilters: () => void;
}

export function JobFilters({ filters, onFiltersChange, onClearFilters }: JobFiltersProps) {
  const updateFilter = (key: keyof JobFilters, value: string) => {
    // Convert placeholder values back to empty strings
    const actualValue = value === 'all' ? '' : value;
    onFiltersChange({
      ...filters,
      [key]: actualValue
    });
  };

  const hasActiveFilters = filters.search || filters.location || filters.jobType || filters.salaryRange;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filter Jobs</CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearFilters}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium flex items-center gap-1">
              <Search className="h-3 w-3" />
              Search
            </Label>
            <Input
              id="search"
              placeholder="Job title, company, skills..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Location
            </Label>
            <Select
              value={filters.location || 'all'}
              onValueChange={(value) => updateFilter('location', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any location</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
                <SelectItem value="new-york">New York, NY</SelectItem>
                <SelectItem value="los-angeles">Los Angeles, CA</SelectItem>
                <SelectItem value="chicago">Chicago, IL</SelectItem>
                <SelectItem value="seattle">Seattle, WA</SelectItem>
                <SelectItem value="boston">Boston, MA</SelectItem>
                <SelectItem value="austin">Austin, TX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <Label htmlFor="jobType" className="text-sm font-medium flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              Job Type
            </Label>
            <Select
              value={filters.jobType || 'all'}
              onValueChange={(value) => updateFilter('jobType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any type</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Salary Range */}
          <div className="space-y-2">
            <Label htmlFor="salaryRange" className="text-sm font-medium flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Salary Range
            </Label>
            <Select
              value={filters.salaryRange || 'all'}
              onValueChange={(value) => updateFilter('salaryRange', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any salary" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any salary</SelectItem>
                <SelectItem value="0-50000">$0 - $50,000</SelectItem>
                <SelectItem value="50000-80000">$50,000 - $80,000</SelectItem>
                <SelectItem value="80000-120000">$80,000 - $120,000</SelectItem>
                <SelectItem value="120000-150000">$120,000 - $150,000</SelectItem>
                <SelectItem value="150000+">$150,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
