import { NextRequest, NextResponse } from 'next/server';
import { DesignInstructionHandler } from '@/lib/handlers/designInstructionHandler';

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json();

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

    const handler = new DesignInstructionHandler();
    const result = await handler.generateInstruction(projectId);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in design instruction generate endpoint:', error);
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
