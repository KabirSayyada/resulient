
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
import { 
  createMultipleBlogPosts, 
  createCareerDevelopmentPosts, 
  createInterviewPreparationPosts 
} from '@/utils/blogPostCreator';
import { createAdvancedCareerPosts } from '@/utils/createAdvancedCareerPosts';

export function CreateNewBlogPosts() {
  const { user } = useAuth();
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [isLoadingCareer, setIsLoadingCareer] = useState(false);
  const [isLoadingInterview, setIsLoadingInterview] = useState(false);
  const [isLoadingAdvanced, setIsLoadingAdvanced] = useState(false);
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
      
      const createdCount = await createMultipleBlogPosts(user.id);
      
      if (createdCount > 0) {
        toast({
          title: "Success!",
          description: `Created ${createdCount} high-quality blog posts.`,
        });
        setIsComplete(true);
      } else {
        toast({
          title: "Note",
          description: "No new blog posts were created. They may already exist.",
        });
      }
    } catch (error) {
      console.error("Error creating blog posts:", error);
      toast({
        title: "Error",
        description: "Failed to create blog posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAll(false);
    }
  };

  const handleCreateCareerPosts = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create blog posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoadingCareer(true);
      
      const createdCount = await createCareerDevelopmentPosts(user.id);
      
      if (createdCount > 0) {
        toast({
          title: "Success!",
          description: `Created ${createdCount} career development blog posts.`,
        });
      } else {
        toast({
          title: "Note",
          description: "No new career posts were created. They may already exist.",
        });
      }
    } catch (error) {
      console.error("Error creating career posts:", error);
      toast({
        title: "Error",
        description: "Failed to create career posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCareer(false);
    }
  };

  const handleCreateInterviewPosts = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create blog posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoadingInterview(true);
      
      const createdCount = await createInterviewPreparationPosts(user.id);
      
      if (createdCount > 0) {
        toast({
          title: "Success!",
          description: `Created ${createdCount} interview preparation blog posts.`,
        });
      } else {
        toast({
          title: "Note",
          description: "No new interview posts were created. They may already exist.",
        });
      }
    } catch (error) {
      console.error("Error creating interview posts:", error);
      toast({
        title: "Error",
        description: "Failed to create interview posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingInterview(false);
    }
  };

  const handleCreateAdvancedCareerPosts = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create blog posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoadingAdvanced(true);
      
      const createdCount = await createAdvancedCareerPosts(user.id);
      
      if (createdCount > 0) {
        toast({
          title: "Success!",
          description: `Created ${createdCount} advanced career development blog posts.`,
        });
      } else {
        toast({
          title: "Note",
          description: "No new advanced career posts were created. They may already exist.",
        });
      }
    } catch (error) {
      console.error("Error creating advanced career posts:", error);
      toast({
        title: "Error",
        description: "Failed to create advanced career posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAdvanced(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Professional Blog Content</CardTitle>
        <CardDescription>
          Add high-quality, SEO-optimized content to your blog
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Posts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Create a complete set of professionally written blog posts about resume optimization, 
                interview preparation, and career development. These SEO-optimized posts include:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Career roadmap planning guidance</li>
                <li>Digital networking strategies</li>
                <li>Industry transition techniques</li>
                <li>STAR method interview responses</li>
                <li>Technical interview preparation</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Career Development</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Three comprehensive posts on career planning, networking, and industry transitions
                </p>
                <Button 
                  onClick={handleCreateCareerPosts} 
                  disabled={isLoadingCareer || isLoadingAll}
                  size="sm"
                  className="w-full"
                  variant="outline"
                >
                  {isLoadingCareer ? "Creating..." : "Create Career Development Posts"}
                </Button>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Interview Preparation</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Two detailed posts on STAR method and technical interview success
                </p>
                <Button 
                  onClick={handleCreateInterviewPosts} 
                  disabled={isLoadingInterview || isLoadingAll}
                  size="sm"
                  className="w-full"
                  variant="outline"
                >
                  {isLoadingInterview ? "Creating..." : "Create Interview Preparation Posts"}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Advanced Career Development</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Five high-quality, SEO-optimized posts on career growth strategies, work-life balance, 
                  professional relationships, overcoming plateaus, and future-proofing your career.
                </p>
                <Button 
                  onClick={handleCreateAdvancedCareerPosts} 
                  disabled={isLoadingAdvanced}
                  size="sm"
                  className="w-full"
                  variant="secondary"
                >
                  {isLoadingAdvanced ? "Creating..." : "Create Advanced Career Posts"}
                </Button>
              </div>
              
              <div className="p-3 bg-muted rounded-md mt-3">
                <h4 className="text-xs font-semibold mb-2">Posts included:</h4>
                <ul className="list-disc pl-4 text-xs space-y-1 text-muted-foreground">
                  <li>Career Growth Strategies for 2024 and Beyond</li>
                  <li>Mastering Work-Life Balance in High-Pressure Careers</li>
                  <li>Building Professional Relationships That Advance Your Career</li>
                  <li>Overcoming Career Plateaus: Strategies for Getting Unstuck</li>
                  <li>Future-Proof Your Career Path in a Rapidly Changing Job Market</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreateAllPosts} 
          disabled={isLoadingAll || isLoadingCareer || isLoadingInterview || isComplete}
          className="w-full"
        >
          {isLoadingAll 
            ? "Creating All Posts..." 
            : isComplete 
              ? "All Posts Created" 
              : "Create All Blog Posts"}
        </Button>
      </CardFooter>
    </Card>
  );
}
