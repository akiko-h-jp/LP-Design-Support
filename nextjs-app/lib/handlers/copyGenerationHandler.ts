import { GeminiService } from '@/lib/services/geminiService';
import { ClientInputHandler } from './clientInputHandler';
import { LPCopy, CopyGenerationResult } from '@/types/copy';

interface ClientInputData {
  project_id?: string;
  basic_info?: {
    company_name: string;
    service_name: string;
    service_url?: string;
    industry: string;
    business_description: string;
  };
  target_info?: {
    target_audience: string;
    target_pain_points: string;
  };
  value_proposition?: {
    main_value: string;
    main_features: string;
    service_details?: string;
  };
  benefits?: {
    customer_benefits: string;
  };
  social_proof?: {
    achievements?: string;
    testimonials?: string;
    media_coverage?: string;
    awards?: string;
  };
  competitor_info?: {
    competitors?: string;
    differentiators?: string;
  };
  brand_info?: {
    brand_tone?: string;
    reference_urls?: string;
    brand_color?: string;
    image_requirements?: string;
  };
  lp_goals?: {
    main_purpose: string;
    desired_cta?: string;
    additional_notes?: string;
  };
}

export class CopyGenerationHandler {
  private geminiService: GeminiService;
  private clientInputHandler: ClientInputHandler;

  constructor() {
    this.geminiService = new GeminiService();
    this.clientInputHandler = new ClientInputHandler();
  }

  /**
   * クライアント入力データからLPコピーを生成
   */
  async generateCopy(projectId: string): Promise<CopyGenerationResult> {
    try {
      // クライアント入力データを取得
      const inputData = await this.clientInputHandler.getInput(projectId);
      if (!inputData) {
        return {
          success: false,
          message: 'プロジェクトが見つかりません',
          errors: ['指定されたプロジェクトIDのデータが見つかりません'],
        };
      }

      // プロンプトを生成
      const prompt = this.buildPrompt(inputData);

      // Gemini APIでコピーを生成
      const response = await this.geminiService.generateText(prompt);

      // レスポンスをパース
      const copy = this.parseResponse(response);

      return {
        success: true,
        copy,
        message: 'LPコピーを生成しました',
      };
    } catch (error) {
      console.error('コピー生成エラー:', error);
      return {
        success: false,
        message: `コピー生成に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * プロンプトを構築
   */
  private buildPrompt(data: ClientInputData): string {
    const companyName = data.basic_info?.company_name || '';
    const serviceName = data.basic_info?.service_name || '';
    const industry = data.basic_info?.industry || '';
    const businessDescription = data.basic_info?.business_description || '';
    const targetAudience = data.target_info?.target_audience || '';
    const targetPainPoints = data.target_info?.target_pain_points || '';
    const mainValue = data.value_proposition?.main_value || '';
    const mainFeatures = data.value_proposition?.main_features || '';
    const customerBenefits = data.benefits?.customer_benefits || '';
    const achievements = data.social_proof?.achievements || '';
    const testimonials = data.social_proof?.testimonials || '';
    const mainPurpose = data.lp_goals?.main_purpose || '';
    const desiredCta = data.lp_goals?.desired_cta || '';

    return `あなたはLP（ランディングページ）のコピーライターです。以下の情報を基に、LPのコピーを生成してください。

【重要事項】
- 誇張表現や断定表現は避けてください
- 実績・数値は与えられた場合のみ使用してください
- これは完成稿ではなく、編集前提の仮コピーであることを意識してください
- 各セクションは簡潔で分かりやすく、ターゲットに響く内容にしてください

【企業・サービス情報】
企業名: ${companyName}
サービス名: ${serviceName}
業種: ${industry}
事業内容: ${businessDescription}

【ターゲット情報】
ターゲット: ${targetAudience}
ターゲットの課題・悩み: ${targetPainPoints}

【提供価値】
主な提供価値: ${mainValue}
主な特徴・強み: ${mainFeatures}

【顧客メリット】
${customerBenefits}

【実績・社会証明】
${achievements ? `実績: ${achievements}` : ''}
${testimonials ? `お客様の声: ${testimonials}` : ''}

【LPの目的】
${mainPurpose}
${desiredCta ? `希望するCTA: ${desiredCta}` : ''}

以下のJSON形式で出力してください。各セクションは必須です。

{
  "hero": {
    "headline": "メインキャッチコピー（30文字程度）",
    "subheadline": "サブキャッチコピー（50文字程度）",
    "supportText": "補足説明（100文字程度）"
  },
  "problem": {
    "title": "課題セクションのタイトル",
    "description": "ターゲットの課題を具体的に説明（200文字程度）"
  },
  "solution": {
    "title": "解決策セクションのタイトル",
    "description": "サービスが提供する解決策を説明（200文字程度）"
  },
  "benefits": [
    {
      "title": "メリット1のタイトル",
      "description": "メリット1の説明（100文字程度）"
    },
    {
      "title": "メリット2のタイトル",
      "description": "メリット2の説明（100文字程度）"
    },
    {
      "title": "メリット3のタイトル",
      "description": "メリット3の説明（100文字程度）"
    }
  ],
  "socialProof": {
    "title": "実績・社会証明のタイトル",
    "content": "実績やお客様の声を記載（実績がない場合は「実績を追加予定」など）"
  },
  "cta": {
    "primary": "メインCTA（例: 今すぐ無料で始める）",
    "secondary": "サブCTA（任意）"
  },
  "editingNotes": {
    "suggestions": ["調整提案1", "調整提案2"],
    "improvements": ["改善点1", "改善点2"]
  }
}

重要: 上記のJSONオブジェクトのみを出力してください。説明文やコメント、コードブロックのマークダウン記号は不要です。JSONオブジェクトの開始と終了の波括弧のみを含めてください。`;
  }

  /**
   * Gemini APIのレスポンスをパース
   */
  private parseResponse(response: string): LPCopy {
    try {
      // JSON部分を抽出（複数の方法を試す）
      let jsonText = response.trim();

      // 方法1: ```json ... ``` の形式を抽出
      const jsonBlockMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonBlockMatch) {
        jsonText = jsonBlockMatch[1].trim();
      } else {
        // 方法2: ``` ... ``` の形式を抽出
        const codeBlockMatch = jsonText.match(/```\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
          jsonText = codeBlockMatch[1].trim();
          // jsonという文字列が含まれている場合は削除
          if (jsonText.toLowerCase().startsWith('json')) {
            jsonText = jsonText.substring(4).trim();
          }
        } else {
          // 方法3: { から } までを抽出（最初の{から最後の}まで）
          const firstBrace = jsonText.indexOf('{');
          const lastBrace = jsonText.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            jsonText = jsonText.substring(firstBrace, lastBrace + 1);
          }
        }
      }

