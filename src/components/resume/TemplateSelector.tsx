
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Download, Star, Crown, Check } from 'lucide-react';
import { RESUME_TEMPLATES, getFreeTemplates, getPremiumTemplates, getTemplatesByCategory } from '@/data/resumeTemplates';
import { TemplateConfig } from '@/types/resumeTemplate';
import { ParsedResume } from '@/types/resumeStructure';
import { ProfessionalClassicTemplateComponent } from './templates/ProfessionalClassicTemplate';

interface TemplateSelectorProps {
  resume: ParsedResume;
  onTemplateSelect: (templateId: string) => void;
  selectedTemplateId?: string;
  userTier: 'free' | 'premium' | 'platinum';
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  resume,
  onTemplateSelect,
  selectedTemplateId,
  userTier
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<TemplateConfig | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const canAccessTemplate = (template: TemplateConfig): boolean => {
    if (!template.metadata.isPremium) return true;
    return userTier === 'premium' || userTier === 'platinum';
  };

  const getFilteredTemplates = (): TemplateConfig[] => {
    let templates = RESUME_TEMPLATES;
    
    if (activeCategory !== 'all') {
      templates = getTemplatesByCategory(activeCategory);
    }
    
    return templates;
  };

  const renderTemplatePreview = (template: TemplateConfig) => {
    // For now, only Professional Classic has a React component
    if (template.metadata.id === 'professional-classic') {
      return <ProfessionalClassicTemplateComponent resume={resume} />;
    }
    
    // Placeholder for other templates
    return (
      <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-gray-600 dark:text-gray-400">
            {template.metadata.name} Preview
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Full preview coming soon
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Resume Template</h2>
        <p className="text-muted-foreground">
          Select a professional template that matches your industry and style
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="modern">Modern</TabsTrigger>
          <TabsTrigger value="executive">Executive</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="creative">Creative</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredTemplates().map((template) => (
              <Card 
                key={template.metadata.id} 
                className={`relative transition-all duration-200 hover:shadow-lg ${
                  selectedTemplateId === template.metadata.id 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : ''
                } ${
                  !canAccessTemplate(template) 
                    ? 'opacity-60' 
                    : 'cursor-pointer hover:scale-105'
                }`}
              >
                {/* Premium Badge */}
                {template.metadata.isPremium && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}

                {/* Selected Badge */}
                {selectedTemplateId === template.metadata.id && (
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-green-600 text-white">
                      <Check className="h-3 w-3 mr-1" />
                      Selected
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="aspect-[8.5/11] bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                    <div className="text-6xl opacity-50">📄</div>
                  </div>
                  
                  <CardTitle className="text-lg">{template.metadata.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      ATS {template.metadata.atsScore}%
                    </Badge>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {template.metadata.category}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.metadata.description}
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-xs font-medium mb-1">Best for:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.metadata.bestFor.slice(0, 2).map((industry) => (
                        <Badge key={industry} variant="outline" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                      {template.metadata.bestFor.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.metadata.bestFor.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setPreviewTemplate(template)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{template.metadata.name} Preview</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          {renderTemplatePreview(template)}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => canAccessTemplate(template) && onTemplateSelect(template.metadata.id)}
                      disabled={!canAccessTemplate(template)}
                    >
                      {!canAccessTemplate(template) ? (
                        <>
                          <Crown className="h-4 w-4 mr-1" />
                          Upgrade
                        </>
                      ) : selectedTemplateId === template.metadata.id ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Selected
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-1" />
                          Select
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Upgrade Notice for Free Users */}
      {userTier === 'free' && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800/50">
          <CardContent className="p-6 text-center">
            <Crown className="h-12 w-12 mx-auto mb-4 text-amber-600" />
            <h3 className="text-lg font-semibold mb-2">Unlock Premium Templates</h3>
            <p className="text-muted-foreground mb-4">
              Get access to all premium templates, advanced customization options, and more with our Premium plan.
            </p>
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
