
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { createInterviewPrepPosts } from '@/utils/createInterviewPrepPosts';
import { Loader2 } from 'lucide-react';

export function CreateInterviewPrepPosts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePosts = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create blog posts.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const result = await createInterviewPrepPosts(user.id);
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "Interview preparation blog posts have been created.",
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create interview preparation blog posts.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating interview preparation posts:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button 
      onClick={handleCreatePosts} 
      disabled={isCreating}
      className="w-full"
    >
      {isCreating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Posts...
        </>
      ) : (
        "Create Interview Prep Posts"
      )}
    </Button>
  );
}