      // 前後の不要な文字を削除
      jsonText = jsonText.trim();

      // JSONパースを試行
      let parsed: any;
      try {
        parsed = JSON.parse(jsonText);
      } catch (parseError) {
        console.error('JSONパースエラー:', parseError);
        throw new Error(
          `JSONの解析に失敗しました。レスポンス形式を確認してください。\nエラー: ${parseError instanceof Error ? parseError.message : String(parseError)}`
        );
      }

      if (!parsed.hero || !parsed.problem || !parsed.solution || !parsed.benefits || !parsed.cta) {
        throw new Error('必須セクションが不足しています');
      }

      // Benefitsが3つ未満の場合は補完
      if (!Array.isArray(parsed.benefits) || parsed.benefits.length < 3) {
        const benefits = parsed.benefits || [];
        while (benefits.length < 3) {
          benefits.push({
            title: `メリット${benefits.length + 1}`,
            description: '内容を追加してください',
          });
        }
        parsed.benefits = benefits;
      }

      // 各セクションの必須フィールドを検証・補完
      if (!parsed.hero.headline) parsed.hero.headline = 'キャッチコピーを追加してください';
      if (!parsed.hero.subheadline) parsed.hero.subheadline = 'サブキャッチコピーを追加してください';
      if (!parsed.hero.supportText) parsed.hero.supportText = '補足説明を追加してください';

      if (!parsed.problem.title) parsed.problem.title = '課題のタイトルを追加してください';
      if (!parsed.problem.description) parsed.problem.description = '課題の説明を追加してください';

      if (!parsed.solution.title) parsed.solution.title = '解決策のタイトルを追加してください';
      if (!parsed.solution.description) parsed.solution.description = '解決策の説明を追加してください';

      if (!parsed.socialProof.title) parsed.socialProof.title = '実績・社会証明のタイトルを追加してください';
      if (!parsed.socialProof.content) parsed.socialProof.content = '実績・社会証明の内容を追加してください';

      if (!parsed.cta.primary) parsed.cta.primary = 'CTAを追加してください';

      return parsed as LPCopy;
    } catch (error) {
      console.error('レスポンスパースエラー:', error);
      throw new Error(
        `コピーの解析に失敗しました: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
