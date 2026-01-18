import { NextRequest, NextResponse } from 'next/server';
import { ClientInputHandler } from '@/lib/handlers/clientInputHandler';
import { DataStorageHandler } from '@/lib/handlers/dataStorageHandler';
import { LPCopy } from '@/types/copy';

export async function POST(request: NextRequest) {
  try {
    const { projectId, copy } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        {
          success: false,
          message: 'プロジェクトIDが指定されていません',
          errors: ['projectIdは必須です'],
        },
        { status: 400 }
      );
    }

    if (!copy) {
      return NextResponse.json(
        {
          success: false,
          message: 'コピーデータが指定されていません',
          errors: ['copyは必須です'],
        },
        { status: 400 }
      );
    }

    // 確定コピーを保存
    const handler = new ClientInputHandler();
    const result = await handler.updateInput(projectId, {
      finalized_copy: copy,
      finalized_at: new Date().toISOString(),
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    // Google Driveに確定コピーを保存
    let driveSaveResult;
    try {
      const storageHandler = new DataStorageHandler();
      driveSaveResult = await storageHandler.saveFinalizedCopy(projectId, copy);
    } catch (error) {
      console.error('Google Driveへの保存エラー:', error);
      console.error('エラー詳細:', error instanceof Error ? error.stack : String(error));
      // Google Driveへの保存が失敗した場合はエラーを返す
      return NextResponse.json(
        {
          success: false,
          message: 'コピーを確定しましたが、Google Driveへの保存に失敗しました',
          error: error instanceof Error ? error.message : String(error),
          errors: [error instanceof Error ? error.message : String(error)],
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'コピーを確定し、Google Driveに保存しました',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in copy finalize endpoint:', error);
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
