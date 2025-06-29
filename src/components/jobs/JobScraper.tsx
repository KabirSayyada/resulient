
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search, MapPin, Briefcase, Calendar, Download, Zap } from "lucide-react";
import { useJobScraper, type JobScrapingParams } from "@/hooks/useJobScraper";

interface JobScraperProps {
  onJobsScraped?: () => void;
}

export function JobScraper({ onJobsScraped }: JobScraperProps) {
  const { scrapeJobs, loading } = useJobScraper();
  const [searchParams, setSearchParams] = useState<JobScrapingParams>({
    query: 'software engineer',
    location: 'United States',
    employment_types: 'FULLTIME',
    date_posted: 'week',
    num_pages: 5, // Default to 5 pages for high volume
    user_id: '' // This will be set when calling the function
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
      // Use high page count for quick scrapes too
      await scrapeJobs({ ...searchParams, ...params, num_pages: 8 });
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
          High-Volume Job Scraper
          <Badge variant="secondary" className="ml-2">
            <Zap className="h-3 w-3 mr-1" />
            Max Jobs
          </Badge>
        </CardTitle>
        <CardDescription>
          Fetch MAXIMUM jobs from major job boards including Indeed, LinkedIn, and more. Optimized for high-volume collection.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions with High Volume */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickScrape({ query: 'software engineer OR developer OR programmer', location: 'United States' })}
            disabled={loading}
          >
            <Briefcase className="h-3 w-3 mr-1" />
            Tech Jobs (High Vol)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickScrape({ query: 'data scientist OR analyst OR engineer', location: 'Remote' })}
            disabled={loading}
          >
            <Briefcase className="h-3 w-3 mr-1" />
            Data Science (High Vol)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickScrape({ query: 'manager OR director OR lead', location: 'California' })}
            disabled={loading}
          >
            <Briefcase className="h-3 w-3 mr-1" />
            Management (High Vol)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickScrape({ query: 'entry level OR junior OR intern', location: 'United States' })}
            disabled={loading}
          >
            <MapPin className="h-3 w-3 mr-1" />
            Entry Level (High Vol)
          </Button>
        </div>

        {/* Custom Search Form */}
        <div className="grid gap-4 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              High-Volume Mode: Fetch 5-10 pages per search for maximum job collection
            </span>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="query" className="text-sm font-medium flex items-center gap-1">
                <Search className="h-3 w-3" />
                Job Title / Keywords
              </Label>
              <Input
                id="query"
                placeholder="e.g., software engineer OR developer"
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

            <div className="space-y-2">
              <Label htmlFor="num_pages" className="text-sm font-medium flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Pages to Fetch
              </Label>
              <Select
                value={searchParams.num_pages?.toString() || '5'}
                onValueChange={(value) => setSearchParams(prev => ({ ...prev, num_pages: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 pages (~150 jobs)</SelectItem>
                  <SelectItem value="5">5 pages (~250 jobs)</SelectItem>
                  <SelectItem value="8">8 pages (~400 jobs)</SelectItem>
                  <SelectItem value="10">10 pages (~500 jobs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleScrape} disabled={loading} className="w-full">
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scraping {searchParams.num_pages} Pages...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Scrape {searchParams.num_pages} Pages for Maximum Jobs
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Badge variant="outline" className="text-xs">
            <Zap className="h-2 w-2 mr-1" />
            High-Volume JSearch API
          </Badge>
          <span>•</span>
          <span>Sources: Indeed, LinkedIn, Glassdoor, ZipRecruiter, and more</span>
          <span>•</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            Up to 500+ jobs per request
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
