export { default as ProfessionalTemplate } from './ProfessionalTemplate';
export { default as ModernTemplate } from './ModernTemplate';
export { default as MinimalTemplate } from './MinimalTemplate';
export { default as CreativeTemplate } from './CreativeTemplate';
export { default as ExecutiveTemplate } from './ExecutiveTemplate';
export { default as TechnicalTemplate } from './TechnicalTemplate';
export { default as AcademicTemplate } from './AcademicTemplate';
export { default as CompactTemplate } from './CompactTemplate';

export const TEMPLATES = [
    { id: 'professional', name: 'Professional', description: 'Classic corporate style', color: '#1a365d', category: 'Corporate' },
    { id: 'modern', name: 'Modern', description: 'Clean tech startup style', color: '#374151', category: 'Tech' },
    { id: 'minimal', name: 'Minimal', description: 'Ultra-clean design', color: '#111111', category: 'Design' },
    { id: 'creative', name: 'Creative', description: 'Bold marketing style', color: '#7c3aed', category: 'Creative' },
    { id: 'executive', name: 'Executive', description: 'Senior leadership style', color: '#44403c', category: 'Corporate' },
    { id: 'technical', name: 'Technical', description: 'Developer/Engineer focus', color: '#2563eb', category: 'Tech' },
    { id: 'academic', name: 'Academic', description: 'Research & education', color: '#78716c', category: 'Academic' },
    { id: 'compact', name: 'Compact', description: 'Dense single-page layout', color: '#52525b', category: 'General' },
];

export const FONTS = [
    { id: 'Inter', name: 'Inter', description: 'Modern sans-serif', category: 'Sans-Serif' },
    { id: 'Georgia', name: 'Georgia', description: 'Classic serif', category: 'Serif' },
    { id: 'Arial', name: 'Arial', description: 'Universal sans-serif', category: 'Sans-Serif' },
    { id: 'Times New Roman', name: 'Times New Roman', description: 'Traditional serif', category: 'Serif' },
    { id: 'Roboto', name: 'Roboto', description: 'Google standard', category: 'Sans-Serif' },
    { id: 'Roboto Mono', name: 'Roboto Mono', description: 'Monospace for tech', category: 'Monospace' },
    { id: 'Garamond', name: 'Garamond', description: 'Elegant serif', category: 'Serif' },
    { id: 'Helvetica', name: 'Helvetica', description: 'Swiss design classic', category: 'Sans-Serif' },
    { id: 'Poppins', name: 'Poppins', description: 'Geometric modern', category: 'Sans-Serif' },
    { id: 'Libre Baskerville', name: 'Libre Baskerville', description: 'Academic serif', category: 'Serif' },
];

export const ACCENT_COLORS = [
    { id: 'blue', name: 'Blue', value: '#2563eb' },
    { id: 'purple', name: 'Purple', value: '#7c3aed' },
    { id: 'green', name: 'Green', value: '#059669' },
    { id: 'red', name: 'Red', value: '#dc2626' },
    { id: 'orange', name: 'Orange', value: '#ea580c' },
    { id: 'teal', name: 'Teal', value: '#0d9488' },
    { id: 'gray', name: 'Gray', value: '#4b5563' },
    { id: 'navy', name: 'Navy', value: '#1e3a5f' },
];
