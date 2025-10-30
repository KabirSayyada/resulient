import { ParsedResume, TemplateId, ColorScheme } from "@/types/templateTypes";
import { ModernATSTemplate } from "./templates/ModernATSTemplate";
import { ProfessionalATSTemplate } from "./templates/ProfessionalATSTemplate";
import { ExecutiveATSTemplate } from "./templates/ExecutiveATSTemplate";
import { TechTemplate } from "./templates/TechTemplate";
import { TwoColumnModernTemplate } from "./templates/TwoColumnModernTemplate";
import { MinimalistElegantTemplate } from "./templates/MinimalistElegantTemplate";

interface TemplateRendererProps {
  templateId: TemplateId;
  resume: ParsedResume;
  colorScheme: ColorScheme;
}

export const TemplateRenderer = ({ templateId, resume, colorScheme }: TemplateRendererProps) => {
  const templateProps = { resume, colorScheme };

  switch (templateId) {
    case 'tech':
      return <TechTemplate {...templateProps} />;
    case 'two-column':
      return <TwoColumnModernTemplate {...templateProps} />;
    case 'elegant':
      return <MinimalistElegantTemplate {...templateProps} />;
    case 'professional':
      return <ProfessionalATSTemplate {...templateProps} />;
    case 'executive':
      return <ExecutiveATSTemplate {...templateProps} />;
    case 'modern':
    default:
      return <ModernATSTemplate {...templateProps} />;
  }
};
