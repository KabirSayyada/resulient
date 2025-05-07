
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createAllEnhancedBlogPosts } from '@/utils/createEnhancedBlogPosts';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export function CreateEnhancedBlogPosts() {
  const [isCreating, setIsCreating] = useState(false);
  const [createdCount, setCreatedCount] = useState<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreatePosts = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create blog posts.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsCreating(true);
      const count = await createAllEnhancedBlogPosts(user.id);
      setCreatedCount(count);
      
      toast({
        title: 'Success!',
        description: `Created ${count} new enhanced blog posts.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Error creating enhanced blog posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to create enhanced blog posts. Check console for details.',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Create Enhanced SEO-Optimized Blog Posts</CardTitle>
        <CardDescription>
          Generate 5 professionally styled blog posts with SEO optimization, proper formatting, and calls-to-action
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Resume Tips Category (3 Posts)</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Powerful Accomplishment Statements That Transform Your Resume</li>
                <li>ATS Resume Optimization Strategies for 2025</li>
                <li>Writing Powerful Professional Summaries That Get Interviews</li>
              </ul>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Job Search Category (2 Posts)</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Strategic Networking for Job Search Success</li>
                <li>Salary Negotiation Strategies: How to Maximize Your Job Offer</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              {createdCount !== null && (
                <p className="text-sm text-muted-foreground">
                  {createdCount} new blog posts created successfully
                </p>
              )}
            </div>
            <Button 
              onClick={handleCreatePosts} 
              disabled={isCreating}
              className="relative"
            >
              {isCreating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Enhanced Blog Posts
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
