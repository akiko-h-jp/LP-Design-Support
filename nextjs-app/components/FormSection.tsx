import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  optional?: boolean;
}

export default function FormSection({ title, subtitle, children, optional = false }: FormSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="mb-4 border-b border-gray-200 pb-3">
        <h2 className="text-xl font-semibold text-gray-900">
          {title}
          {optional && <span className="text-sm text-gray-400 font-normal ml-2">（任意セクション）</span>}
        </h2>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
