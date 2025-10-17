import { useWizard } from "../WizardContainer";
import { NavigationControls } from "../NavigationControls";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const templates = [
  { id: "modern", name: "Modern", description: "Clean and contemporary", recommended: true },
  { id: "professional", name: "Professional", description: "Traditional business style" },
  { id: "creative", name: "Creative", description: "Stand out with style" },
  { id: "minimal", name: "Minimal", description: "Less is more" },
  { id: "executive", name: "Executive", description: "For senior positions" },
  { id: "tech", name: "Tech", description: "For technical roles" }
];

const colorSchemes = [
  { id: "blue", name: "Professional Blue", color: "bg-blue-500", recommended: true },
  { id: "emerald", name: "Success Green", color: "bg-emerald-500" },
  { id: "purple", name: "Creative Purple", color: "bg-purple-500" },
  { id: "slate", name: "Neutral Gray", color: "bg-slate-500" },
  { id: "orange", name: "Energetic Orange", color: "bg-orange-500" },
  { id: "rose", name: "Modern Rose", color: "bg-rose-500" }
];

export const StyleSelectionStep = () => {
  const { selectedTemplate, selectedColor, setSelectedTemplate, setSelectedColor } = useWizard();

  return (
    <div className="min-h-[calc(100vh-200px)] py-8">
      <div className="container max-w-4xl mx-auto px-4 space-y-8 animate-in fade-in slide-in-from-right duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary/10 rounded-full mb-2">
            <Palette className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Choose Your Style</h2>
          <p className="text-muted-foreground">
            Select a template and color scheme. All templates are ATS-optimized.
          </p>
        </div>

        <div className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Template</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {templates.map((template, index) => (
                <Card
                  key={template.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg",
                    selectedTemplate === template.id && "ring-2 ring-primary shadow-lg scale-105",
                    "animate-in zoom-in"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="h-16 w-full bg-gradient-to-br from-muted to-muted/50 rounded" />
                      {selectedTemplate === template.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary absolute top-2 right-2" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        {template.recommended && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Color Scheme Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Color Scheme</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {colorSchemes.map((scheme, index) => (
                <Card
                  key={scheme.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg",
                    selectedColor === scheme.id && "ring-2 ring-primary shadow-lg scale-105",
                    "animate-in zoom-in"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedColor(scheme.id)}
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-12 w-12 rounded-full", scheme.color)} />
                      {selectedColor === scheme.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{scheme.name}</h4>
                        {scheme.recommended && (
                          <Badge variant="secondary" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <p className="text-sm text-center">
            <strong>All templates are ATS-friendly</strong> - Formatting won't affect your resume's readability by applicant tracking systems
          </p>
        </div>

        <NavigationControls nextLabel="Review & Generate" />
      </div>
    </div>
  );
};
