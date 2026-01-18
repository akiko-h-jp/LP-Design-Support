/**
 * デザイン指示の型定義
 */

export interface DesignInstruction {
  designConcept: {
    overall: string;
    visualDirection: string;
    keyMessage: string;
  };
  tone: {
    mood: string;
    colorPalette: string[];
    typography: string;
  };
  layout: {
    overallStructure: string;
    sectionOrder: string[];
    spacingGuidelines: string;
  };
  sections: Array<{
    sectionName: string;
    designIntent: string;
    visualNotes: string;
    layoutNotes: string;
    colorNotes?: string;
    typographyNotes?: string;
  }>;
}

export interface DesignInstructionResult {
  success: boolean;
  instruction?: DesignInstruction;
  message: string;
  errors?: string[];
}
