
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { initializeBlogContent } from "@/utils/blogInitializer";
import { createAtsBlogPost } from "@/data/createAtsBlogPost";
import { createCareerBlogPost } from "@/utils/createCareerBlogPost";
import { createJobSearchPost } from "@/utils/createJobSearchPost";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function BlogInitialization() {
  const [isLoadingDefault, setIsLoadingDefault] = useState(false);
  const [isLoadingAts, setIsLoadingAts] = useState(false);
  const [isLoadingCareer, setIsLoadingCareer] = useState(false);
  const [isLoadingJobSearch, setIsLoadingJobSearch] = useState(false);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInitializeBlog = async () => {
    setIsLoadingDefault(true);
    try {
      await initializeBlogContent();
      toast({
        title: "Success",
        description: "Blog initialized with default data",
      });
    } catch (error) {
      console.error("Error initializing blog data:", error);
      toast({
        title: "Error",
        description: "Failed to initialize blog data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDefault(false);
    }
  };

  const handleCreateAtsBlogPost = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingAts(true);
    try {
      const result = await createAtsBlogPost(user.id);
      if (result) {
        toast({
          title: "Success",
          description: "ATS blog post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "ATS blog post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating ATS blog post:", error);
      toast({
        title: "Error",
        description: "Failed to create ATS blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAts(false);
    }
  };

  const handleCreateCareerBlogPost = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingCareer(true);
    try {
      const result = await createCareerBlogPost(user.id);
      if (result) {
        toast({
          title: "Success",
          description: "Career development blog post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "Career development blog post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating career blog post:", error);
      toast({
        title: "Error",
        description: "Failed to create career blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCareer(false);
    }
  };

  const handleCreateJobSearchPost = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingJobSearch(true);
    try {
      const result = await createJobSearchPost(user.id);
      if (result) {
        toast({
          title: "Success",
          description: "Job search strategy post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "Job search strategy post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating job search post:", error);
      toast({
        title: "Error",
        description: "Failed to create job search post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingJobSearch(false);
    }
  };

  const handleCreateAllPosts = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create blog posts",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingAll(true);
    try {
      const userId = user.id;
      
      // Create all posts in parallel
      const results = await Promise.all([
        createAtsBlogPost(userId),
        createCareerBlogPost(userId),
        createJobSearchPost(userId)
      ]);
      
      const createdCount = results.filter(result => result !== null).length;
      
      if (createdCount > 0) {
        toast({
          title: "Success",
          description: `Created ${createdCount} blog posts successfully`,
        });
      } else {
        toast({
          title: "Note",
          description: "All blog posts already exist",
        });
      }
    } catch (error) {
      console.error("Error creating all blog posts:", error);
      toast({
        title: "Error",
        description: "Failed to create all blog posts",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAll(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Management</CardTitle>
        <CardDescription>
          Initialize your blog with sample data or create individual sample posts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Create initial blog categories and demo data
          </p>
          <Button 
            onClick={handleInitializeBlog} 
            disabled={isLoadingDefault}
            className="w-full"
          >
            {isLoadingDefault ? "Initializing..." : "Initialize Blog"}
          </Button>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Create all sample blog posts at once
          </p>
          <Button 
            onClick={handleCreateAllPosts} 
            disabled={isLoadingAll || isLoadingAts || isLoadingCareer || isLoadingJobSearch}
            variant="secondary"
            className="w-full"
          >
            {isLoadingAll ? "Creating..." : "Create All Sample Posts"}
          </Button>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Create sample ATS blog post
          </p>
          <Button 
            onClick={handleCreateAtsBlogPost} 
            disabled={isLoadingAts || isLoadingAll}
            variant="outline"
            className="w-full"
          >
            {isLoadingAts ? "Creating..." : "Create ATS Sample Post"}
          </Button>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Create career development blog post
          </p>
          <Button 
            onClick={handleCreateCareerBlogPost} 
            disabled={isLoadingCareer || isLoadingAll}
            variant="outline"
            className="w-full"
          >
            {isLoadingCareer ? "Creating..." : "Create Career Sample Post"}
          </Button>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Create job search strategy blog post
          </p>
          <Button 
            onClick={handleCreateJobSearchPost} 
            disabled={isLoadingJobSearch || isLoadingAll}
            variant="outline"
            className="w-full"
          >
            {isLoadingJobSearch ? "Creating..." : "Create Job Search Post"}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Note: Initializing will not overwrite existing data
        </p>
      </CardFooter>
    </Card>
  );
}
