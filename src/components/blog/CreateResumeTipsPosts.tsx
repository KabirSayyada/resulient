
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createResumeATSTipsPost, createResumeCommonMistakesPost, createResumeActionVerbsPost, createResumeSkillsPost, createResumeFormatsPost, createAllResumeTipsPosts } from '@/utils/createResumeTipsPosts';

export function CreateResumeTipsPosts() {
  const [isLoadingAts, setIsLoadingAts] = useState(false);
  const [isLoadingMistakes, setIsLoadingMistakes] = useState(false);
  const [isLoadingVerbs, setIsLoadingVerbs] = useState(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [isLoadingFormats, setIsLoadingFormats] = useState(false);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateResumeATSTipsPost = async () => {
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
      console.error("Error creating resume ATS tips post:", error);
      toast({
        title: "Error",
        description: "Failed to create resume ATS tips post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAts(false);
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
    
    setIsLoadingMistakes(true);
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
      setIsLoadingMistakes(false);
    }
  };

  const handleCreateResumeActionVerbsPost = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingVerbs(true);
    try {
      const result = await createResumeActionVerbsPost(user.id);
      if (result) {
        toast({
          title: "Success",
          description: "Resume action verbs post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "Resume action verbs post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating resume action verbs post:", error);
      toast({
        title: "Error",
        description: "Failed to create resume action verbs post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingVerbs(false);
    }
  };

  const handleCreateResumeSkillsPost = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingSkills(true);
    try {
      const result = await createResumeSkillsPost(user.id);
      if (result) {
        toast({
          title: "Success",
          description: "Resume skills post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "Resume skills post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating resume skills post:", error);
      toast({
        title: "Error",
        description: "Failed to create resume skills post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSkills(false);
    }
  };

  const handleCreateResumeFormatsPost = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingFormats(true);
    try {
      const result = await createResumeFormatsPost(user.id);
      if (result) {
        toast({
          title: "Success",
          description: "Resume formats post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "Resume formats post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating resume formats post:", error);
      toast({
        title: "Error",
        description: "Failed to create resume formats post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFormats(false);
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
    
    setIsLoadingAll(true);
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
      setIsLoadingAll(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Tips Blog Posts</CardTitle>
        <CardDescription>
          Create professional, SEO-optimized resume tips content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Create all resume tips posts at once
          </p>
          <Button 
            onClick={handleCreateAllResumeTipsPosts} 
            disabled={isLoadingAll || isLoadingAts || isLoadingMistakes || isLoadingVerbs || isLoadingSkills || isLoadingFormats}
            className="w-full"
          >
            {isLoadingAll ? "Creating All Posts..." : "Create All Resume Tips Posts"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <Button 
            onClick={handleCreateResumeATSTipsPost} 
            disabled={isLoadingAts || isLoadingAll}
            variant="outline"
            className="w-full"
          >
            {isLoadingAts ? "Creating..." : "Create ATS Tips Post"}
          </Button>
          
          <Button 
            onClick={handleCreateResumeCommonMistakesPost} 
            disabled={isLoadingMistakes || isLoadingAll}
            variant="outline"
            className="w-full"
          >
            {isLoadingMistakes ? "Creating..." : "Create Resume Mistakes Post"}
          </Button>
          
          <Button 
            onClick={handleCreateResumeActionVerbsPost} 
            disabled={isLoadingVerbs || isLoadingAll}
            variant="outline"
            className="w-full"
          >
            {isLoadingVerbs ? "Creating..." : "Create Action Verbs Post"}
          </Button>
          
          <Button 
            onClick={handleCreateResumeSkillsPost} 
            disabled={isLoadingSkills || isLoadingAll}
            variant="outline"
            className="w-full"
          >
            {isLoadingSkills ? "Creating..." : "Create Resume Skills Post"}
          </Button>
          
          <Button 
            onClick={handleCreateResumeFormatsPost} 
            disabled={isLoadingFormats || isLoadingAll}
            variant="outline"
            className="w-full"
          >
            {isLoadingFormats ? "Creating..." : "Create Resume Formats Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
