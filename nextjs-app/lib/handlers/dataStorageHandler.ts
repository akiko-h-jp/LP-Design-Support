import { GoogleDriveService } from '@/lib/services/googleDriveService';
import { ProjectNumberManager } from '@/lib/utils/projectNumberManager';

export interface ClientInputData {
  project_id?: string;
  basic_info?: any;
  target_info?: any;
  value_proposition?: any;
  benefits?: any;
  social_proof?: any;
  competitor_info?: any;
  brand_info?: any;
  lp_goals?: any;
  ai_analysis?: any;
  ai_questions?: any;
  generated_copy?: any;
  finalized_copy?: any;
  finalized_copy_at?: string;
  design_instruction?: any;
  design_instruction_generated_at?: string;
  finalized_design_instruction?: any;
  finalized_design_instruction_at?: string;
  project_folder_id?: string;
  created_at?: string;
  updated_at?: string;
}

export class DataStorageHandler {
  private driveService: GoogleDriveService;
  private rootFolderId: string | null = null;
  private projectNumberManager: ProjectNumberManager;

  constructor() {
    this.driveService = new GoogleDriveService();
    this.rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || null;
    this.projectNumberManager = new ProjectNumberManager();
  }

  /**
   * フォルダ名で既存のフォルダを検索
   */
  async findProjectFolder(projectId: string, projectName: string): Promise<string | null> {
    try {
      // 案件番号を取得または作成（形式: "2026-001"）
      const projectNumber = this.projectNumberManager.getOrCreateProjectNumber(projectId);
      
      // フォルダ名を「案件番号_商品名」の形式に
      const folderName = `${projectNumber}_${projectName}`;
      
      // フォルダ名で検索
      return await this.driveService.findFolderByName(folderName);
    } catch (error) {
      console.error('フォルダ検索エラー:', error);
      return null;
    }
  }

