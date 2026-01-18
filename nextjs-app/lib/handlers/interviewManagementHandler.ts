import { GeminiService } from '@/lib/services/geminiService';
import { ClientInputHandler } from './clientInputHandler';

/**
 * ヒアリング整理ハンドラー
 * AIを活用したヒアリング整理・編集支援機能を提供
 */
export class InterviewManagementHandler {
  private geminiService: GeminiService;
  private clientInputHandler: ClientInputHandler;

  constructor() {
    this.geminiService = new GeminiService();
    this.clientInputHandler = new ClientInputHandler();
  }

  /**
   * 情報分析を実行
   * 情報の不足・曖昧・矛盾を指摘し、構造化された分析結果を返す
   */
  async analyzeInformation(projectId: string): Promise<{
    success: boolean;
    analysis?: {
      missing: string[];
      ambiguous: string[];
      contradictions: string[];
      summary: string;
    };
    errors?: string[];
  }> {
    try {
      // クライアント入力データを取得
      const inputData = await this.clientInputHandler.getInput(projectId);
      if (!inputData) {
        return {
          success: false,
          errors: ['プロジェクトが見つかりません'],
        };
      }

      // プロンプトを作成
      const prompt = this.createAnalysisPrompt(inputData);

      // Gemini APIで分析を実行
      const analysisText = await this.geminiService.generateText(prompt);

      // 分析結果をパース
      const analysis = await this.parseAnalysisResult(analysisText);

      return {
        success: true,
        analysis,
      };
    } catch (error) {
      console.error('Error analyzing information:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * 追加質問を生成
   * AIによる追加ヒアリング質問を提示し、優先度付けを行う
   */
  async generateAdditionalQuestions(projectId: string): Promise<{
    success: boolean;
    questions?: Array<{
      question: string;
      priority: 'high' | 'medium' | 'low';
      reason: string;
    }>;
    errors?: string[];
  }> {
    try {
      // クライアント入力データを取得
      const inputData = await this.clientInputHandler.getInput(projectId);
      if (!inputData) {
        return {
          success: false,
          errors: ['プロジェクトが見つかりません'],
        };
      }

      // プロンプトを作成
      const prompt = this.createQuestionPrompt(inputData);

      // Gemini APIで質問を生成
      const questionsText = await this.geminiService.generateText(prompt);

      // 質問をパース
      const questions = await this.parseQuestions(questionsText);

      return {
        success: true,
        questions,
      };
    } catch (error) {
      console.error('Error generating questions:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * 内容の構造化支援
   * ヒアリング内容を整理し、構造化されたデータ形式に変換
   */
  async structureContent(projectId: string): Promise<{
    success: boolean;
    structuredData?: any;
    errors?: string[];
  }> {
    try {
      // クライアント入力データを取得
      const inputData = await this.clientInputHandler.getInput(projectId);
      if (!inputData) {
        return {
          success: false,
          errors: ['プロジェクトが見つかりません'],
        };
      }

      // プロンプトを作成
      const prompt = this.createStructurePrompt(inputData);

      // Gemini APIで構造化を実行
      const structuredText = await this.geminiService.generateText(prompt);

      // 構造化データをパース
      const structuredData = await this.parseStructuredData(structuredText);

      return {
        success: true,
        structuredData,
      };
    } catch (error) {
      console.error('Error structuring content:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * 分析用プロンプトを作成
   */
  private createAnalysisPrompt(inputData: any): string {
    return `あなたはLP制作のためのヒアリング内容を分析する専門家です。
以下のクライアント入力内容を分析し、以下の観点で評価してください：

1. **不足している情報**: LP制作に必要な情報で不足している項目
2. **曖昧な情報**: より具体的にすべき項目
3. **矛盾している情報**: 内容に矛盾がある項目
4. **総合的な評価**: ヒアリング内容の総合的な評価と改善提案

## クライアント入力内容

${JSON.stringify(inputData, null, 2)}

## 出力形式

以下のJSON形式で出力してください：

\`\`\`json
{
  "missing": ["不足している情報1", "不足している情報2"],
  "ambiguous": ["曖昧な情報1", "曖昧な情報2"],
  "contradictions": ["矛盾している情報1", "矛盾している情報2"],
  "summary": "総合的な評価と改善提案"
}
\`\`\`
`;
  }

  /**
   * 質問生成用プロンプトを作成
   */
  private createQuestionPrompt(inputData: any): string {
    return `あなたはLP制作のためのヒアリング質問を生成する専門家です。
以下のクライアント入力内容を分析し、追加で聞くべき質問を生成してください。

各質問には以下を含めてください：
- 質問内容
- 優先度（high/medium/low）
- 質問する理由

## クライアント入力内容

${JSON.stringify(inputData, null, 2)}

## 出力形式

以下のJSON形式で出力してください：

\`\`\`json
{
  "questions": [
    {
      "question": "質問内容",
      "priority": "high",
      "reason": "質問する理由"
    }
  ]
}
\`\`\`
`;
  }

  /**
   * 構造化用プロンプトを作成
   */
  private createStructurePrompt(inputData: any): string {
    return `あなたはLP制作のためのヒアリング内容を構造化する専門家です。
以下のクライアント入力内容を整理し、LP制作に最適な構造化されたデータ形式に変換してください。

## クライアント入力内容

${JSON.stringify(inputData, null, 2)}

## 出力形式

以下のJSON形式で出力してください：

\`\`\`json
{
  "structured_data": {
    "company_info": {},
    "target_info": {},
    "value_proposition": {},
    "benefits": {},
    "proof_points": {},
    "competitor_info": {},
    "brand_info": {},
    "goals": {}
  }
}
\`\`\`
`;
  }

  /**
   * 分析結果をパース
   */
  private async parseAnalysisResult(text: string): Promise<{
    missing: string[];
    ambiguous: string[];
    contradictions: string[];
    summary: string;
  }> {
    try {
      const parsed = await this.geminiService.generateStructuredJSON<{
        missing: string[];
        ambiguous: string[];
        contradictions: string[];
        summary: string;
      }>(`以下のテキストをJSON形式に変換してください：\n\n${text}`);

      return {
        missing: parsed.missing || [],
        ambiguous: parsed.ambiguous || [],
        contradictions: parsed.contradictions || [],
        summary: parsed.summary || '',
      };
    } catch (error) {
      // パースに失敗した場合、テキストから手動で抽出を試みる
      return {
        missing: [],
        ambiguous: [],
        contradictions: [],
        summary: text,
      };
    }
  }

  /**
   * 質問をパース
   */
  private async parseQuestions(text: string): Promise<Array<{
    question: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
  }>> {
    try {
      const parsed = await this.geminiService.generateStructuredJSON<{
        questions: Array<{
          question: string;
          priority: 'high' | 'medium' | 'low';
          reason: string;
        }>;
      }>(`以下のテキストをJSON形式に変換してください：\n\n${text}`);

      return parsed.questions || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * 構造化データをパース
   */
  private async parseStructuredData(text: string): Promise<any> {
    try {
      const parsed = await this.geminiService.generateStructuredJSON<any>(
        `以下のテキストをJSON形式に変換してください：\n\n${text}`
      );
      return parsed.structured_data || parsed;
    } catch (error) {
      return null;
    }
  }
}
