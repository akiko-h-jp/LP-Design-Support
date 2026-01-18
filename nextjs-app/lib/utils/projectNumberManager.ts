import fs from 'fs';
import path from 'path';

interface ProjectNumberRecord {
  project_id: string;
  project_number: string; // "2026-001" 形式
  year: number;
  sequence: number; // その年の連番
  created_at: string;
}

interface ProjectNumbersData {
  records: ProjectNumberRecord[];
}

const PROJECT_NUMBERS_FILE = path.join(process.cwd(), 'project_numbers.json');

export class ProjectNumberManager {
  private data: ProjectNumbersData = { records: [] };

  constructor() {
    this.loadRecords();
  }

  /**
   * 案件番号の記録を読み込む
   */
  private loadRecords(): void {
    try {
      if (fs.existsSync(PROJECT_NUMBERS_FILE)) {
        const content = fs.readFileSync(PROJECT_NUMBERS_FILE, 'utf8');
        this.data = JSON.parse(content);
        // 後方互換性のため、recordsが配列でない場合は初期化
        if (!Array.isArray(this.data.records)) {
          this.data.records = [];
        }
      } else {
        this.data = { records: [] };
      }
    } catch (error) {
      console.error('案件番号ファイルの読み込みエラー:', error);
      this.data = { records: [] };
    }
  }

  /**
   * 案件番号の記録を保存する
   */
  private saveRecords(): void {
    try {
      fs.writeFileSync(PROJECT_NUMBERS_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (error) {
      console.error('案件番号ファイルの保存エラー:', error);
      throw new Error('案件番号の保存に失敗しました');
    }
  }

  /**
   * 現在の年を取得
   */
  private getCurrentYear(): number {
    return new Date().getFullYear();
  }

  /**
   * プロジェクトIDに対応する案件番号を取得（存在しない場合は新規作成）
   * 形式: "YYYY-XXX" (例: "2026-001")
   */
  getOrCreateProjectNumber(projectId: string): string {
    // 既存の記録を確認
    const existingRecord = this.data.records.find((r) => r.project_id === projectId);
    if (existingRecord) {
      return existingRecord.project_number;
    }

    // 現在の年を取得
    const currentYear = this.getCurrentYear();

    // その年の既存の記録を取得
    const yearRecords = this.data.records.filter((r) => r.year === currentYear);

    // その年の最大連番を取得
    const maxSequence = yearRecords.length > 0
      ? Math.max(...yearRecords.map((r) => r.sequence))
      : 0;

    // 新しい連番を割り当て
    const newSequence = maxSequence + 1;

    // 案件番号を生成（3桁のゼロパディング）
    const projectNumber = `${currentYear}-${String(newSequence).padStart(3, '0')}`;

    // 新しい記録を追加
    const newRecord: ProjectNumberRecord = {
      project_id: projectId,
      project_number: projectNumber,
      year: currentYear,
      sequence: newSequence,
      created_at: new Date().toISOString(),
    };

    this.data.records.push(newRecord);
    this.saveRecords();

    return projectNumber;
  }

  /**
   * プロジェクトIDから案件番号を取得（存在しない場合はnull）
   */
  getProjectNumber(projectId: string): string | null {
    const record = this.data.records.find((r) => r.project_id === projectId);
    return record ? record.project_number : null;
  }
}
