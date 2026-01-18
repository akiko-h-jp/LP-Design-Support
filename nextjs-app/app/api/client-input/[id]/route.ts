import { NextRequest, NextResponse } from 'next/server';
import { ClientInputHandler } from '@/lib/handlers/clientInputHandler';
import { convertFrontendToBackend, convertBackendToFrontend } from '@/lib/utils/formatConverter';

const handler = new ClientInputHandler();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const projectId = resolvedParams.id;
    
    const inputData = await handler.getInput(projectId);
    
    if (inputData) {
      const convertedData = convertBackendToFrontend(inputData);
      return NextResponse.json({
        ...convertedData,
        project_id: inputData.project_id,
        created_at: inputData.created_at,
        updated_at: inputData.updated_at,
        // AI分析結果と質問も含める（変換関数で処理されない場合のフォールバック）
        ...(inputData.ai_analysis && { aiAnalysis: inputData.ai_analysis }),
        ...(inputData.ai_questions && { aiQuestions: inputData.ai_questions }),
        // 確定コピーとデザイン指示も含める
        ...(inputData.finalized_copy && { finalized_copy: inputData.finalized_copy }),
        ...(inputData.design_instruction && { design_instruction: inputData.design_instruction }),
        ...(inputData.finalized_design_instruction && { finalized_design_instruction: inputData.finalized_design_instruction }),
      }, { status: 200 });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'プロジェクトが見つかりません',
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('[API] Error in get endpoint:', error);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const projectId = resolvedParams.id;
    const frontendData = await request.json();
    
    const existingData = await handler.getInput(projectId);
    if (!existingData) {
      return NextResponse.json(
        {
          success: false,
          message: 'プロジェクトが見つかりません',
          errors: ['指定されたプロジェクトIDのデータが見つかりません'],
        },
        { status: 404 }
      );
    }
    
    const convertedData = convertFrontendToBackend(frontendData);
    
    const result = await handler.updateInput(projectId, convertedData);
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in update endpoint:', error);
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
