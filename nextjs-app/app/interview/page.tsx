'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Save,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Check,
  LogOut,
} from 'lucide-react';
import FormSection from '@/components/FormSection';
import InputField from '@/components/InputField';
import TextareaField from '@/components/TextareaField';
import SelectField from '@/components/SelectField';
import { ClientFormData } from '@/types/form';

interface AnalysisResult {
  missing: string[];
  ambiguous: string[];
  contradictions: string[];
  summary: string;
}

interface Question {
  question: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

const purposeOptions = [
  { value: 'download', label: '資料ダウンロード' },
  { value: 'contact', label: 'お問い合わせ' },
  { value: 'trial', label: '無料トライアル申込' },
  { value: 'purchase', label: '商品購入' },
  { value: 'registration', label: '会員登録' },
  { value: 'other', label: 'その他' },
];

export default function InterviewPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClientFormData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  // 認証チェック
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [sessionStatus, router]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // URLパラメータからprojectIdを取得
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('projectId');
    if (id) {
      setProjectId(id);
      fetchProjectDetail(id);
    }
  }, []);

  const fetchProjectDetail = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/client-input/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        
        if (data.aiAnalysis) {
          setAnalysis(data.aiAnalysis);
        }
        if (data.aiQuestions && Array.isArray(data.aiQuestions)) {
          setQuestions(data.aiQuestions);
        }
      } else {
        setStatus({
          type: 'error',
          message: 'プロジェクト詳細の取得に失敗しました',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'サーバーとの通信に失敗しました',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!projectId) return;

    setIsAnalyzing(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/interview/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      const result = await response.json();

      if (result.success && result.analysis) {
        setAnalysis(result.analysis);
        setStatus({
          type: 'success',
          message: '分析が完了しました',
        });
      } else {
        setStatus({
          type: 'error',
          message: result.message || '分析に失敗しました',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'サーバーとの通信に失敗しました',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!projectId) return;

    setIsGeneratingQuestions(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/interview/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      const result = await response.json();

      if (result.success && result.questions) {
        setQuestions(result.questions);
        setStatus({
          type: 'success',
          message: '追加質問を生成しました',
        });
      } else {
        setStatus({
          type: 'error',
          message: result.message || '質問生成に失敗しました',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'サーバーとの通信に失敗しました',
      });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const updateField = (section: keyof ClientFormData, field: string, value: string) => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!formData || !projectId) return;

    setIsSaving(true);
    try {
      // ヒアリング内容とAI分析結果、質問を一緒に保存
      const dataToSave: any = {
        ...formData,
      };

      // AI分析結果がある場合は含める
      if (analysis) {
        dataToSave.aiAnalysis = analysis;
      }

      // AI生成質問がある場合は含める
      if (questions.length > 0) {
        dataToSave.aiQuestions = questions;
      }

      const response = await fetch(`/api/client-input/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      const result = await response.json();

      if (result.success) {
        const savedItems = [];
        if (analysis) savedItems.push('AI分析結果');
        if (questions.length > 0) savedItems.push('追加質問');
        
        const message = savedItems.length > 0
          ? `保存しました（ヒアリング内容、${savedItems.join('、')}を含む）`
          : result.message || '保存しました';
        
        setStatus({
          type: 'success',
          message,
        });
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
    if (!formData || !projectId) return;

    setIsFinalizing(true);
    try {
      // まずアプリ内に保存（上書き）
      const dataToSave: any = {
        ...formData,
      };

      // AI分析結果がある場合は含める
      if (analysis) {
        dataToSave.aiAnalysis = analysis;
      }

      // AI生成質問がある場合は含める
      if (questions.length > 0) {
        dataToSave.aiQuestions = questions;
      }

      // アプリ内に保存
      const saveResponse = await fetch(`/api/client-input/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      const saveResult = await saveResponse.json();

      if (!saveResult.success) {
        setStatus({
          type: 'error',
          message: saveResult.message || '保存に失敗しました',
        });
        return;
      }

      // Google Driveに保存（ヒアリング時入力として保存）
      const driveResponse = await fetch(`/api/client-input/${projectId}/save-to-drive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileNamePrefix: '02_ヒアリング時入力',
        }),
      });

      const driveResult = await driveResponse.json();

      if (driveResult.success) {
        const savedItems = [];
        if (analysis) savedItems.push('AI分析結果');
        if (questions.length > 0) savedItems.push('追加質問');
        
        const message = savedItems.length > 0
          ? `確定しました（ヒアリング内容、${savedItems.join('、')}を含む）。Google Driveにも保存しました。`
          : '確定しました。Google Driveにも保存しました。';
        
        setStatus({
          type: 'success',
          message,
        });
      } else {
        setStatus({
          type: 'error',
          message: driveResult.message || 'Google Driveへの保存に失敗しました',
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return priority;
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">読み込み中...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href={projectId ? `/designer?projectId=${projectId}` : '/designer'}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            戻る
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ヒアリング整理画面</h1>
          <p className="text-gray-600">
            AIを活用したヒアリング内容の分析・整理
          </p>
        </div>

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

        {/* AI分析セクション */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
              AI分析結果
            </h2>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !projectId}
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  分析を実行
                </>
              )}
            </button>
          </div>

          {analysis ? (
            <div className="space-y-4">
              {analysis.missing.length > 0 && (
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                  <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    不足している情報
                  </h3>
                  <ul className="list-disc list-inside text-red-800 space-y-1">
                    {analysis.missing.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.ambiguous.length > 0 && (
                <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
                  <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    曖昧な情報
                  </h3>
                  <ul className="list-disc list-inside text-yellow-800 space-y-1">
                    {analysis.ambiguous.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.contradictions.length > 0 && (
                <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
                  <h3 className="font-semibold text-orange-900 mb-2 flex items-center">
                    <XCircle className="w-5 h-5 mr-2" />
                    矛盾している情報
                  </h3>
                  <ul className="list-disc list-inside text-orange-800 space-y-1">
                    {analysis.contradictions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.summary && (
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">総合的な評価</h3>
                  <p className="text-blue-800 whitespace-pre-wrap">{analysis.summary}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              「分析を実行」ボタンをクリックして、AI分析を開始してください
            </p>
          )}
        </div>

        {/* 追加質問セクション */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
              AI生成：追加質問
            </h2>
            <button
              onClick={handleGenerateQuestions}
              disabled={isGeneratingQuestions || !projectId}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isGeneratingQuestions ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  質問を生成
                </>
              )}
            </button>
          </div>

          {questions.length > 0 ? (
            <div className="space-y-3">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(
                        q.priority
                      )}`}
                    >
                      {getPriorityLabel(q.priority)}優先度
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 mb-2">{q.question}</p>
                  <p className="text-sm text-gray-600">{q.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              「質問を生成」ボタンをクリックして、追加質問を生成してください
            </p>
          )}
        </div>

        {/* ヒアリング内容編集セクション */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-gray-600" />
            ヒアリング内容の編集
          </h2>

          <form>
            <FormSection title="1. 基本情報" subtitle="貴社のサービスに関する基本情報">
              <InputField
                label="企業名"
                name="companyName"
                required
                value={formData.basicInfo.companyName}
                onChange={(value) => updateField('basicInfo', 'companyName', value)}
                placeholder="例: 株式会社サンプル"
              />
              <InputField
                label="サービス名・商品名"
                name="serviceName"
                required
                value={formData.basicInfo.serviceName}
                onChange={(value) => updateField('basicInfo', 'serviceName', value)}
                placeholder="例: サンプルサービス"
              />
              <InputField
                label="サービスURL"
                name="serviceUrl"
                type="url"
                optional
                value={formData.basicInfo.serviceUrl}
                onChange={(value) => updateField('basicInfo', 'serviceUrl', value)}
                placeholder="https://example.com"
              />
              <InputField
                label="業種・業界"
                name="industry"
                required
                value={formData.basicInfo.industry}
                onChange={(value) => updateField('basicInfo', 'industry', value)}
                placeholder="例: SaaS、EC、教育、不動産など"
              />
              <TextareaField
                label="事業内容"
                name="businessDescription"
                required
                value={formData.basicInfo.businessDescription}
                onChange={(value) => updateField('basicInfo', 'businessDescription', value)}
                placeholder="貴社の事業内容を簡潔にご記入ください"
                rows={4}
              />
            </FormSection>

            <FormSection title="2. ターゲット情報" subtitle="想定されるターゲット顧客について">
              <TextareaField
                label="主なターゲット"
                name="mainTarget"
                required
                value={formData.targetInfo.mainTarget}
                onChange={(value) => updateField('targetInfo', 'mainTarget', value)}
                placeholder="例: 中小企業の経営者、20-30代の女性、フリーランスのデザイナーなど"
                rows={3}
              />
              <TextareaField
                label="ターゲットの課題・悩み"
                name="targetIssues"
                required
                value={formData.targetInfo.targetIssues}
                onChange={(value) => updateField('targetInfo', 'targetIssues', value)}
                placeholder="ターゲットが抱えている課題や悩みを具体的にご記入ください"
                rows={4}
              />
            </FormSection>

            <FormSection title="3. 提供価値・ベネフィット" subtitle="貴社のサービスが提供する価値について">
              <TextareaField
                label="主な提供価値"
                name="mainValue"
                required
                value={formData.valueProposition.mainValue}
                onChange={(value) => updateField('valueProposition', 'mainValue', value)}
                placeholder="商品・サービスが顧客に提供する主な価値を記入してください"
                rows={4}
              />
              <TextareaField
                label="主な特徴・強み"
                name="mainFeatures"
                required
                value={formData.valueProposition.mainFeatures}
                onChange={(value) => updateField('valueProposition', 'mainFeatures', value)}
                placeholder="他社と差別化できる特徴や強みをご記入ください"
                rows={4}
              />
              <TextareaField
                label="顧客が得られるメリット"
                name="customerBenefits"
                required
                value={formData.benefits.customerBenefits}
                onChange={(value) => updateField('benefits', 'customerBenefits', value)}
                placeholder="3つ程度、具体的なメリットを箇条書きでご記入ください"
                hint="例: ・作業時間が50%削減 ・コストが30%削減 ・売上が2倍に増加"
                rows={5}
              />
            </FormSection>

            <FormSection
              title="4. 実績・社会証明"
              subtitle="信頼性を高める実績や証拠をお持ちであればご記入ください"
              optional
            >
              <TextareaField
                label="実績・数値"
                name="achievements"
                optional
                value={formData.proofPoints.achievements}
                onChange={(value) => updateField('proofPoints', 'achievements', value)}
                placeholder="例: 導入実績1,000社以上、ユーザー数10万人突破など"
                rows={3}
              />
              <TextareaField
                label="お客様の声・レビュー"
                name="customerReviews"
                optional
                value={formData.proofPoints.customerReviews}
                onChange={(value) => updateField('proofPoints', 'customerReviews', value)}
                placeholder="代表的な顧客の声や評価をご記入ください"
                rows={3}
              />
              <TextareaField
                label="メディア掲載"
                name="mediaFeatures"
                optional
                value={formData.proofPoints.mediaFeatures}
                onChange={(value) => updateField('proofPoints', 'mediaFeatures', value)}
                placeholder="掲載されたメディア名や記事タイトルをご記入ください"
                rows={3}
              />
              <TextareaField
                label="受賞歴・認定"
                name="awards"
                optional
                value={formData.proofPoints.awards}
                onChange={(value) => updateField('proofPoints', 'awards', value)}
                placeholder="受賞した賞や取得した認定をご記入ください"
                rows={3}
              />
            </FormSection>

            <FormSection
              title="5. 競合情報"
              subtitle="競合との違いを明確にするための情報をお持ちであればご記入ください"
              optional
            >
              <TextareaField
                label="主な競合サービス"
                name="mainCompetitors"
                optional
                value={formData.competitorInfo.mainCompetitors}
                onChange={(value) => updateField('competitorInfo', 'mainCompetitors', value)}
                placeholder="主要な競合サービス名をご記入ください"
                rows={3}
              />
              <TextareaField
                label="競合との違い・優位性"
                name="competitiveAdvantage"
                optional
                value={formData.competitorInfo.competitiveAdvantage}
                onChange={(value) => updateField('competitorInfo', 'competitiveAdvantage', value)}
                placeholder="競合と比較した際の優位性や差別化ポイントをご記入ください"
                rows={4}
              />
            </FormSection>

            <FormSection
              title="6. ブランド情報"
              subtitle="デザインの方向性を決めるための情報をお持ちであればご記入ください"
              optional
            >
              <TextareaField
                label="ブランドイメージ・トーン"
                name="brandImage"
                optional
                value={formData.brandInfo.brandImage}
                onChange={(value) => updateField('brandInfo', 'brandImage', value)}
                placeholder="例: モダン、信頼感、親しみやすい、プロフェッショナルなど"
                rows={3}
              />
              <TextareaField
                label="参考にしたいLP・サイト"
                name="referenceUrls"
                optional
                value={formData.brandInfo.referenceUrls}
                onChange={(value) => updateField('brandInfo', 'referenceUrls', value)}
                placeholder="参考にしたいWebサイトのURLを1行に1つずつご記入ください"
                hint="1行に1つのURLを入力してください"
                rows={4}
              />
              <InputField
                label="ブランドカラー"
                name="brandColor"
                optional
                value={formData.brandInfo.brandColor}
                onChange={(value) => updateField('brandInfo', 'brandColor', value)}
                placeholder="#FF5733"
              />
              <TextareaField
                label="使用したい画像・素材"
                name="imageAssets"
                optional
                value={formData.brandInfo.imageAssets}
                onChange={(value) => updateField('brandInfo', 'imageAssets', value)}
                placeholder="使用したい画像や素材についてご記入ください"
                rows={3}
              />
            </FormSection>

            <FormSection title="7. LPの目的・ゴール" subtitle="LPで達成したい目的を教えてください">
              <SelectField
                label="LPの主な目的"
                name="mainPurpose"
                required
                value={formData.goals.mainPurpose}
                onChange={(value) => updateField('goals', 'mainPurpose', value)}
                options={purposeOptions}
              />
              <InputField
                label="希望するCTA"
                name="desiredCta"
                optional
                value={formData.goals.desiredCta}
                onChange={(value) => updateField('goals', 'desiredCta', value)}
                placeholder="例: 無料で始める、資料をダウンロード、お問い合わせ"
              />
              <TextareaField
                label="その他要望・メッセージ"
                name="additionalRequests"
                optional
                value={formData.goals.additionalRequests}
                onChange={(value) => updateField('goals', 'additionalRequests', value)}
                placeholder="その他要望や伝えたいメッセージがあればご記入ください"
                rows={4}
              />
            </FormSection>
          </form>
        </div>
      </div>
    </div>
  );
}
