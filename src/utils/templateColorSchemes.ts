import { ColorScheme } from "@/types/templateTypes";

export const colorSchemes: ColorScheme[] = [
  {
    id: 'professional-blue',
    name: 'Professional Blue',
    primary: '220 90% 56%',     // #3B82F6
    secondary: '220 70% 45%',   // Darker blue
    accent: '220 85% 65%',      // Lighter blue
    text: '220 15% 20%',        // Dark gray-blue
    muted: '220 10% 60%',       // Muted gray-blue
  },
  {
    id: 'success-green',
    name: 'Success Green',
    primary: '160 84% 39%',     // #10B981
    secondary: '160 75% 30%',   // Darker green
    accent: '160 80% 50%',      // Lighter green
    text: '160 15% 20%',        // Dark gray-green
    muted: '160 10% 55%',       // Muted gray-green
  },
  {
    id: 'creative-purple',
    name: 'Creative Purple',
    primary: '258 90% 66%',     // #8B5CF6
    secondary: '258 80% 55%',   // Darker purple
    accent: '258 85% 75%',      // Lighter purple
    text: '258 15% 25%',        // Dark gray-purple
    muted: '258 10% 60%',       // Muted gray-purple
  },
  {
    id: 'neutral-slate',
    name: 'Neutral Slate',
    primary: '215 20% 45%',     // #64748B
    secondary: '215 25% 35%',   // Darker slate
    accent: '215 15% 60%',      // Lighter slate
    text: '215 15% 20%',        // Dark gray
    muted: '215 10% 55%',       // Muted gray
  },
  {
    id: 'energetic-orange',
    name: 'Energetic Orange',
    primary: '20 90% 55%',      // #F97316
    secondary: '20 85% 45%',    // Darker orange
    accent: '20 90% 65%',       // Lighter orange
    text: '20 15% 20%',         // Dark gray-orange
    muted: '20 10% 55%',        // Muted gray-orange
  },
  {
    id: 'modern-rose',
    name: 'Modern Rose',
    primary: '350 89% 60%',     // #F43F5E
    secondary: '350 85% 50%',   // Darker rose
    accent: '350 85% 70%',      // Lighter rose
    text: '350 15% 25%',        // Dark gray-rose
    muted: '350 10% 55%',       // Muted gray-rose
  },
];

export const getColorScheme = (id: string): ColorScheme => {
  return colorSchemes.find(scheme => scheme.id === id) || colorSchemes[0];
};

export const applyColorScheme = (scheme: ColorScheme) => {
  return {
    primary: `hsl(${scheme.primary})`,
    secondary: `hsl(${scheme.secondary})`,
    accent: `hsl(${scheme.accent})`,
    text: `hsl(${scheme.text})`,
    muted: `hsl(${scheme.muted})`,
  };
};
