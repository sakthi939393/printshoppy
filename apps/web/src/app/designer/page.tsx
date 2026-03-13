import { Metadata } from 'next';
import { DesignerStudio } from '@/components/designer/DesignerStudio';

export const metadata: Metadata = {
  title: 'Online Design Tool - Create Custom Prints',
  description: 'Use our powerful online design tool to create custom t-shirts, mugs, and more. Add text, images, and graphics with drag-and-drop simplicity.',
};

export default function DesignerPage() {
  return <DesignerStudio />;
}
