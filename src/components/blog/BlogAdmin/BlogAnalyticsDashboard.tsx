import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAdminBlogAnalytics } from "@/hooks/useAdminBlogAnalytics";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { format, subDays, startOfDay, endOfDay, isSameDay } from "date-fns";
import { 
  CalendarIcon, 
  Users, 
  Eye, 
  Clock, 
  MousePointerClick, 
  Share2, 
  MailCheck, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function BlogAnalyticsDashboard() {
  // Date range state for filtering
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  // Re-fetch trigger state
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);
  
  // Error visibility control
  const [errorVisible, setErrorVisible] = useState<boolean>(true);
  
  // Handler for manual refresh
  const handleRefresh = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
    setErrorVisible(true);
  }, []);
  
  // Reset error visibility after refresh
  useEffect(() => {
    setErrorVisible(true);
  }, [refetchTrigger]);
  
  // Get analytics data
  const {
    pageViews,
    uniqueVisitors,
    popularPosts,
    conversionEvents,
    timeOnPageAvg,
    scrollDepthAvg,
    isLoading,
    error
  } = useAdminBlogAnalytics({
    dateRange: {
      from: startOfDay(dateRange.from),
      to: endOfDay(dateRange.to),
    },
    refetchTrigger,
  });
  
  // Format date range for display
  const dateRangeText = isSameDay(dateRange.from, dateRange.to)
    ? format(dateRange.from, 'PPP')
    : `${format(dateRange.from, 'PPP')} - ${format(dateRange.to, 'PPP')}`;
  
  // Group conversion events by type for the pie chart
  const conversionsByType = (conversionEvents || []).reduce<Record<string, number>>((acc, event) => {
    if (!event?.event_type) return acc;
    const type = event.event_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  const pieChartData = Object.entries(conversionsByType).map(([type, count]) => ({
    name: type.replace('_', ' ').toUpperCase(),
    value: count,
  }));
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // Show error state if there was an error, not loading, and error is visible
  if (error && !isLoading && errorVisible) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Blog Analytics</h2>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error loading analytics</AlertTitle>
          <AlertDescription>
            There was a problem fetching the analytics data. Please try again later.
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => setErrorVisible(false)}
            >
              Show dashboard anyway
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Blog Analytics</h2>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Date range picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRangeText}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(selected) => {
                  if (selected?.from && selected?.to) {
                    setDateRange({
                      from: selected.from,
                      to: selected.to,
                    });
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {/* Refresh button */}
          <Button onClick={handleRefresh} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Page Views"
          value={pageViews.toString()}
          description="Total page views"
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        
        <MetricCard
          title="Unique Visitors"
          value={uniqueVisitors.toString()}
          description="Distinct visitors"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        
        <MetricCard
          title="Avg. Time on Page"
          value={`${timeOnPageAvg} sec`}
          description="Average time spent"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        
        <MetricCard
          title="Avg. Scroll Depth"
          value={`${scrollDepthAvg}%`}
          description="Average scroll percentage"
          icon={<MousePointerClick className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>
      
      <Tabs defaultValue="popular-posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="popular-posts">Popular Posts</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="popular-posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Posts</CardTitle>
              <CardDescription>Posts with the most page views</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              ) : popularPosts && popularPosts.length > 0 ? (
                <div className="space-y-8">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={popularPosts}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="title" 
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => value && value.length > 20 ? `${value.substring(0, 20)}...` : value}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [value, 'Views']}
                          labelFormatter={(label) => `Post: ${label}`}
                        />
                        <Legend />
                        <Bar 
                          dataKey="count" 
                          name="Views" 
                          fill="#8884d8"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Post Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {popularPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {post.title}
                            </a>
                          </TableCell>
                          <TableCell>{post.category || '—'}</TableCell>
                          <TableCell className="text-right">{post.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Events</CardTitle>
              <CardDescription>User actions and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : conversionEvents && conversionEvents.length > 0 ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} events`, '']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="flex flex-col justify-center space-y-4">
                      <div className="flex items-center p-4 bg-muted rounded-lg">
                        <Share2 className="h-5 w-5 mr-3 text-blue-500" />
                        <div>
                          <h4 className="font-medium">Shares</h4>
                          <p className="text-sm text-muted-foreground">
                            {conversionsByType['share'] || 0} post shares
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-muted rounded-lg">
                        <MailCheck className="h-5 w-5 mr-3 text-green-500" />
                        <div>
                          <h4 className="font-medium">Newsletter Signups</h4>
                          <p className="text-sm text-muted-foreground">
                            {conversionsByType['newsletter_signup'] || 0} subscribers
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-muted rounded-lg">
                        <MousePointerClick className="h-5 w-5 mr-3 text-orange-500" />
                        <div>
                          <h4 className="font-medium">Link Clicks</h4>
                          <p className="text-sm text-muted-foreground">
                            {conversionsByType['external_link_click'] || 0} external link clicks
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recent Conversion Events</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event Type</TableHead>
                          <TableHead>Page</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {conversionEvents.slice(0, 10).map((event) => {
                          if (!event || !event.event_type) {
                            return null;
                          }
                          
                          // Handle case where blog_analytics is null or undefined
                          const pagePath = event.blog_analytics?.page_path || 'Unknown';
                          
                          return (
                            <TableRow key={event.id}>
                              <TableCell className="font-medium">
                                {event.event_type.replace('_', ' ')}
                              </TableCell>
                              <TableCell>
                                {pagePath}
                              </TableCell>
                              <TableCell>
                                {format(new Date(event.event_timestamp), 'PPp')}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No conversion data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

function MetricCard({ title, value, description, icon, isLoading = false }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-1/2" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
