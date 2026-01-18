'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import {
  FileText,
  Sparkles,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Save,
  Copy as CopyIcon,
  Edit2,
  Check,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { LPCopy } from '@/types/copy';
import InputField from '@/components/InputField';
import TextareaField from '@/components/TextareaField';

function CopyPageContent() {
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

  const [copy, setCopy] = useState<LPCopy | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // プロジェクトデータを読み込んで、既存のコピーを確認
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
        // 確定コピーを優先的に表示、なければ生成済みコピーを表示
        if (data.finalized_copy) {
          setCopy(data.finalized_copy);
        } else if (data.generated_copy) {
          setCopy(data.generated_copy);
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
      const response = await fetch('/api/copy/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      const result = await response.json();

      if (result.success && result.copy) {
        setCopy(result.copy);
        setStatus({
          type: 'success',
          message: 'LPコピーを生成しました',
        });
      } else {
        setStatus({
          type: 'error',
          message: result.message || 'コピー生成に失敗しました',
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
    if (!projectId || !copy) {
      setStatus({
        type: 'error',
        message: '保存するコピーがありません',
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/copy/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, copy }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          type: 'success',
          message: 'コピーを保存しました',
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
    if (!projectId || !copy) {
      setStatus({
        type: 'error',
        message: '確定するコピーがありません',
      });
      return;
    }

    setIsFinalizing(true);
    try {
      const response = await fetch('/api/copy/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, copy }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          type: 'success',
          message: 'コピーを確定しました',
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

  const updateCopyField = (section: keyof LPCopy, field: string, value: any) => {
    if (!copy) return;
    setCopy((prev) => {
      if (!prev) return null;
      const updated = { ...prev };
      if (section === 'benefits' && Array.isArray(prev.benefits)) {
        const index = parseInt(field);
        updated.benefits = [...prev.benefits];
        updated.benefits[index] = { ...updated.benefits[index], ...value };
      } else {
        (updated[section] as any)[field] = value;
      }
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
                <FileText className="w-8 h-8 text-blue-600" />
                LPコピー生成
              </h1>
              <p className="text-gray-600 mt-1">
                ヒアリング内容からLPコピーを自動生成します
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !projectId}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  コピーを生成
                </>
              )}
            </button>
            {copy && (
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

        {/* コピー表示エリア */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-600 mt-4">読み込み中...</p>
          </div>
        ) : copy ? (
          <div className="space-y-6">
            {/* Heroセクション */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CopyIcon className="w-5 h-5 text-blue-600" />
                Heroセクション
              </h2>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <InputField
                      label="メインキャッチコピー"
                      name="headline"
                      value={copy.hero.headline}
                      onChange={(value) => updateCopyField('hero', 'headline', value)}
                      placeholder="メインキャッチコピーを入力"
                    />
                    <InputField
                      label="サブキャッチコピー"
                      name="subheadline"
                      value={copy.hero.subheadline}
                      onChange={(value) => updateCopyField('hero', 'subheadline', value)}
                      placeholder="サブキャッチコピーを入力"
                    />
                    <TextareaField
                      label="補足説明"
                      name="supportText"
                      value={copy.hero.supportText}
                      onChange={(value) => updateCopyField('hero', 'supportText', value)}
                      placeholder="補足説明を入力"
                      rows={3}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        メインキャッチコピー
                      </label>
                      <p className="text-lg font-semibold text-gray-900">{copy.hero.headline}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        サブキャッチコピー
                      </label>
                      <p className="text-base text-gray-800">{copy.hero.subheadline}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        補足説明
                      </label>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{copy.hero.supportText}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Problemセクション */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Problemセクション</h2>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <InputField
                      label="タイトル"
                      name="problemTitle"
                      value={copy.problem.title}
                      onChange={(value) => updateCopyField('problem', 'title', value)}
                      placeholder="課題セクションのタイトル"
                    />
                    <TextareaField
                      label="説明"
                      name="problemDescription"
                      value={copy.problem.description}
                      onChange={(value) => updateCopyField('problem', 'description', value)}
                      placeholder="ターゲットの課題を具体的に説明"
                      rows={4}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                      <p className="text-lg font-semibold text-gray-900">{copy.problem.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                      <p className="text-gray-700 whitespace-pre-wrap">{copy.problem.description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Solutionセクション */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Solutionセクション</h2>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <InputField
                      label="タイトル"
                      name="solutionTitle"
                      value={copy.solution.title}
                      onChange={(value) => updateCopyField('solution', 'title', value)}
                      placeholder="解決策セクションのタイトル"
                    />
                    <TextareaField
                      label="説明"
                      name="solutionDescription"
                      value={copy.solution.description}
                      onChange={(value) => updateCopyField('solution', 'description', value)}
                      placeholder="サービスが提供する解決策を説明"
                      rows={4}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                      <p className="text-lg font-semibold text-gray-900">{copy.solution.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                      <p className="text-gray-700 whitespace-pre-wrap">{copy.solution.description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Benefitsセクション */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Benefitsセクション</h2>
              <div className="space-y-4">
                {copy.benefits.map((benefit, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    {isEditing ? (
                      <>
                        <InputField
                          label={`メリット${index + 1}のタイトル`}
                          name={`benefitTitle${index}`}
                          value={benefit.title}
                          onChange={(value) => updateCopyField('benefits', String(index), { title: value, description: benefit.description })}
                          placeholder="メリットのタイトル"
                        />
                        <TextareaField
                          label={`メリット${index + 1}の説明`}
                          name={`benefitDescription${index}`}
                          value={benefit.description}
                          onChange={(value) => updateCopyField('benefits', String(index), { title: benefit.title, description: value })}
                          placeholder="メリットの説明"
                          rows={3}
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{benefit.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proofセクション */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Social Proofセクション</h2>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <InputField
                      label="タイトル"
                      name="socialProofTitle"
                      value={copy.socialProof.title}
                      onChange={(value) => updateCopyField('socialProof', 'title', value)}
                      placeholder="実績・社会証明のタイトル"
                    />
                    <TextareaField
                      label="内容"
                      name="socialProofContent"
                      value={copy.socialProof.content}
                      onChange={(value) => updateCopyField('socialProof', 'content', value)}
                      placeholder="実績やお客様の声を記載"
                      rows={4}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                      <p className="text-lg font-semibold text-gray-900">{copy.socialProof.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                      <p className="text-gray-700 whitespace-pre-wrap">{copy.socialProof.content}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* CTAセクション */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">CTAセクション</h2>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <InputField
                      label="メインCTA"
                      name="ctaPrimary"
                      value={copy.cta.primary}
                      onChange={(value) => updateCopyField('cta', 'primary', value)}
                      placeholder="メインCTA（例: 今すぐ無料で始める）"
                    />
                    <InputField
                      label="サブCTA"
                      name="ctaSecondary"
                      optional
                      value={copy.cta.secondary || ''}
                      onChange={(value) => updateCopyField('cta', 'secondary', value)}
                      placeholder="サブCTA（任意）"
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        メインCTA
                      </label>
                      <p className="text-lg font-semibold text-blue-600">{copy.cta.primary}</p>
                    </div>
                    {copy.cta.secondary && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          サブCTA
                        </label>
                        <p className="text-base text-gray-700">{copy.cta.secondary}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 編集メモ */}
            {copy.editingNotes && (
              <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">編集メモ</h2>
                <div className="space-y-4">
                  {copy.editingNotes.suggestions && copy.editingNotes.suggestions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">調整提案</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {copy.editingNotes.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {copy.editingNotes.improvements && copy.editingNotes.improvements.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">改善点</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {copy.editingNotes.improvements.map((improvement, index) => (
                          <li key={index}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              コピーがまだ生成されていません
            </p>
            <p className="text-sm text-gray-500">
              「コピーを生成」ボタンをクリックして、LPコピーを生成してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CopyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    }>
      <CopyPageContent />
    </Suspense>
  );
}
