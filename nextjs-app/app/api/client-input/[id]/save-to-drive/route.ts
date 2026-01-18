import { NextRequest, NextResponse } from 'next/server';
import { ClientInputHandler } from '@/lib/handlers/clientInputHandler';
import { DataStorageHandler } from '@/lib/handlers/dataStorageHandler';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Next.js 15ではparamsがPromiseの場合がある
    const resolvedParams = params instanceof Promise ? await params : params;
    const projectId = resolvedParams.id;

    // クライアント入力データを取得
    const clientInputHandler = new ClientInputHandler();
    const inputData = await clientInputHandler.getInput(projectId);

    if (!inputData) {
      return NextResponse.json(
        {
          success: false,
          message: 'プロジェクトが見つかりません',
          errors: ['指定されたプロジェクトIDのデータが見つかりません'],
        },
        { status: 404 }
      );
    }

    // 案件名を取得（サービス名を使用）
    const projectName =
      inputData.basic_info?.service_name ||
      `プロジェクト_${projectId.substring(0, 8)}`;

    // Google Driveに保存
    const dataStorageHandler = new DataStorageHandler();

    // 既存のフォルダIDを確認
    let projectFolderId: string;
    const savedFolderId = (inputData as any).project_folder_id;
    
    if (savedFolderId) {
      projectFolderId = savedFolderId;
    } else {
      // 案件番号を含むフォルダ名で既存フォルダを検索
      const foundFolderId = await dataStorageHandler.findProjectFolder(projectId, projectName);
      
      if (foundFolderId) {
        projectFolderId = foundFolderId;
        await clientInputHandler.updateInput(projectId, {
          project_folder_id: projectFolderId,
        });
      } else {
        // 既存のフォルダがない場合は新規作成
        projectFolderId = await dataStorageHandler.createProject(projectId, projectName);
        // フォルダIDをプロジェクトデータに保存
        await clientInputHandler.updateInput(projectId, {
          project_folder_id: projectFolderId,
        });
      }
    }

    // リクエストボディからファイル名プレフィックスを取得（オプション）
    let fileNamePrefix = '01_クライアント事前入力';
    try {
      const body = await request.json().catch(() => ({}));
      if (body.fileNamePrefix) {
        fileNamePrefix = body.fileNamePrefix;
      }
    } catch (e) {
      // リクエストボディがない場合はデフォルト値を使用
    }

    // クライアント入力データを保存（JSON形式と読みやすい形式の両方）
    const { jsonFileId, readableFileId } = await dataStorageHandler.saveClientInput(
      projectFolderId,
      inputData,
      fileNamePrefix
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Google Driveに保存しました（JSON形式と読みやすい形式の両方）',
        project_folder_id: projectFolderId,
        json_file_id: jsonFileId,
        readable_file_id: readableFileId,
        errors: [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in save-to-drive endpoint:', error);
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
