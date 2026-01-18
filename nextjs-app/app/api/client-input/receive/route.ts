import { NextRequest, NextResponse } from 'next/server';
import { ClientInputHandler } from '@/lib/handlers/clientInputHandler';
import { convertFrontendToBackend } from '@/lib/utils/formatConverter';

const handler = new ClientInputHandler();

export async function POST(request: NextRequest) {
  try {
    const frontendData = await request.json();
    
    // データ形式を変換（フロントエンドの形式からバックエンドの形式へ）
    const backendData = convertFrontendToBackend(frontendData);
    
    const result = await handler.receiveInput(backendData);
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in receive endpoint:', error);
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
