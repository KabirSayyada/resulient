
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const sampleJobs = [
  {
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120,000 - $180,000",
    type: "Full-time",
    description: "We're looking for a senior software engineer to join our growing team. You'll work on cutting-edge technology and help build the next generation of our platform.",
    requirements: "5+ years of experience with React, TypeScript, and Node.js. Experience with cloud platforms preferred.",
    tags: ["React", "TypeScript", "Node.js", "AWS"],
    external_url: "https://example.com/apply"
  },
  {
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    salary: "$100,000 - $140,000",
    type: "Full-time",
    description: "Lead product development initiatives and work cross-functionally with engineering, design, and marketing teams.",
    requirements: "3+ years of product management experience. Strong analytical skills and experience with product analytics tools.",
    tags: ["Product Strategy", "Analytics", "Agile", "Leadership"],
    external_url: "https://example.com/apply"
  },
  {
    title: "UX Designer",
    company: "DesignStudio",
    location: "Remote",
    salary: "$80,000 - $120,000",
    type: "Full-time",
    description: "Create user-centered designs for web and mobile applications. Collaborate with product managers and developers to deliver exceptional user experiences.",
    requirements: "3+ years of UX/UI design experience. Proficiency in Figma and user research methodologies.",
    tags: ["Figma", "User Research", "Prototyping", "Mobile Design"],
    external_url: "https://example.com/apply"
  }
];

export function JobSeeder() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const seedJobs = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('jobs')
        .insert(sampleJobs);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Sample jobs have been added successfully!",
      });
    } catch (error) {
      console.error('Error seeding jobs:', error);
      toast({
        title: "Error",
        description: "Failed to add sample jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
      <h3 className="text-lg font-medium mb-2">Add Sample Jobs</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Click the button below to add some sample job listings to the database for testing.
      </p>
      <Button onClick={seedJobs} disabled={loading}>
        {loading ? "Adding Jobs..." : "Add Sample Jobs"}
      </Button>
    </div>
  );
}
