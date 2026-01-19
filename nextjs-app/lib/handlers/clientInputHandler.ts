import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

interface ClientInputData {
  project_id?: string;
  basic_info?: {
    company_name: string;
    service_name: string;
    service_url: string;
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
    service_details: string;
  };
  benefits?: {
    customer_benefits: string;
  };
  social_proof?: {
    achievements: string;
    testimonials: string;
    media_coverage: string;
    awards: string;
  };
  competitor_info?: {
    competitors: string;
    differentiators: string;
  };
  brand_info?: {
    brand_tone: string;
    reference_urls: string;
    brand_color: string;
    image_requirements: string;
  };
  lp_goals?: {
    main_purpose: string;
    desired_cta: string;
    additional_notes: string;
  };
  // AI分析結果
  ai_analysis?: {
    missing: string[];
    ambiguous: string[];
    contradictions: string[];
    summary: string;
  };
  // AI生成質問
  ai_questions?: Array<{
    question: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
  }>;
  // 生成されたLPコピー
  generated_copy?: any;
  finalized_copy?: any;
  finalized_copy_at?: string;
  // デザイン指示
  design_instruction?: any;
  design_instruction_generated_at?: string;
  finalized_design_instruction?: any;
  finalized_design_instruction_at?: string;
  project_folder_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface HandlerResult {
  success: boolean;
  project_id?: string;
  message: string;
  errors?: string[];
  warnings?: string[];
}

export class ClientInputHandler {
  private tempStorageDir: string;

  constructor() {
    // Vercel環境では/tmpディレクトリを使用（一時的なファイルシステム）
    // ローカル環境ではprocess.cwd()を使用
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      this.tempStorageDir = path.join(os.tmpdir(), 'temp_client_inputs');
    } else {
      this.tempStorageDir = path.join(process.cwd(), 'temp_client_inputs');
    }
    this.ensureTempDir();
  }

  private async ensureTempDir() {
    try {
      await fs.mkdir(this.tempStorageDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
      // Vercel環境では一時的なファイルシステムのため、エラーを無視する
      if (process.env.VERCEL) {
        console.warn('Vercel環境では一時ディレクトリの作成に失敗しました。メモリ内のみで動作します。');
      }
    }
  }

  async receiveInput(inputData: ClientInputData): Promise<HandlerResult> {
    try {
      // プロジェクトIDを生成（まだない場合）
      const projectId = inputData.project_id || uuidv4();
      inputData.project_id = projectId;

      // タイムスタンプを追加
      const now = new Date().toISOString();
      inputData.created_at = now;
      inputData.updated_at = now;

      const tempFilePath = path.join(this.tempStorageDir, `${projectId}.json`);
      await fs.writeFile(tempFilePath, JSON.stringify(inputData, null, 2), 'utf-8');

      return {
        success: true,
        project_id: projectId,
        message: 'クライアント様事前アンケートを送信しました。内容を確認後、担当者よりご連絡いたします。',
        errors: [],
        warnings: [],
      };
    } catch (error) {
      console.error('Error receiving client input:', error);
      return {
        success: false,
        message: `エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
        errors: [error instanceof Error ? error.message : String(error)],
        warnings: [],
      };
    }
  }

  async getInput(projectId: string): Promise<ClientInputData | null> {
    try {
      const tempFilePath = path.join(this.tempStorageDir, `${projectId}.json`);
      
      try {
        const data = await fs.readFile(tempFilePath, 'utf-8');
        const parsed = JSON.parse(data);
        return parsed;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return null;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error getting client input:', error);
      return null;
    }
  }

  async updateInput(projectId: string, inputData: Partial<ClientInputData>): Promise<HandlerResult> {
    try {
      // 既存データを取得
      const existingData = await this.getInput(projectId);
      if (!existingData) {
        return {
          success: false,
          message: 'プロジェクトが見つかりません',
          errors: ['指定されたプロジェクトIDのデータが見つかりません'],
        };
      }

      // データを深くマージ
      const mergedData = this.deepMerge(existingData, inputData);
      mergedData.updated_at = new Date().toISOString();

      const tempFilePath = path.join(this.tempStorageDir, `${projectId}.json`);
      await fs.writeFile(tempFilePath, JSON.stringify(mergedData, null, 2), 'utf-8');

      return {
        success: true,
        project_id: projectId,
        message: 'クライアント入力データを更新しました',
        errors: [],
        warnings: [],
      };
    } catch (error) {
      console.error('Error updating client input:', error);
      return {
        success: false,
        message: `エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
        errors: [error instanceof Error ? error.message : String(error)],
        warnings: [],
      };
    }
  }

  async getAllInputs(): Promise<ClientInputData[]> {
    try {
      const files = await fs.readdir(this.tempStorageDir);
      const jsonFiles = files.filter((file) => file.endsWith('.json'));

      const inputs: ClientInputData[] = [];

      for (const file of jsonFiles) {
        try {
          const filePath = path.join(this.tempStorageDir, file);
          const data = await fs.readFile(filePath, 'utf-8');
          const parsed = JSON.parse(data) as ClientInputData;

          // プロジェクトIDと基本情報のみを返す（軽量化）
          inputs.push({
            project_id: parsed.project_id,
            basic_info: parsed.basic_info,
            created_at: parsed.created_at,
            updated_at: parsed.updated_at,
          });
        } catch (error) {
          console.error(`Error reading file ${file}:`, error);
        }
      }
      return inputs;
    } catch (error) {
      console.error('Error getting all client inputs:', error);
      return [];
    }
  }

  private deepMerge(base: any, update: any): any {
    const result = { ...base };
    for (const key in update) {
      if (update[key] !== undefined) {
        if (
          typeof result[key] === 'object' &&
          result[key] !== null &&
          !Array.isArray(result[key]) &&
          typeof update[key] === 'object' &&
          update[key] !== null &&
          !Array.isArray(update[key])
        ) {
          result[key] = this.deepMerge(result[key], update[key]);
        } else {
          result[key] = update[key];
        }
      }
    }
    return result;
  }
}
