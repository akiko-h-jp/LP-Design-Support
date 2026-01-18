import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini APIサービス
 * AIを活用したテキスト生成機能を提供
 */
export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEYが設定されていません');
      return;
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * テキスト生成を実行
   * @param prompt プロンプト
   * @param model モデル名（デフォルト: 'gemini-2.5-flash'）
   * @returns 生成されたテキスト
   */
  async generateText(prompt: string, model: string = 'gemini-2.5-flash'): Promise<string> {
    if (!this.genAI) {
      throw new Error('Gemini APIが初期化されていません。GEMINI_API_KEYを設定してください。');
    }

    try {
      const genModel = this.genAI.getGenerativeModel({ model });
      const result = await genModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('Gemini API error details:', error);
      
      // より詳細なエラーメッセージを生成
      let errorMessage = 'Gemini API呼び出しに失敗しました';
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
        // よくあるエラーの説明を追加
        if (error.message.includes('API_KEY_INVALID')) {
          errorMessage += ' (APIキーが無効です)';
        } else if (error.message.includes('MODEL_NOT_FOUND')) {
          errorMessage += ' (モデル名が正しくありません)';
        } else if (error.message.includes('QUOTA_EXCEEDED')) {
          errorMessage += ' (APIの使用制限に達しました)';
        }
      } else {
        errorMessage += `: ${String(error)}`;
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * 構造化されたJSONレスポンスを生成
   * @param prompt プロンプト
   * @param model モデル名（デフォルト: 'gemini-2.5-flash'）
   * @returns パースされたJSONオブジェクト
   */
  async generateStructuredJSON<T>(
    prompt: string,
    model: string = 'gemini-2.5-flash'
  ): Promise<T> {
    const text = await this.generateText(prompt, model);
    
    // JSONを抽出（コードブロック内のJSONを探す）
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;
    
    try {
      return JSON.parse(jsonText) as T;
    } catch (error) {
      // JSONパースに失敗した場合、テキスト全体をパースしてみる
      try {
        return JSON.parse(text) as T;
      } catch (e) {
        throw new Error(
          `JSONパースに失敗しました。レスポンス: ${text.substring(0, 200)}...`
        );
      }
    }
  }

  /**
   * 複数の候補を生成
   * @param prompt プロンプト
   * @param candidateCount 生成する候補数（デフォルト: 1）
   * @param model モデル名（デフォルト: 'gemini-2.5-flash'）
   * @returns 生成されたテキストの配列
   */
  async generateCandidates(
    prompt: string,
    candidateCount: number = 1,
    model: string = 'gemini-2.5-flash'
  ): Promise<string[]> {
    if (!this.genAI) {
      throw new Error('Gemini APIが初期化されていません。GEMINI_API_KEYを設定してください。');
    }

    try {
      const genModel = this.genAI.getGenerativeModel({ model });
      const results: string[] = [];

      for (let i = 0; i < candidateCount; i++) {
        const result = await genModel.generateContent(prompt);
        const response = await result.response;
        results.push(response.text());
      }

      return results;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(
        `Gemini API呼び出しに失敗しました: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
