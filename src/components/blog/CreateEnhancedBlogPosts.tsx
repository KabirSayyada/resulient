
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createAllEnhancedBlogPosts, createCategoryEnhancedBlogPosts } from '@/utils/createEnhancedBlogPosts';
import { Badge } from '@/components/ui/badge';

export function CreateEnhancedBlogPosts() {
  const { user } = useAuth();
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleCreateAllPosts = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create blog posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoadingAll(true);
      
      const createdCount = await createAllEnhancedBlogPosts(user.id);
      
      if (createdCount > 0) {
        toast({
          title: "Success!",
          description: `Created ${createdCount} high-quality blog posts with enhanced SEO and formatting.`,
        });
        setIsComplete(true);
      } else {
        toast({
          title: "Note",
          description: "No new blog posts were created. They may already exist.",
        });
      }
    } catch (error) {
      console.error("Error creating enhanced blog posts:", error);
      toast({
        title: "Error",
        description: "Failed to create blog posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAll(false);
    }
  };

  const handleCreateResumePosts = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create blog posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoadingResume(true);
      
      const createdCount = await createCategoryEnhancedBlogPosts(user.id, ['resume-tips']);
      
      if (createdCount > 0) {
        toast({
          title: "Success!",
          description: `Created ${createdCount} resume tips blog posts with enhanced SEO and formatting.`,
        });
      } else {
        toast({
          title: "Note",
          description: "No new resume tips posts were created. They may already exist.",
        });
      }
    } catch (error) {
      console.error("Error creating resume tips posts:", error);
      toast({
        title: "Error",
        description: "Failed to create resume tips posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingResume(false);
    }
  };

  const handleCreateJobSearchPosts = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create blog posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoadingJob(true);
      
      const createdCount = await createCategoryEnhancedBlogPosts(user.id, ['job-search-strategy']);
      
      if (createdCount > 0) {
        toast({
          title: "Success!",
          description: `Created ${createdCount} job search strategy blog posts with enhanced SEO and formatting.`,
        });
      } else {
        toast({
          title: "Note",
          description: "No new job search strategy posts were created. They may already exist.",
        });
      }
    } catch (error) {
      console.error("Error creating job search posts:", error);
      toast({
        title: "Error",
        description: "Failed to create job search strategy posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingJob(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary/5">
        <Badge variant="outline" className="w-fit mb-2 bg-primary/10 border-primary/20 text-primary">Premium Content</Badge>
        <CardTitle>Create Enhanced Blog Content</CardTitle>
        <CardDescription>
          Add high-quality, SEO-optimized content with improved formatting and visuals
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Create a complete set of professionally written blog posts with enhanced formatting, 
                beautiful images, proper heading structure, and SEO optimization. These premium posts include:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Resume tips with achievement examples and templates</li>
                <li>Powerful action verbs with industry-specific suggestions</li>
                <li>Optimal resume length guidelines by career level</li>
                <li>Behavioral interview STAR method examples</li>
                <li>Modern networking strategies for career advancement</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="space-y-6">
              <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                <div>
                  <h3 className="text-base font-medium mb-2">Resume Tips (3 posts)</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Comprehensive, visually-enhanced guides on resume accomplishments, action verbs, and optimal resume length
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-xs">Powerful Accomplishment Statements That Will Transform Your Resume</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-xs">185+ Powerful Resume Action Verbs That Will Get You Hired</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-xs">Optimal Resume Length: How Many Pages Is Best for Your Career Level?</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleCreateResumePosts} 
                  disabled={isLoadingResume || isLoadingAll}
                  size="sm"
                  className="w-full"
                  variant="outline"
                >
                  {isLoadingResume ? "Creating..." : "Create Resume Tips Posts"}
                </Button>
              </div>
              
              <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                <div>
                  <h3 className="text-base font-medium mb-2">Job Search Strategy (2 posts)</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    In-depth guides on behavioral interview techniques and modern networking strategies
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-xs">Mastering Behavioral Interviews: The Ultimate STAR Method Guide</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-xs">12 Modern Networking Strategies to Land Your Dream Job</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleCreateJobSearchPosts} 
                  disabled={isLoadingJob || isLoadingAll}
                  size="sm"
                  className="w-full"
                  variant="outline"
                >
                  {isLoadingJob ? "Creating..." : "Create Job Search Strategy Posts"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-muted/10 border-t flex flex-col sm:flex-row gap-4 sm:gap-0">
        <Button 
          onClick={handleCreateAllPosts} 
          disabled={isLoadingAll || isLoadingResume || isLoadingJob || isComplete}
          className="w-full"
          variant="default"
        >
          {isLoadingAll 
            ? "Creating All Enhanced Posts..." 
            : isComplete 
              ? "All Enhanced Posts Created" 
              : "Create All Enhanced Blog Posts"}
        </Button>
      </CardFooter>
    </Card>
  );
}
