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

    const result = await handler.analyzeInformation(projectId);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('[API] Error in analyze endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      {
        success: false,
        message: `エラーが発生しました: ${errorMessage}`,
        errors: [errorMessage],
      },
      { status: 500 }
    );
  }
}
