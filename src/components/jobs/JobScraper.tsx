
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search, MapPin, Briefcase, Calendar, Download } from "lucide-react";
import { useJobScraper, type JobScrapingParams } from "@/hooks/useJobScraper";

interface JobScraperProps {
  onJobsScraped?: () => void;
}

export function JobScraper({ onJobsScraped }: JobScraperProps) {
  const { scrapeJobs, loading, error } = useJobScraper();
  const [searchParams, setSearchParams] = useState<JobScrapingParams>({
    query: 'software engineer',
    location: 'United States',
    employment_types: 'FULLTIME',
    date_posted: 'week'
  });

  const handleScrape = async () => {
    try {
      await scrapeJobs(searchParams);
      onJobsScraped?.();
    } catch (error) {
      // Error is already handled in the hook and displayed via toast
      console.error('Scraping failed:', error);
    }
  };

  const handleQuickScrape = async (params: Partial<JobScrapingParams>) => {
    try {
      await scrapeJobs({ ...searchParams, ...params });
      onJobsScraped?.();
    } catch (error) {
      console.error('Quick scraping failed:', error);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Live Job Scraper
        </CardTitle>
        <CardDescription>
          Fetch the latest jobs from major job boards including Indeed, LinkedIn, and more
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickScrape({ query: 'software engineer', location: 'United States' })}
            disabled={loading}
          >
            <Briefcase className="h-3 w-3 mr-1" />
            Software Jobs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickScrape({ query: 'data scientist', location: 'United States' })}
            disabled={loading}
          >
            <Briefcase className="h-3 w-3 mr-1" />
            Data Science
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickScrape({ query: 'product manager', location: 'United States' })}
            disabled={loading}
          >
            <Briefcase className="h-3 w-3 mr-1" />
            Product Management
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickScrape({ query: 'remote', location: 'United States' })}
            disabled={loading}
          >
            <MapPin className="h-3 w-3 mr-1" />
            Remote Jobs
          </Button>
        </div>

        {/* Custom Search Form */}
        <div className="grid gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="query" className="text-sm font-medium flex items-center gap-1">
                <Search className="h-3 w-3" />
                Job Title / Keywords
              </Label>
              <Input
                id="query"
                placeholder="e.g., software engineer, data analyst"
                value={searchParams.query || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA or United States"
                value={searchParams.location || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employment_type" className="text-sm font-medium flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                Employment Type
              </Label>
              <Select
                value={searchParams.employment_types || 'FULLTIME'}
                onValueChange={(value: any) => setSearchParams(prev => ({ ...prev, employment_types: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULLTIME">Full-time</SelectItem>
                  <SelectItem value="PARTTIME">Part-time</SelectItem>
                  <SelectItem value="CONTRACTOR">Contract</SelectItem>
                  <SelectItem value="INTERN">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_posted" className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Date Posted
              </Label>
              <Select
                value={searchParams.date_posted || 'week'}
                onValueChange={(value: any) => setSearchParams(prev => ({ ...prev, date_posted: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="3days">Last 3 days</SelectItem>
                  <SelectItem value="week">Last week</SelectItem>
                  <SelectItem value="month">Last month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleScrape} disabled={loading} className="w-full">
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scraping Jobs...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Scrape Jobs
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Badge variant="outline" className="text-xs">
            Powered by JSearch API
          </Badge>
          <span>•</span>
          <span>Sources: Indeed, LinkedIn, Glassdoor, and more</span>
        </div>
      </CardContent>
    </Card>
  );
}
