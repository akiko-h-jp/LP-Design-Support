import { NextRequest, NextResponse } from 'next/server';
import { ClientInputHandler } from '@/lib/handlers/clientInputHandler';
import { DataStorageHandler } from '@/lib/handlers/dataStorageHandler';
import { convertBackendToFrontend } from '@/lib/utils/formatConverter';
import { ProjectNumberManager } from '@/lib/utils/projectNumberManager';

const handler = new ClientInputHandler();
const projectNumberManager = new ProjectNumberManager();

// DataStorageHandlerは必要になったときに初期化（Google Drive APIの認証エラーを避けるため）
function getDataStorageHandler(): DataStorageHandler | null {
  try {
    return new DataStorageHandler();
  } catch (error) {
    console.error('DataStorageHandler初期化エラー:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // 一時保存のデータを取得
    const tempInputs = await handler.getAllInputs();
    
    // Google Driveからデータを取得
    let driveInputs: any[] = [];
    const storageHandler = getDataStorageHandler();
    if (storageHandler) {
      try {
        driveInputs = await storageHandler.getProjectsFromDrive();
      } catch (driveError) {
        console.error('[API] Error fetching from Google Drive:', driveError);
        // Google Driveのエラーは無視して、一時保存のデータだけを返す
      }
    }

    // プロジェクトIDをキーにして統合（Google Driveのデータを優先）
    const projectMap = new Map<string, any>();

    // まず一時保存のデータを追加
    tempInputs.forEach((input) => {
      if (input.project_id) {
        const frontendData = convertBackendToFrontend(input);
        const projectNumber = projectNumberManager.getOrCreateProjectNumber(input.project_id);
        projectMap.set(input.project_id, {
          ...frontendData,
          project_id: input.project_id,
          project_number: projectNumber,
          created_at: input.created_at,
          updated_at: input.updated_at,
          source: 'temp', // データソースを記録
        });
      }
    });

    // Google Driveのデータを追加（既存のデータを上書き）
    driveInputs.forEach((input) => {
      if (input.project_id) {
        const frontendData = convertBackendToFrontend(input);
        // 案件番号を取得（フォルダ名から抽出したものがあれば使用）
        let projectNumber = projectNumberManager.getProjectNumber(input.project_id);
        if (!projectNumber && input.project_folder_id) {
          // フォルダ名から案件番号を抽出（形式: "2026-001_商品名"）
          const folderName = input.basic_info?.service_name || '';
          const folderNameParts = folderName.split('_');
          if (folderNameParts.length >= 2) {
            projectNumber = folderNameParts[0];
          }
        }
        if (!projectNumber) {
          projectNumber = projectNumberManager.getOrCreateProjectNumber(input.project_id);
        }
        
        projectMap.set(input.project_id, {
          ...frontendData,
          project_id: input.project_id,
          project_number: projectNumber,
          created_at: input.created_at,
          updated_at: input.updated_at,
          project_folder_id: input.project_folder_id,
          source: 'drive', // データソースを記録
        });
      }
    });

    // Mapから配列に変換して、更新日時でソート
    const convertedInputs = Array.from(projectMap.values()).sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return dateB - dateA; // 新しい順
    });

    return NextResponse.json(convertedInputs, { status: 200 });
  } catch (error) {
    console.error('[API] Error in list endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        message: `エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
        errors: [error instanceof Error ? error.message : String(error)],
      },
      { status: 500 }
    );
  }
}
