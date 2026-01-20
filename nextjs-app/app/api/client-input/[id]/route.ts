import { NextRequest, NextResponse } from 'next/server';
import { ClientInputHandler } from '@/lib/handlers/clientInputHandler';
import { DataStorageHandler } from '@/lib/handlers/dataStorageHandler';
import { convertFrontendToBackend, convertBackendToFrontend } from '@/lib/utils/formatConverter';

const handler = new ClientInputHandler();
const dataStorageHandler = new DataStorageHandler();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const projectId = resolvedParams.id;
    
    // まず一時保存のデータを取得
    let inputData = await handler.getInput(projectId);
    
    // 一時保存にデータがない場合、Google Driveから取得を試みる
    if (!inputData) {
      try {
        // プロジェクト一覧から該当するプロジェクトを探す
        const driveProjects = await dataStorageHandler.getProjectsFromDrive();
        const driveProject = driveProjects.find((p) => p.project_id === projectId);
        
        if (driveProject && driveProject.project_folder_id) {
          // Google Driveから詳細データを取得
          const driveData = await dataStorageHandler.getProjectFromDrive(
            projectId,
            driveProject.project_folder_id
          );
          
          if (driveData) {
            inputData = driveData;
          }
        }
      } catch (driveError) {
        console.error('[API] Error fetching from Google Drive:', driveError);
        // Google Driveのエラーは無視
      }
    } else {
      // 一時保存にデータがある場合でも、Google Driveから最新データを取得してマージ
      if (inputData.project_folder_id) {
        try {
          const driveData = await dataStorageHandler.getProjectFromDrive(
            projectId,
            inputData.project_folder_id
          );
          
          if (driveData) {
            // Google Driveのデータを優先してマージ
            inputData = {
              ...inputData,
              ...driveData,
              project_id: projectId, // project_idは確実に設定
            };
          }
        } catch (driveError) {
          console.error('[API] Error fetching from Google Drive:', driveError);
          // Google Driveのエラーは無視して、一時保存のデータを使用
        }
      }
    }
    
    if (inputData) {
      const convertedData = convertBackendToFrontend(inputData);
      return NextResponse.json({
        ...convertedData,
        project_id: inputData.project_id,
        created_at: inputData.created_at,
        updated_at: inputData.updated_at,
        project_folder_id: inputData.project_folder_id,
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