  /**
   * 案件を作成（案件フォルダを作成）
   * フォルダ名は「案件番号_商品名」の形式（例: "2026-001_商品名"）
   * 既存のフォルダがある場合は検索して使用
   */
  async createProject(projectId: string, projectName: string): Promise<string> {
    try {
      // 既存のフォルダを検索
      const existingFolderId = await this.findProjectFolder(projectId, projectName);
      if (existingFolderId) {
        return existingFolderId;
      }

      // 案件番号を取得または作成（形式: "2026-001"）
      const projectNumber = this.projectNumberManager.getOrCreateProjectNumber(projectId);
      
      // フォルダ名を「案件番号_商品名」の形式に
      const folderName = `${projectNumber}_${projectName}`;
      
      const projectFolderId = await this.driveService.createProjectFolder(folderName);
      return projectFolderId;
    } catch (error) {
      throw new Error(
        `案件作成エラー: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * クライアント入力データを読みやすい形式に変換
   */
  private formatClientInputForReadability(data: ClientInputData): string {
    const lines: string[] = [];

    lines.push('=== クライアント事前入力内容 ===\n');
    lines.push(`プロジェクトID: ${data.project_id || 'N/A'}`);
    if (data.created_at) {
      lines.push(`作成日時: ${new Date(data.created_at).toLocaleString('ja-JP')}`);
    }
    if (data.updated_at) {
      lines.push(`更新日時: ${new Date(data.updated_at).toLocaleString('ja-JP')}`);
    }
    lines.push('');

    // 1. 基本情報
    if (data.basic_info) {
      lines.push('【1. 基本情報】');
      if (data.basic_info.company_name) {
        lines.push(`企業名: ${data.basic_info.company_name}`);
      }
      if (data.basic_info.service_name) {
        lines.push(`商品名・サービス名: ${data.basic_info.service_name}`);
      }
      if (data.basic_info.service_url) {
        lines.push(`商品・サービスのURL: ${data.basic_info.service_url}`);
      }
      if (data.basic_info.industry) {
        lines.push(`商品・サービスのカテゴリー: ${data.basic_info.industry}`);
      }
      if (data.basic_info.business_description) {
        lines.push(`商品・サービスの詳細:\n${data.basic_info.business_description}`);
      }
      lines.push('');
    }

    // 2. ターゲット情報
    if (data.target_info) {
      lines.push('【2. ターゲット情報】');
      if (data.target_info.target_audience) {
        lines.push(`主なターゲット:\n${data.target_info.target_audience}`);
      }
      if (data.target_info.target_pain_points) {
        lines.push(`ターゲットの課題・悩み:\n${data.target_info.target_pain_points}`);
      }
      lines.push('');
    }

    // 3. 提供価値・解決策
    if (data.value_proposition) {
      lines.push('【3. 提供価値・解決策】');
      if (data.value_proposition.main_value) {
        lines.push(`主な提供価値:\n${data.value_proposition.main_value}`);
      }
      if (data.value_proposition.main_features) {
        lines.push(`主な特徴・強み:\n${data.value_proposition.main_features}`);
      }
      if (data.value_proposition.service_details) {
        lines.push(`具体的な機能・サービス内容:\n${data.value_proposition.service_details}`);
      }
      lines.push('');
    }

    // 4. ベネフィット
    if (data.benefits) {
      lines.push('【4. ベネフィット】');
      if (data.benefits.customer_benefits) {
        lines.push(`顧客が得られるメリット:\n${data.benefits.customer_benefits}`);
      }
      lines.push('');
    }

    // 5. 実績・社会証明
    if (data.social_proof) {
      lines.push('【5. 実績・社会証明】');
      if (data.social_proof.achievements) {
        lines.push(`実績・数値:\n${data.social_proof.achievements}`);
      }
      if (data.social_proof.testimonials) {
        lines.push(`お客様の声・レビュー:\n${data.social_proof.testimonials}`);
      }
      if (data.social_proof.media_coverage) {
        lines.push(`メディア掲載:\n${data.social_proof.media_coverage}`);
      }
      if (data.social_proof.awards) {
        lines.push(`受賞歴・認定:\n${data.social_proof.awards}`);
      }
      lines.push('');
    }

    // 6. 競合情報
    if (data.competitor_info) {
      lines.push('【6. 競合情報】');
      if (data.competitor_info.competitors) {
        lines.push(`主な競合サービス:\n${data.competitor_info.competitors}`);
      }
      if (data.competitor_info.differentiators) {
        lines.push(`競合との違い・優位性:\n${data.competitor_info.differentiators}`);
      }
      lines.push('');
    }

    // 7. ブランド情報
    if (data.brand_info) {
      lines.push('【7. ブランド情報】');
      if (data.brand_info.brand_tone) {
        lines.push(`ブランドイメージ・トーン:\n${data.brand_info.brand_tone}`);
      }
      if (data.brand_info.reference_urls) {
        const urls = typeof data.brand_info.reference_urls === 'string'
          ? data.brand_info.reference_urls.split('\n').filter((u: string) => u.trim())
          : [];
        if (urls.length > 0) {
          lines.push(`参考にしたいLP・サイト:\n${urls.join('\n')}`);
        }
      }
      if (data.brand_info.brand_color) {
        lines.push(`ブランドカラー: ${data.brand_info.brand_color}`);
      }
      if (data.brand_info.image_requirements) {
        lines.push(`使用したい画像・素材:\n${data.brand_info.image_requirements}`);
      }
      lines.push('');
    }

    // 8. LPの目的・ゴール
    if (data.lp_goals) {
      lines.push('【8. LPの目的・ゴール】');
      if (data.lp_goals.main_purpose) {
        lines.push(`LPの主な目的: ${data.lp_goals.main_purpose}`);
      }
      if (data.lp_goals.desired_cta) {
        lines.push(`希望するCTA: ${data.lp_goals.desired_cta}`);
      }
      if (data.lp_goals.additional_notes) {
        lines.push(`その他要望・メッセージ:\n${data.lp_goals.additional_notes}`);
      }
      lines.push('');
    }

    // AI分析結果
    if (data.ai_analysis) {
      lines.push('【AI分析結果】');
      if (data.ai_analysis.missing && data.ai_analysis.missing.length > 0) {
        lines.push(`不足している情報:\n${data.ai_analysis.missing.map((m: string) => `・${m}`).join('\n')}`);
      }
      if (data.ai_analysis.ambiguous && data.ai_analysis.ambiguous.length > 0) {
        lines.push(`曖昧な情報:\n${data.ai_analysis.ambiguous.map((a: string) => `・${a}`).join('\n')}`);
      }
      if (data.ai_analysis.contradictions && data.ai_analysis.contradictions.length > 0) {
        lines.push(`矛盾している情報:\n${data.ai_analysis.contradictions.map((c: string) => `・${c}`).join('\n')}`);
      }
      if (data.ai_analysis.summary) {
        lines.push(`要約:\n${data.ai_analysis.summary}`);
      }
      lines.push('');
    }

    // AI生成質問
    if (data.ai_questions && data.ai_questions.length > 0) {
      lines.push('【AI生成質問】');
      data.ai_questions.forEach((q: any, index: number) => {
        lines.push(`${index + 1}. [${q.priority}] ${q.question}`);
        if (q.reason) {
          lines.push(`   理由: ${q.reason}`);
        }
      });
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * クライアント事前入力内容を保存（JSON形式と読みやすい形式の両方）
   * @param projectFolderId プロジェクトフォルダID
   * @param clientInputData クライアント入力データ
   * @param fileNamePrefix ファイル名のプレフィックス（デフォルト: '01_クライアント事前入力'）
   */
  async saveClientInput(
    projectFolderId: string,
    clientInputData: ClientInputData,
    fileNamePrefix: string = '01_クライアント事前入力'
  ): Promise<{ jsonFileId: string; readableFileId: string }> {
    try {
      // JSON形式で保存
      const jsonContent = JSON.stringify(clientInputData, null, 2);
      const jsonFileId = await this.driveService.createDocument(
        `${fileNamePrefix}.json`,
        jsonContent,
        projectFolderId
      );

      // 読みやすい形式で保存
      const readableContent = this.formatClientInputForReadability(clientInputData);
      const readableFileId = await this.driveService.createDocument(
        fileNamePrefix,
        readableContent,
        projectFolderId
      );
      return { jsonFileId, readableFileId };
    } catch (error) {
      throw new Error(
        `クライアント入力保存エラー: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 確定コピーを読みやすい形式に変換
   */
  private formatCopyForReadability(copy: any): string {
    const lines: string[] = [];

    lines.push('=== 確定LPコピー ===\n');
    lines.push(`確定日時: ${new Date().toLocaleString('ja-JP')}`);
    lines.push('');

    // Heroセクション
    if (copy.hero) {
      lines.push('【Heroセクション】');
      if (copy.hero.headline) {
        lines.push(`メインキャッチコピー: ${copy.hero.headline}`);
      }
      if (copy.hero.subheadline) {
        lines.push(`サブキャッチコピー: ${copy.hero.subheadline}`);
      }
      if (copy.hero.supportText) {
        lines.push(`補足説明:\n${copy.hero.supportText}`);
      }
      lines.push('');
    }

    // Problemセクション
    if (copy.problem) {
      lines.push('【Problemセクション】');
      if (copy.problem.title) {
        lines.push(`タイトル: ${copy.problem.title}`);
      }
      if (copy.problem.description) {
        lines.push(`説明:\n${copy.problem.description}`);
      }
      lines.push('');
    }

    // Solutionセクション
    if (copy.solution) {
      lines.push('【Solutionセクション】');
      if (copy.solution.title) {
        lines.push(`タイトル: ${copy.solution.title}`);
      }
      if (copy.solution.description) {
        lines.push(`説明:\n${copy.solution.description}`);
      }
      lines.push('');
    }

    // Benefitsセクション
    if (copy.benefits && Array.isArray(copy.benefits)) {
      lines.push('【Benefitsセクション】');
      copy.benefits.forEach((benefit: any, index: number) => {
        lines.push(`メリット${index + 1}:`);
        if (benefit.title) {
          lines.push(`  タイトル: ${benefit.title}`);
        }
        if (benefit.description) {
          lines.push(`  説明: ${benefit.description}`);
        }
        lines.push('');
      });
    }

    // Social Proofセクション
    if (copy.socialProof) {
      lines.push('【Social Proofセクション】');
      if (copy.socialProof.title) {
        lines.push(`タイトル: ${copy.socialProof.title}`);
      }
      if (copy.socialProof.content) {
        lines.push(`内容:\n${copy.socialProof.content}`);
      }
      lines.push('');
    }

    // CTAセクション
    if (copy.cta) {
      lines.push('【CTAセクション】');
      if (copy.cta.primary) {
        lines.push(`メインCTA: ${copy.cta.primary}`);
      }
      if (copy.cta.secondary) {
        lines.push(`サブCTA: ${copy.cta.secondary}`);
      }
      lines.push('');
    }

    // 編集メモ
    if (copy.editingNotes) {
      lines.push('【編集メモ】');
      if (copy.editingNotes.suggestions && copy.editingNotes.suggestions.length > 0) {
        lines.push('調整提案:');
        copy.editingNotes.suggestions.forEach((suggestion: string) => {
          lines.push(` ・${suggestion}`);
        });
        lines.push('');
      }
      if (copy.editingNotes.improvements && copy.editingNotes.improvements.length > 0) {
        lines.push('改善点:');
        copy.editingNotes.improvements.forEach((improvement: string) => {
          lines.push(` ・${improvement}`);
        });
        lines.push('');
      }
    }

    return lines.join('\n');
  }

  /**
   * 確定コピーを保存（JSON形式と読みやすい形式の両方）
   */
  async saveFinalizedCopy(projectId: string, copy: any): Promise<{ jsonFileId: string; readableFileId: string }> {
    try {
      // プロジェクトデータを取得してフォルダIDを確認
      const { ClientInputHandler } = await import('./clientInputHandler');
      const clientInputHandler = new ClientInputHandler();
      const projectData = await clientInputHandler.getInput(projectId);

      if (!projectData || !projectData.project_id) {
        throw new Error('プロジェクトデータが見つかりません');
      }

      // プロジェクトフォルダIDを取得（既存のフォルダを使用）
      let projectFolderId = (projectData as any).project_folder_id;
      const projectName = projectData.basic_info?.service_name || '未設定';
      
      if (!projectFolderId) {
        projectFolderId = await this.findProjectFolder(projectId, projectName);
        
        if (projectFolderId) {
          await clientInputHandler.updateInput(projectId, {
            project_folder_id: projectFolderId,
          });
        } else {
          throw new Error(
            'プロジェクトフォルダが見つかりません。先に「Google Driveに保存」を実行してください。'
          );
        }
      } else {
        const foundFolderId = await this.findProjectFolder(projectId, projectName);
        
        if (foundFolderId && foundFolderId !== projectFolderId) {
          projectFolderId = foundFolderId;
          await clientInputHandler.updateInput(projectId, {
            project_folder_id: projectFolderId,
          });
        }
      }

      let jsonFileId: string;
      try {
        const jsonContent = JSON.stringify(copy, null, 2);
        jsonFileId = await this.driveService.createDocument(
          '03_確定LPコピー.json',
          jsonContent,
          projectFolderId
        );
      } catch (jsonError) {
        console.error('JSON形式の保存エラー:', jsonError);
        throw new Error(
          `JSON形式の保存に失敗しました: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`
        );
      }

      let readableFileId: string;
      try {
        const readableContent = this.formatCopyForReadability(copy);
        readableFileId = await this.driveService.createDocument(
          '03_確定LPコピー',
          readableContent,
          projectFolderId
        );
      } catch (readableError) {
        console.error('読みやすい形式の保存エラー:', readableError);
        throw new Error(
          `読みやすい形式の保存に失敗しました: ${readableError instanceof Error ? readableError.message : String(readableError)}`
        );
      }
      return { jsonFileId, readableFileId };
    } catch (error) {
      throw new Error(
        `確定コピー保存エラー: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * デザイン指示を読みやすい形式に変換
   */
  private formatDesignInstructionForReadability(instruction: any): string {
    const lines: string[] = [];

    lines.push('=== デザイン指示 ===\n');
    lines.push(`生成日時: ${new Date().toLocaleString('ja-JP')}`);
    lines.push('');

    // デザインコンセプト
    if (instruction.designConcept) {
      lines.push('【デザインコンセプト】');
      if (instruction.designConcept.overall) {
        lines.push(`全体コンセプト: ${instruction.designConcept.overall}`);
      }
      if (instruction.designConcept.visualDirection) {
        lines.push(`視覚的方向性: ${instruction.designConcept.visualDirection}`);
      }
      if (instruction.designConcept.keyMessage) {
        lines.push(`核心メッセージ: ${instruction.designConcept.keyMessage}`);
      }
      lines.push('');
    }

    // トーン
    if (instruction.tone) {
      lines.push('【トーン】');
      if (instruction.tone.mood) {
        lines.push(`ムード: ${instruction.tone.mood}`);
      }
      if (instruction.tone.colorPalette && instruction.tone.colorPalette.length > 0) {
        lines.push(`カラーパレット: ${instruction.tone.colorPalette.join(', ')}`);
      }
      if (instruction.tone.typography) {
        lines.push(`タイポグラフィ: ${instruction.tone.typography}`);
      }
      lines.push('');
    }

    // レイアウト
    if (instruction.layout) {
      lines.push('【レイアウト】');
      if (instruction.layout.overallStructure) {
        lines.push(`全体構造: ${instruction.layout.overallStructure}`);
      }
      if (instruction.layout.sectionOrder && instruction.layout.sectionOrder.length > 0) {
        lines.push(`セクション順序: ${instruction.layout.sectionOrder.join(' → ')}`);
      }
      if (instruction.layout.spacingGuidelines) {
        lines.push(`スペーシングガイドライン: ${instruction.layout.spacingGuidelines}`);
      }
      lines.push('');
    }

    // セクション別指示
    if (instruction.sections && instruction.sections.length > 0) {
      lines.push('【セクション別デザイン指示】');
      instruction.sections.forEach((section: any, index: number) => {
        lines.push(`\n${index + 1}. ${section.sectionName}セクション`);
        if (section.designIntent) {
          lines.push(`   デザイン意図: ${section.designIntent}`);
        }
        if (section.visualNotes) {
          lines.push(`   視覚的注意点: ${section.visualNotes}`);
        }
        if (section.layoutNotes) {
          lines.push(`   レイアウト指示: ${section.layoutNotes}`);
        }
        if (section.colorNotes) {
          lines.push(`   色の使い方: ${section.colorNotes}`);
        }
        if (section.typographyNotes) {
          lines.push(`   タイポグラフィ指示: ${section.typographyNotes}`);
        }
      });
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * デザイン指示を保存（JSON形式と読みやすい形式の両方）
   */
  async saveDesignInstruction(projectId: string, instruction: any): Promise<{ jsonFileId: string; readableFileId: string }> {
    try {
      // プロジェクトデータを取得してフォルダIDを確認
      const { ClientInputHandler } = await import('./clientInputHandler');
      const clientInputHandler = new ClientInputHandler();
      const projectData = await clientInputHandler.getInput(projectId);

      if (!projectData || !projectData.project_id) {
        throw new Error('プロジェクトデータが見つかりません');
      }

      // プロジェクトフォルダIDを取得（既存のフォルダを使用）
      let projectFolderId = (projectData as any).project_folder_id;
      const projectName = projectData.basic_info?.service_name || '未設定';
      
      if (!projectFolderId) {
        projectFolderId = await this.findProjectFolder(projectId, projectName);
        
        if (projectFolderId) {
          await clientInputHandler.updateInput(projectId, {
            project_folder_id: projectFolderId,
          });
        } else {
          throw new Error(
            'プロジェクトフォルダが見つかりません。先に「Google Driveに保存」を実行してください。'
          );
        }
      } else {
        const foundFolderId = await this.findProjectFolder(projectId, projectName);
        
        if (foundFolderId && foundFolderId !== projectFolderId) {
          projectFolderId = foundFolderId;
          await clientInputHandler.updateInput(projectId, {
            project_folder_id: projectFolderId,
          });
        }
      }

      const jsonContent = JSON.stringify(instruction, null, 2);
      const jsonFileId = await this.driveService.createDocument(
        '04_デザイン指示.json',
        jsonContent,
        projectFolderId
      );

      const readableContent = this.formatDesignInstructionForReadability(instruction);
      const readableFileId = await this.driveService.createDocument(
        '04_デザイン指示',
        readableContent,
        projectFolderId
      );
      return { jsonFileId, readableFileId };
    } catch (error) {
      throw new Error(
        `デザイン指示保存エラー: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Google Driveからプロジェクト一覧を取得
   */
  async getProjectsFromDrive(): Promise<ClientInputData[]> {
    try {
      const folders = await this.driveService.listProjectFolders();
      const projects: ClientInputData[] = [];

      for (const folder of folders) {
        try {
          // フォルダ名から案件番号と商品名を抽出（形式: "2026-001_商品名"）
          const folderNameParts = folder.name.split('_');
          if (folderNameParts.length < 2) {
            continue; // 形式が正しくない場合はスキップ
          }

          const projectNumber = folderNameParts[0];
          const serviceName = folderNameParts.slice(1).join('_');

          // フォルダ内のファイルを取得
          const files = await this.driveService.listFilesInFolder(folder.id);
          
          // JSONファイルを探す（"01_クライアント事前入力.json" または類似のファイル）
          const jsonFile = files.find((f: any) => 
            f.name.includes('クライアント事前入力') && f.name.endsWith('.json')
          );

          if (jsonFile) {
            try {
              // JSONファイルの内容を読み込む（Google Docsファイルとして保存されている場合はエクスポート）
              let jsonContent: string;
              if (jsonFile.mimeType === 'application/vnd.google-apps.document') {
                // Google Docsファイルの場合はエクスポート
                jsonContent = await this.driveService.exportFile(jsonFile.id, 'text/plain');
              } else {
                // 通常のファイルの場合は直接読み込み
                jsonContent = await this.driveService.readDocument(jsonFile.id);
              }
              const projectData = JSON.parse(jsonContent) as ClientInputData;

              // プロジェクトIDが存在しない場合は、案件番号から推測
              if (!projectData.project_id) {
                // 案件番号からプロジェクトIDを逆引き（簡易版）
                // 実際の実装では、project_numbers.jsonと照合する必要がある
                projectData.project_id = `project-${projectNumber}`;
              }

              // 基本情報を設定
              if (!projectData.basic_info) {
                projectData.basic_info = {
                  service_name: serviceName,
                } as any;
              } else if (!projectData.basic_info.service_name) {
                projectData.basic_info.service_name = serviceName;
              }

              // フォルダIDを設定
              projectData.project_folder_id = folder.id;

              // 作成日時と更新日時を設定
              if (folder.createdTime) {
                projectData.created_at = new Date(folder.createdTime).toISOString();
              }
              if (folder.modifiedTime) {
                projectData.updated_at = new Date(folder.modifiedTime).toISOString();
              }

              projects.push(projectData);
            } catch (parseError) {
              console.error(`フォルダ ${folder.name} のJSONファイル解析エラー:`, parseError);
              // JSONファイルが解析できない場合でも、基本情報だけは追加
              const basicProject: ClientInputData = {
                project_id: `project-${projectNumber}`,
                basic_info: {
                  service_name: serviceName,
                } as any,
                project_folder_id: folder.id,
                created_at: folder.createdTime ? new Date(folder.createdTime).toISOString() : undefined,
                updated_at: folder.modifiedTime ? new Date(folder.modifiedTime).toISOString() : undefined,
              };
              projects.push(basicProject);
            }
          } else {
            // JSONファイルが見つからない場合でも、基本情報だけは追加
            const basicProject: ClientInputData = {
              project_id: `project-${projectNumber}`,
              basic_info: {
                service_name: serviceName,
              } as any,
              project_folder_id: folder.id,
              created_at: folder.createdTime ? new Date(folder.createdTime).toISOString() : undefined,
              updated_at: folder.modifiedTime ? new Date(folder.modifiedTime).toISOString() : undefined,
            };
            projects.push(basicProject);
          }
        } catch (error) {
          console.error(`フォルダ ${folder.name} の処理エラー:`, error);
          // エラーが発生しても続行
        }
      }

      return projects;
    } catch (error) {
      console.error('Google Driveからプロジェクト一覧取得エラー:', error);
      return [];
    }
  }

  /**
   * Google Driveからプロジェクト詳細を取得
   */
  async getProjectFromDrive(projectId: string, projectFolderId: string): Promise<ClientInputData | null> {
    try {
      // フォルダ内のファイルを取得
      const files = await this.driveService.listFilesInFolder(projectFolderId);
      
      // JSONファイルを探す
      const jsonFile = files.find((f: any) => 
        f.name.includes('クライアント事前入力') && f.name.endsWith('.json')
      );

      if (jsonFile) {
        try {
          // JSONファイルの内容を読み込む（Google Docsファイルとして保存されている場合はエクスポート）
          let jsonContent: string;
          if (jsonFile.mimeType === 'application/vnd.google-apps.document') {
            // Google Docsファイルの場合はエクスポート
            jsonContent = await this.driveService.exportFile(jsonFile.id, 'text/plain');
          } else {
            // 通常のファイルの場合は直接読み込み
            jsonContent = await this.driveService.readDocument(jsonFile.id);
          }
          const projectData = JSON.parse(jsonContent) as ClientInputData;

          // プロジェクトIDとフォルダIDを設定
          projectData.project_id = projectId;
          projectData.project_folder_id = projectFolderId;

          return projectData;
        } catch (parseError) {
          console.error('JSONファイル解析エラー:', parseError);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error('Google Driveからプロジェクト詳細取得エラー:', error);
      return null;
    }
  }
}
