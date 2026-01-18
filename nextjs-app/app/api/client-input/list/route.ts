import { NextRequest, NextResponse } from 'next/server';
import { ClientInputHandler } from '@/lib/handlers/clientInputHandler';
import { convertBackendToFrontend } from '@/lib/utils/formatConverter';
import { ProjectNumberManager } from '@/lib/utils/projectNumberManager';

const handler = new ClientInputHandler();
const projectNumberManager = new ProjectNumberManager();

export async function GET(request: NextRequest) {
  try {
    const inputs = await handler.getAllInputs();
    
    const convertedInputs = inputs.map((input) => {
      const frontendData = convertBackendToFrontend(input);
      // 案件番号を取得（存在しない場合は新規作成）
      const projectNumber = projectNumberManager.getOrCreateProjectNumber(input.project_id || '');
      return {
        ...frontendData,
        project_id: input.project_id,
        project_number: projectNumber,
        created_at: input.created_at,
        updated_at: input.updated_at,
      };
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
