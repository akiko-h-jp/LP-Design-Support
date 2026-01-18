/**
 * LPコピーの型定義
 */

export interface LPCopy {
  hero: {
    headline: string;
    subheadline: string;
    supportText: string;
  };
  problem: {
    title: string;
    description: string;
  };
  solution: {
    title: string;
    description: string;
  };
  benefits: Array<{
    title: string;
    description: string;
  }>;
  socialProof: {
    title: string;
    content: string;
  };
  cta: {
    primary: string;
    secondary?: string;
  };
  editingNotes?: {
    suggestions: string[];
    improvements: string[];
  };
}

export interface CopyGenerationResult {
  success: boolean;
  copy?: LPCopy;
  message: string;
  errors?: string[];
}
