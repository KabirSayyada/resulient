import { useState } from "react";
import { useWizard } from "../WizardContainer";
import { NavigationControls } from "../NavigationControls";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Code, Award, Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SkillsStep = () => {
  const { formData, updateFormData, goToNextStep } = useWizard();
  const [skills, setSkills] = useState(formData.skills || "");
  const [achievements, setAchievements] = useState(formData.achievements || "");

  const handleNext = () => {
    updateFormData({ skills, achievements });
    goToNextStep();
  };

  const isValid = skills.trim().length > 10;

  return (
    <div className="min-h-[calc(100vh-200px)] py-8">
      <div className="container max-w-3xl mx-auto px-4 space-y-6 animate-in fade-in slide-in-from-right duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary/10 rounded-full mb-2">
            <Code className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Skills & Achievements</h2>
          <p className="text-muted-foreground">
            Showcase your technical skills, soft skills, and notable achievements
          </p>
        </div>

        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="skills" className="gap-2">
              <Code className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Award className="h-4 w-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-4">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Your Skills</CardTitle>
                <CardDescription>
                  List your technical skills, tools, and soft skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-info/10 border-info/20">
                  <Lightbulb className="h-4 w-4 text-info" />
                  <AlertDescription>
                    <strong>Pro tip:</strong> Group skills by category (e.g., "Programming Languages: JavaScript, Python, Java")
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Label htmlFor="skills" className="text-base font-medium">
                    Technical & Soft Skills
                  </Label>
                  <Textarea
                    id="skills"
                    placeholder="Example: Programming Languages: JavaScript, Python, React, Node.js. Tools: AWS, Docker, Git, Jira. Soft Skills: Team leadership, project management, cross-functional collaboration, public speaking. Certifications: AWS Solutions Architect, PMP."
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    rows={8}
                    className="resize-none text-base"
                  />
                  <div className="text-sm">
                    <span className={`${skills.length < 10 ? 'text-destructive' : 'text-success'}`}>
                      {skills.length < 10 ? 'Add more details about your skills' : '✓ Looks comprehensive'}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium">Suggested Categories:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Technical skills (programming languages, frameworks)</li>
                    <li>Tools and platforms (software, cloud services)</li>
                    <li>Soft skills (leadership, communication)</li>
                    <li>Certifications and credentials</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Notable Achievements</CardTitle>
                <CardDescription>
                  Awards, recognitions, and career highlights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-info/10 border-info/20">
                  <Lightbulb className="h-4 w-4 text-info" />
                  <AlertDescription>
                    <strong>Pro tip:</strong> Include specific metrics and recognition. This is your chance to stand out!
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Label htmlFor="achievements" className="text-base font-medium">
                    Your Achievements (Optional)
                  </Label>
                  <Textarea
                    id="achievements"
                    placeholder="Example: Employee of the Year 2022 at Google. Increased team productivity by 50% through process improvements. Published 3 technical articles on Medium with 10K+ views. Spoke at 2 industry conferences. Mentored 5 junior developers to promotion."
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    rows={8}
                    className="resize-none text-base"
                  />
                  <p className="text-sm text-muted-foreground">
                    Leave blank if you prefer to include achievements within your work experience
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium">Examples of Achievements:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Awards and recognitions</li>
                    <li>Publications and speaking engagements</li>
                    <li>Major project successes</li>
                    <li>Mentorship and leadership impact</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <NavigationControls
          onNext={handleNext}
          nextLabel="Choose Your Style"
          nextDisabled={!isValid}
        />
      </div>
    </div>
  );
};
