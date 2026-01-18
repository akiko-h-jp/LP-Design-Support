import { GeminiService } from '@/lib/services/geminiService';
import { ClientInputHandler } from './clientInputHandler';
import { LPCopy } from '@/types/copy';
import { DesignInstruction, DesignInstructionResult } from '@/types/designInstruction';

export class DesignInstructionHandler {
  private geminiService: GeminiService;
  private clientInputHandler: ClientInputHandler;

  constructor() {
    this.geminiService = new GeminiService();
    this.clientInputHandler = new ClientInputHandler();
  }

  /**
   * 確定コピーからデザイン指示を生成
   */
  async generateInstruction(projectId: string): Promise<DesignInstructionResult> {
    try {
      // プロジェクトデータを取得
      const projectData = await this.clientInputHandler.getInput(projectId);
      if (!projectData) {
        return {
          success: false,
          message: 'プロジェクトが見つかりません',
          errors: ['指定されたプロジェクトIDのデータが見つかりません'],
        };
      }

      // 確定コピーを取得
      const finalizedCopy = (projectData as any).finalized_copy as LPCopy | undefined;
      if (!finalizedCopy) {
        return {
          success: false,
          message: '確定コピーが見つかりません',
          errors: ['先にコピーを確定してください'],
        };
      }

      // クライアント入力データも取得（ブランド情報など）
      const brandInfo = projectData.brand_info || {};
      const basicInfo = projectData.basic_info || {};

      // プロンプトを生成
      const prompt = this.buildPrompt(finalizedCopy, brandInfo, basicInfo);

      // Gemini APIでデザイン指示を生成
      // generateStructuredJSONは既にパース済みのオブジェクトを返す
      const instruction = await this.geminiService.generateStructuredJSON<DesignInstruction>(
        prompt
      );

      // バリデーションと補完
      const validatedInstruction = this.validateAndComplete(instruction, finalizedCopy);

      return {
        success: true,
        instruction: validatedInstruction,
        message: 'デザイン指示を生成しました',
      };
    } catch (error) {
      console.error('デザイン指示生成エラー:', error);
      return {
        success: false,
        message: `デザイン指示生成に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * プロンプトを構築
   */
  private buildPrompt(
    copy: LPCopy,
    brandInfo: any,
    basicInfo: any
  ): string {
    const brandTone = brandInfo.brand_tone || '未指定';
    const brandColor = brandInfo.brand_color || '未指定';
    const referenceUrls = brandInfo.reference_urls || 'なし';
    const serviceName = basicInfo.service_name || 'サービス';

    return `あなたはLPデザインの専門家です。以下の確定コピーとブランド情報を基に、詳細なデザイン指示を生成してください。

## 確定コピー

### Heroセクション
- メインキャッチコピー: ${copy.hero.headline}
- サブキャッチコピー: ${copy.hero.subheadline}
- 補足説明: ${copy.hero.supportText}

### Problemセクション
- タイトル: ${copy.problem.title}
- 説明: ${copy.problem.description}

### Solutionセクション
- タイトル: ${copy.solution.title}
- 説明: ${copy.solution.description}

### Benefitsセクション
${copy.benefits.map((b, i) => `- メリット${i + 1}: ${b.title} - ${b.description}`).join('\n')}

### Social Proofセクション
- タイトル: ${copy.socialProof.title}
- 内容: ${copy.socialProof.content}

### CTAセクション
- メインCTA: ${copy.cta.primary}
${copy.cta.secondary ? `- サブCTA: ${copy.cta.secondary}` : ''}

## ブランド情報
- ブランドトーン: ${brandTone}
- ブランドカラー: ${brandColor}
- 参考URL: ${referenceUrls}
- サービス名: ${serviceName}

## 出力形式
以下のJSON形式で出力してください。各セクションについて、具体的に活用できる詳細な指示を含めてください。

{
  "designConcept": {
    "overall": "全体のデザインコンセプト（1-2文）",
    "visualDirection": "視覚的な方向性（例: モダンで洗練された、親しみやすいなど）",
    "keyMessage": "伝えたい核心メッセージ"
  },
  "tone": {
    "mood": "全体的なムード（例: 信頼感、親しみやすさ、高級感など）",
    "colorPalette": ["メインカラー", "サブカラー1", "サブカラー2", "アクセントカラー"],
    "typography": "タイポグラフィの方針（例: 読みやすさ重視、モダンなサンセリフなど）"
  },
  "layout": {
    "overallStructure": "全体のレイアウト構造（例: シングルカラム、2カラムなど）",
    "sectionOrder": ["Hero", "Problem", "Solution", "Benefits", "SocialProof", "CTA"],
    "spacingGuidelines": "スペーシングのガイドライン（例: セクション間は120px、要素間は40pxなど）"
  },
  "sections": [
    {
      "sectionName": "Hero",
      "designIntent": "このセクションのデザイン意図（なぜこのデザインにするか）",
      "visualNotes": "視覚的な注意点（例: メインキャッチを大きく、背景はシンプルに）",
      "layoutNotes": "レイアウトの指示（例: 中央配置、左寄せなど）",
      "colorNotes": "色の使い方（例: メインカラーを背景に、テキストは白）",
      "typographyNotes": "タイポグラフィの指示（例: メインキャッチは48px、太字）"
    }
  ]
}

重要: JSONのみを出力し、説明文やコメントは含めないでください。`;
  }

  /**
   * デザイン指示のスキーマを取得
   */
  private getInstructionSchema(): any {
    return {
      type: 'object',
      properties: {
        designConcept: {
          type: 'object',
          properties: {
            overall: { type: 'string' },
            visualDirection: { type: 'string' },
            keyMessage: { type: 'string' },
          },
          required: ['overall', 'visualDirection', 'keyMessage'],
        },
        tone: {
          type: 'object',
          properties: {
            mood: { type: 'string' },
            colorPalette: { type: 'array', items: { type: 'string' } },
            typography: { type: 'string' },
          },
          required: ['mood', 'colorPalette', 'typography'],
        },
        layout: {
          type: 'object',
          properties: {
            overallStructure: { type: 'string' },
            sectionOrder: { type: 'array', items: { type: 'string' } },
            spacingGuidelines: { type: 'string' },
          },
          required: ['overallStructure', 'sectionOrder', 'spacingGuidelines'],
        },
        sections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              sectionName: { type: 'string' },
              designIntent: { type: 'string' },
              visualNotes: { type: 'string' },
              layoutNotes: { type: 'string' },
              colorNotes: { type: 'string' },
              typographyNotes: { type: 'string' },
            },
            required: ['sectionName', 'designIntent', 'visualNotes', 'layoutNotes'],
          },
        },
      },
      required: ['designConcept', 'tone', 'layout', 'sections'],
    };
  }

  /**
   * バリデーションと補完
   */
  private validateAndComplete(
    instruction: DesignInstruction,
    copy: LPCopy
  ): DesignInstruction {
    // 必須セクションを確認
    const requiredSections = ['Hero', 'Problem', 'Solution', 'Benefits', 'SocialProof', 'CTA'];
    const existingSections = instruction.sections.map((s) => s.sectionName);

    // 不足しているセクションを補完
    for (const sectionName of requiredSections) {
      if (!existingSections.includes(sectionName)) {
        instruction.sections.push({
          sectionName,
          designIntent: `${sectionName}セクションのデザイン意図`,
          visualNotes: '視覚的な注意点を記載',
          layoutNotes: 'レイアウトの指示を記載',
        });
      }
    }

    // カラーパレットが空の場合は補完
    if (!instruction.tone.colorPalette || instruction.tone.colorPalette.length === 0) {
      instruction.tone.colorPalette = ['#3B82F6', '#1E40AF', '#60A5FA', '#F59E0B'];
    }

    return instruction;
  }
}
