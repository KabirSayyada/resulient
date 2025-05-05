import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { initializeBlogContent } from "@/utils/blogInitializer";
import { createAtsBlogPost } from "@/data/createAtsBlogPost";
import { createCareerBlogPost } from "@/utils/createCareerBlogPost";
import { createJobSearchPost } from "@/utils/createJobSearchPost";
import { createResumeATSTipsPost, createResumeCommonMistakesPost, createAllResumeTipsPosts } from "@/utils/createResumeTipsPosts";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function BlogInitialization() {
  const [isLoadingDefault, setIsLoadingDefault] = useState(false);
  const [isLoadingAts, setIsLoadingAts] = useState(false);
  const [isLoadingCareer, setIsLoadingCareer] = useState(false);
  const [isLoadingJobSearch, setIsLoadingJobSearch] = useState(false);
  const [isLoadingResumeTips1, setIsLoadingResumeTips1] = useState(false);
  const [isLoadingResumeTips2, setIsLoadingResumeTips2] = useState(false);
  const [isLoadingAllResumeTips, setIsLoadingAllResumeTips] = useState(false);
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

  const handleCreateResumeATSTipsPost = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingResumeTips1(true);
    try {
      const result = await createResumeATSTipsPost(user.id);
      if (result) {
        toast({
          title: "Success",
          description: "Resume ATS tips post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "Resume ATS tips post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating resume tips post:", error);
      toast({
        title: "Error",
        description: "Failed to create resume tips post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingResumeTips1(false);
    }
  };

  const handleCreateResumeCommonMistakesPost = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingResumeTips2(true);
    try {
      const result = await createResumeCommonMistakesPost(user.id);
      if (result) {
        toast({
          title: "Success",
          description: "Resume mistakes post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "Resume mistakes post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating resume mistakes post:", error);
      toast({
        title: "Error",
        description: "Failed to create resume mistakes post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingResumeTips2(false);
    }
  };

  const handleCreateAllResumeTipsPosts = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create blog posts",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingAllResumeTips(true);
    try {
      const createdCount = await createAllResumeTipsPosts(user.id);
      if (createdCount > 0) {
        toast({
          title: "Success",
          description: `Created ${createdCount} resume tips blog posts successfully`,
        });
      } else {
        toast({
          title: "Note",
          description: "All resume tips blog posts already exist",
        });
      }
    } catch (error) {
      console.error("Error creating resume tips posts:", error);
      toast({
        title: "Error",
        description: "Failed to create resume tips posts",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAllResumeTips(false);
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
        createJobSearchPost(userId),
        createResumeATSTipsPost(userId),
        createResumeCommonMistakesPost(userId)
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
            disabled={isLoadingAll || isLoadingAts || isLoadingCareer || isLoadingJobSearch || isLoadingResumeTips1 || isLoadingResumeTips2 || isLoadingAllResumeTips}
            variant="secondary"
            className="w-full"
          >
            {isLoadingAll ? "Creating..." : "Create All Sample Posts"}
          </Button>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Create resume optimization posts
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button 
              onClick={handleCreateResumeATSTipsPost} 
              disabled={isLoadingResumeTips1 || isLoadingAll || isLoadingAllResumeTips}
              variant="outline"
              className="w-full"
            >
              {isLoadingResumeTips1 ? "Creating..." : "Create ATS Tips Post"}
            </Button>
            <Button 
              onClick={handleCreateResumeCommonMistakesPost} 
              disabled={isLoadingResumeTips2 || isLoadingAll || isLoadingAllResumeTips}
              variant="outline"
              className="w-full"
            >
              {isLoadingResumeTips2 ? "Creating..." : "Create Resume Mistakes Post"}
            </Button>
          </div>
          <div className="mt-2">
            <Button 
              onClick={handleCreateAllResumeTipsPosts} 
              disabled={isLoadingAllResumeTips || isLoadingResumeTips1 || isLoadingResumeTips2 || isLoadingAll}
              variant="outline"
              className="w-full"
            >
              {isLoadingAllResumeTips ? "Creating..." : "Create All Resume Tips Posts"}
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Create other career-related posts
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button 
              onClick={handleCreateAtsBlogPost} 
              disabled={isLoadingAts || isLoadingAll}
              variant="outline"
              className="w-full"
            >
              {isLoadingAts ? "Creating..." : "Create ATS Sample Post"}
            </Button>
            
            <Button 
              onClick={handleCreateCareerBlogPost} 
              disabled={isLoadingCareer || isLoadingAll}
              variant="outline"
              className="w-full"
            >
              {isLoadingCareer ? "Creating..." : "Create Career Sample Post"}
            </Button>
          </div>
          <div className="mt-2">
            <Button 
              onClick={handleCreateJobSearchPost} 
              disabled={isLoadingJobSearch || isLoadingAll}
              variant="outline"
              className="w-full"
            >
              {isLoadingJobSearch ? "Creating..." : "Create Job Search Post"}
            </Button>
          </div>
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
