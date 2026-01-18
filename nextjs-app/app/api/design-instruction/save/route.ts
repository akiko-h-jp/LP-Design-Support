import { NextRequest, NextResponse } from 'next/server';
import { ClientInputHandler } from '@/lib/handlers/clientInputHandler';
import { DesignInstruction } from '@/types/designInstruction';

export async function POST(request: NextRequest) {
  try {
    const { projectId, instruction } = await request.json();

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

    if (!instruction) {
      return NextResponse.json(
        {
          success: false,
          message: 'デザイン指示データが指定されていません',
          errors: ['instructionは必須です'],
        },
        { status: 400 }
      );
    }

    // アプリ内に保存（上書き）
    const handler = new ClientInputHandler();
    const result = await handler.updateInput(projectId, {
      design_instruction: instruction,
      design_instruction_generated_at: new Date().toISOString(),
    });

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: 'デザイン指示を保存しました',
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in design instruction save endpoint:', error);
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
