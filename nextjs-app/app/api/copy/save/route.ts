import { NextRequest, NextResponse } from 'next/server';
import { ClientInputHandler } from '@/lib/handlers/clientInputHandler';
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

    const handler = new ClientInputHandler();
    const result = await handler.updateInput(projectId, {
      generated_copy: copy,
    });

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: 'コピーを保存しました',
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in copy save endpoint:', error);
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
