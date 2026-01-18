'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import {
  Palette,
  Sparkles,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Save,
  Eye,
  Edit2,
  Check,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { DesignInstruction } from '@/types/designInstruction';
import InputField from '@/components/InputField';
import TextareaField from '@/components/TextareaField';

export default function DesignInstructionPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  // 認証チェック
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [sessionStatus, router]);

  const [instruction, setInstruction] = useState<DesignInstruction | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // プロジェクトデータを読み込んで、既存のデザイン指示を確認
  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const fetchProjectData = async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/client-input/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        // 確定デザイン指示を優先的に表示、なければ生成済みデザイン指示を表示
        if (data.finalized_design_instruction) {
          setInstruction(data.finalized_design_instruction);
        } else if (data.design_instruction) {
          setInstruction(data.design_instruction);
        }
      }
    } catch (error) {
      console.error('プロジェクトデータの取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!projectId) {
      setStatus({
        type: 'error',
        message: 'プロジェクトIDが指定されていません',
      });
      return;
    }

    setIsGenerating(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/design-instruction/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      const result = await response.json();

      if (result.success && result.instruction) {
        setInstruction(result.instruction);
        setStatus({
          type: 'success',
          message: 'デザイン指示を生成しました',
        });
      } else {
        setStatus({
          type: 'error',
          message: result.message || 'デザイン指示生成に失敗しました',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'サーバーとの通信に失敗しました',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!projectId || !instruction) {
      setStatus({
        type: 'error',
        message: '保存するデザイン指示がありません',
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/design-instruction/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, instruction }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          type: 'success',
          message: 'デザイン指示を保存しました',
        });
        setIsEditing(false);
      } else {
        setStatus({
          type: 'error',
          message: result.message || '保存に失敗しました',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'サーバーとの通信に失敗しました',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalize = async () => {
    if (!projectId || !instruction) {
      setStatus({
        type: 'error',
        message: '確定するデザイン指示がありません',
      });
      return;
    }

    setIsFinalizing(true);
    try {
      const response = await fetch('/api/design-instruction/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, instruction }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          type: 'success',
          message: 'デザイン指示を確定しました',
        });
        setIsEditing(false);
      } else {
        setStatus({
          type: 'error',
          message: result.message || '確定に失敗しました',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'サーバーとの通信に失敗しました',
      });
    } finally {
      setIsFinalizing(false);
    }
  };

  const updateInstructionField = (path: string[], value: any) => {
    if (!instruction) return;
    setInstruction((prev) => {
      if (!prev) return null;
      const updated = JSON.parse(JSON.stringify(prev)); // 深いコピー
      let current: any = updated;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return updated;
    });
  };

  const updateSectionField = (sectionIndex: number, field: string, value: any) => {
    if (!instruction) return;
    setInstruction((prev) => {
      if (!prev) return null;
      const updated = JSON.parse(JSON.stringify(prev));
      updated.sections[sectionIndex][field] = value;
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/designer?projectId=${projectId}`}>
              <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Palette className="w-8 h-8 text-purple-600" />
                デザイン指示生成
              </h1>
              <p className="text-gray-600 mt-1">
                確定コピーからデザイン指示を生成します
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !projectId}
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  デザイン指示を生成
                </>
              )}
            </button>
            {instruction && (
              <>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {isEditing ? '編集を終了' : '編集する'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      保存
                    </>
                  )}
                </button>
                <button
                  onClick={handleFinalize}
                  disabled={isFinalizing}
                  className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 transition-colors"
                >
                  {isFinalizing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      確定中...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      確定
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ステータスメッセージ */}
        {status.type && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start ${
              status.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            )}
            <p
              className={`font-medium ${
                status.type === 'success' ? 'text-green-900' : 'text-red-900'
              }`}
            >
              {status.message}
            </p>
          </div>
        )}

        {/* デザイン指示表示エリア */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-600 mt-4">読み込み中...</p>
          </div>
        ) : instruction ? (
          <div className="space-y-6">
            {/* デザインコンセプト */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                デザインコンセプト
              </h2>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <TextareaField
                      label="全体コンセプト"
                      name="overall"
                      value={instruction.designConcept.overall}
                      onChange={(value) => updateInstructionField(['designConcept', 'overall'], value)}
                      placeholder="全体コンセプトを入力"
                      rows={3}
                    />
                    <InputField
                      label="視覚的方向性"
                      name="visualDirection"
                      value={instruction.designConcept.visualDirection}
                      onChange={(value) => updateInstructionField(['designConcept', 'visualDirection'], value)}
                      placeholder="視覚的方向性を入力"
                    />
                    <InputField
                      label="核心メッセージ"
                      name="keyMessage"
                      value={instruction.designConcept.keyMessage}
                      onChange={(value) => updateInstructionField(['designConcept', 'keyMessage'], value)}
                      placeholder="核心メッセージを入力"
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        全体コンセプト
                      </label>
                      <p className="text-gray-900 whitespace-pre-wrap">{instruction.designConcept.overall}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        視覚的方向性
                      </label>
                      <p className="text-gray-900">{instruction.designConcept.visualDirection}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        核心メッセージ
                      </label>
                      <p className="text-gray-900">{instruction.designConcept.keyMessage}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* トーン */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">トーン</h2>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <InputField
                      label="ムード"
                      name="mood"
                      value={instruction.tone.mood}
                      onChange={(value) => updateInstructionField(['tone', 'mood'], value)}
                      placeholder="ムードを入力"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">カラーパレット</label>
                      <div className="space-y-2">
                        {instruction.tone.colorPalette.map((color, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <InputField
                              label=""
                              name={`color${index}`}
                              value={color}
                              onChange={(value) => {
                                const newPalette = [...instruction.tone.colorPalette];
                                newPalette[index] = value;
                                updateInstructionField(['tone', 'colorPalette'], newPalette);
                              }}
                              placeholder="カラーコードを入力（例: #3B82F6）"
                            />
                            <div
                              className="w-8 h-8 rounded border border-gray-300 flex-shrink-0"
                              style={{ backgroundColor: color }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <InputField
                      label="タイポグラフィ"
                      name="typography"
                      value={instruction.tone.typography}
                      onChange={(value) => updateInstructionField(['tone', 'typography'], value)}
                      placeholder="タイポグラフィを入力"
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ムード</label>
                      <p className="text-gray-900">{instruction.tone.mood}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">カラーパレット</label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {instruction.tone.colorPalette.map((color, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded border border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm text-gray-700">{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">タイポグラフィ</label>
                      <p className="text-gray-900">{instruction.tone.typography}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* レイアウト */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">レイアウト</h2>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <TextareaField
                      label="全体構造"
                      name="overallStructure"
                      value={instruction.layout.overallStructure}
                      onChange={(value) => updateInstructionField(['layout', 'overallStructure'], value)}
                      placeholder="全体構造を入力"
                      rows={2}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">セクション順序</label>
                      <div className="space-y-2">
                        {instruction.layout.sectionOrder.map((section, index) => (
                          <InputField
                            key={index}
                            label={`${index + 1}. セクション名`}
                            name={`section${index}`}
                            value={section}
                            onChange={(value) => {
                              const newOrder = [...instruction.layout.sectionOrder];
                              newOrder[index] = value;
                              updateInstructionField(['layout', 'sectionOrder'], newOrder);
                            }}
                            placeholder="セクション名を入力"
                          />
                        ))}
                      </div>
                    </div>
                    <TextareaField
                      label="スペーシングガイドライン"
                      name="spacingGuidelines"
                      value={instruction.layout.spacingGuidelines}
                      onChange={(value) => updateInstructionField(['layout', 'spacingGuidelines'], value)}
                      placeholder="スペーシングガイドラインを入力"
                      rows={3}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">全体構造</label>
                      <p className="text-gray-900">{instruction.layout.overallStructure}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">セクション順序</label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {instruction.layout.sectionOrder.map((section, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {index + 1}. {section}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">スペーシングガイドライン</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{instruction.layout.spacingGuidelines}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* セクション別デザイン指示 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">セクション別デザイン指示</h2>
              <div className="space-y-6">
                {instruction.sections.map((section, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                    {isEditing ? (
                      <div className="mb-3">
                        <InputField
                          label="セクション名"
                          name={`sectionName${index}`}
                          value={section.sectionName}
                          onChange={(value) => updateSectionField(index, 'sectionName', value)}
                          placeholder="セクション名を入力"
                        />
                      </div>
                    ) : (
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {section.sectionName}セクション
                      </h3>
                    )}
                    <div className="space-y-2">
                      {isEditing ? (
                        <>
                          <TextareaField
                            label="デザイン意図"
                            name={`designIntent${index}`}
                            value={section.designIntent}
                            onChange={(value) => updateSectionField(index, 'designIntent', value)}
                            placeholder="デザイン意図を入力"
                            rows={3}
                          />
                          <TextareaField
                            label="視覚的注意点"
                            name={`visualNotes${index}`}
                            value={section.visualNotes}
                            onChange={(value) => updateSectionField(index, 'visualNotes', value)}
                            placeholder="視覚的注意点を入力"
                            rows={3}
                          />
                          <TextareaField
                            label="レイアウト指示"
                            name={`layoutNotes${index}`}
                            value={section.layoutNotes}
                            onChange={(value) => updateSectionField(index, 'layoutNotes', value)}
                            placeholder="レイアウト指示を入力"
                            rows={3}
                          />
                          <TextareaField
                            label="色の使い方（任意）"
                            name={`colorNotes${index}`}
                            value={section.colorNotes || ''}
                            onChange={(value) => updateSectionField(index, 'colorNotes', value)}
                            placeholder="色の使い方を入力（任意）"
                            rows={2}
                            optional
                          />
                          <TextareaField
                            label="タイポグラフィ指示（任意）"
                            name={`typographyNotes${index}`}
                            value={section.typographyNotes || ''}
                            onChange={(value) => updateSectionField(index, 'typographyNotes', value)}
                            placeholder="タイポグラフィ指示を入力（任意）"
                            rows={2}
                            optional
                          />
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">デザイン意図</label>
                            <p className="text-gray-900 whitespace-pre-wrap">{section.designIntent}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">視覚的注意点</label>
                            <p className="text-gray-900 whitespace-pre-wrap">{section.visualNotes}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">レイアウト指示</label>
                            <p className="text-gray-900 whitespace-pre-wrap">{section.layoutNotes}</p>
                          </div>
                          {section.colorNotes && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">色の使い方</label>
                              <p className="text-gray-900 whitespace-pre-wrap">{section.colorNotes}</p>
                            </div>
                          )}
                          {section.typographyNotes && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">タイポグラフィ指示</label>
                              <p className="text-gray-900 whitespace-pre-wrap">{section.typographyNotes}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Palette className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              デザイン指示がまだ生成されていません
            </p>
            <p className="text-sm text-gray-500">
              「デザイン指示を生成」ボタンをクリックして、確定コピーからデザイン指示を生成してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
