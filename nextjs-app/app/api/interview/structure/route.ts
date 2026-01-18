import { NextRequest, NextResponse } from 'next/server';
import { InterviewManagementHandler } from '@/lib/handlers/interviewManagementHandler';

const handler = new InterviewManagementHandler();

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        {
          success: false,
          errors: ['projectIdが必要です'],
        },
        { status: 400 }
      );
    }

    const result = await handler.structureContent(projectId);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in structure endpoint:', error);
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
