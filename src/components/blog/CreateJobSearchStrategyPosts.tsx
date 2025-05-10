
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  createNetworkingForJobSearchPost, 
  createOnlinePresencePost, 
  createInterviewPrepPost, 
  createJobApplicationTrackingPost, 
  createSalaryNegotiationPost,
  createAllJobSearchStrategyPosts
} from '@/utils/createJobSearchStrategyPosts';

export function CreateJobSearchStrategyPosts() {
  const [isLoadingNetworking, setIsLoadingNetworking] = useState(false);
  const [isLoadingOnlinePresence, setIsLoadingOnlinePresence] = useState(false);
  const [isLoadingInterview, setIsLoadingInterview] = useState(false);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);
  const [isLoadingNegotiation, setIsLoadingNegotiation] = useState(false);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateNetworkingPost = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingNetworking(true);
    try {
      const result = await createNetworkingForJobSearchPost(user.id);
      if (result) {
        toast({
          title: "Success",
          description: "Networking strategies post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "Networking strategies post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating networking strategies post:", error);
      toast({
        title: "Error",
        description: "Failed to create networking strategies post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingNetworking(false);
    }
  };

  const handleCreateOnlinePresencePost = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingOnlinePresence(true);
    try {
      const result = await createOnlinePresencePost(user.id);
      if (result) {
        toast({
          title: "Success",
          description: "Online presence post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "Online presence post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating online presence post:", error);
      toast({
        title: "Error",
        description: "Failed to create online presence post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOnlinePresence(false);
    }
  };

  const handleCreateInterviewPrepPost = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingInterview(true);
    try {
      const result = await createInterviewPrepPost(user.id);
      if (result) {
        toast({
          title: "Success",
          description: "Interview preparation post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "Interview preparation post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating interview preparation post:", error);
      toast({
        title: "Error",
        description: "Failed to create interview preparation post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingInterview(false);
    }
  };

  const handleCreateJobApplicationTrackingPost = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingTracking(true);
    try {
      const result = await createJobApplicationTrackingPost(user.id);
      if (result) {
        toast({
          title: "Success",
          description: "Job application tracking post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "Job application tracking post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating job application tracking post:", error);
      toast({
        title: "Error",
        description: "Failed to create job application tracking post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTracking(false);
    }
  };

  const handleCreateSalaryNegotiationPost = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingNegotiation(true);
    try {
      const result = await createSalaryNegotiationPost(user.id);
      if (result) {
        toast({
          title: "Success",
          description: "Salary negotiation post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "Salary negotiation post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating salary negotiation post:", error);
      toast({
        title: "Error",
        description: "Failed to create salary negotiation post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingNegotiation(false);
    }
  };

  const handleCreateAllJobSearchStrategyPosts = async () => {
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
      const createdCount = await createAllJobSearchStrategyPosts(user.id);
      if (createdCount > 0) {
        toast({
          title: "Success",
          description: `Created ${createdCount} job search strategy blog posts successfully`,
        });
      } else {
        toast({
          title: "Note",
          description: "All job search strategy blog posts already exist",
        });
      }
    } catch (error) {
      console.error("Error creating job search strategy posts:", error);
      toast({
        title: "Error",
        description: "Failed to create job search strategy posts",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAll(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Search Strategy Blog Posts</CardTitle>
        <CardDescription>
          Create professional, SEO-optimized job search content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Create all job search strategy posts at once
          </p>
          <Button 
            onClick={handleCreateAllJobSearchStrategyPosts} 
            disabled={isLoadingAll || isLoadingNetworking || isLoadingOnlinePresence || isLoadingInterview || isLoadingTracking || isLoadingNegotiation}
            className="w-full"
          >
            {isLoadingAll ? "Creating All Posts..." : "Create All Job Search Strategy Posts"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <Button 
            onClick={handleCreateNetworkingPost} 
            disabled={isLoadingNetworking || isLoadingAll}
            variant="outline"
            className="w-full"
          >
            {isLoadingNetworking ? "Creating..." : "Create Networking Strategies Post"}
          </Button>
          
          <Button 
            onClick={handleCreateOnlinePresencePost} 
            disabled={isLoadingOnlinePresence || isLoadingAll}
            variant="outline"
            className="w-full"
          >
            {isLoadingOnlinePresence ? "Creating..." : "Create Online Presence Post"}
          </Button>
          
          <Button 
            onClick={handleCreateInterviewPrepPost} 
            disabled={isLoadingInterview || isLoadingAll}
            variant="outline"
            className="w-full"
          >
            {isLoadingInterview ? "Creating..." : "Create Interview Preparation Post"}
          </Button>
          
          <Button 
            onClick={handleCreateJobApplicationTrackingPost} 
            disabled={isLoadingTracking || isLoadingAll}
            variant="outline"
            className="w-full"
          >
            {isLoadingTracking ? "Creating..." : "Create Job Tracking Post"}
          </Button>
          
          <Button 
            onClick={handleCreateSalaryNegotiationPost} 
            disabled={isLoadingNegotiation || isLoadingAll}
            variant="outline"
            className="w-full"
          >
            {isLoadingNegotiation ? "Creating..." : "Create Salary Negotiation Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
