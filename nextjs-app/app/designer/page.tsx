'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ArrowLeft, 
  Edit2, 
  Save, 
  FolderOpen,
  Calendar,
  Building2,
  Sparkles,
  Palette,
  LogOut
} from 'lucide-react';
import FormSection from '@/components/FormSection';
import InputField from '@/components/InputField';
import TextareaField from '@/components/TextareaField';
import SelectField from '@/components/SelectField';
import { ClientFormData, ApiResponse, FormErrors } from '@/types/form';
import { validateForm } from '@/lib/utils/validation';
import { signOut } from 'next-auth/react';

interface ProjectListItem {
  project_id: string;
  project_number?: string;
  basicInfo?: {
    companyName: string;
    serviceName: string;
  };
  created_at?: string;
  updated_at?: string;
}

const purposeOptions = [
  { value: 'download', label: '資料ダウンロード' },
  { value: 'contact', label: 'お問い合わせ' },
  { value: 'trial', label: '無料トライアル申込' },
  { value: 'purchase', label: '商品購入' },
  { value: 'registration', label: '会員登録' },
  { value: 'other', label: 'その他' },
];

export default function DesignerPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClientFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // 認証チェック
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [sessionStatus, router]);

  // URLパラメータからprojectIdを取得して詳細ビューに切り替え
  useEffect(() => {
    const projectIdFromUrl = searchParams.get('projectId');
    if (projectIdFromUrl) {
      setSelectedProjectId(projectIdFromUrl);
      setView('detail');
    }
  }, [searchParams]);

  // プロジェクト一覧を取得
  useEffect(() => {
    if (view === 'list') {
      fetchProjects();
    }
  }, [view]);

  // プロジェクト詳細を取得
  useEffect(() => {
    if (selectedProjectId && view === 'detail') {
      fetchProjectDetail(selectedProjectId);
    }
  }, [selectedProjectId, view]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/client-input/list');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        setStatus({
          type: 'error',
          message: 'プロジェクト一覧の取得に失敗しました',
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

  const fetchProjectDetail = async (projectId: string) => {
    setIsLoading(true);
    setStatus({ type: null, message: '' });
    try {
      const response = await fetch(`/api/client-input/${projectId}`);
      const data = await response.json();
      
      if (response.ok) {
        // データが正しく取得できたか確認
        if (data && (data.basicInfo || data.project_id)) {
          setFormData(data);
          setErrors({}); // データ読み込み時はエラーをクリア
        } else {
          console.error('Invalid data format:', data);
          setStatus({
            type: 'error',
            message: 'プロジェクトデータの形式が正しくありません',
          });
          setIsLoading(false);
        }
      } else {
        console.error('API error:', data);
        setStatus({
          type: 'error',
          message: data.message || 'プロジェクト詳細の取得に失敗しました',
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setStatus({
        type: 'error',
        message: `サーバーとの通信に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
      });
      setIsLoading(false);
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

    // エラーをクリア
    const errorKey = `${String(section)}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    if (!formData || !selectedProjectId) return;

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // エラーメッセージを詳細に表示
      const errorFields = Object.values(validationErrors);
      const errorMessage = errorFields.length > 0 
        ? `入力内容にエラーがあります: ${errorFields.join('、')}`
        : '入力内容にエラーがあります。必須項目を確認してください。';
      setStatus({
        type: 'error',
        message: errorMessage,
      });
      // エラーがあるフィールドにスクロール
      const firstErrorKey = Object.keys(validationErrors)[0];
      const fieldName = firstErrorKey.split('.')[1];
      const errorElement = document.querySelector(`[name="${fieldName}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (errorElement as HTMLElement).focus();
      }
      return;
    }

    // エラーがない場合はエラー状態をクリア
    setErrors({});

    setIsSaving(true);
    try {
      const response = await fetch(`/api/client-input/${selectedProjectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        setStatus({
          type: 'success',
          message: result.message || '保存しました',
        });
        setErrors({}); // 保存成功時はエラーをクリア
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

  const handleSaveToDrive = async () => {
    if (!selectedProjectId) return;

    setIsSavingToDrive(true);
    try {
      const response = await fetch(`/api/client-input/${selectedProjectId}/save-to-drive`, {
        method: 'POST',
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        setStatus({
          type: 'success',
          message: result.message || 'Google Driveに保存しました',
        });
      } else {
        setStatus({
          type: 'error',
          message: result.message || 'Google Driveへの保存に失敗しました',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'サーバーとの通信に失敗しました',
      });
    } finally {
      setIsSavingToDrive(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setView('detail');
    setStatus({ type: null, message: '' });
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedProjectId(null);
    setFormData(null);
    setStatus({ type: null, message: '' });
  };

  // 一覧表示
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">デザイナー用確認画面</h1>
            <p className="text-gray-600">
              クライアント入力内容の確認・編集
            </p>
          </div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </button>
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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">プロジェクト一覧</h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-3 text-gray-600">読み込み中...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                プロジェクトがありません
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.project_id}
                    onClick={() => handleProjectClick(project.project_id)}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {project.basicInfo?.companyName || '企業名未設定'}
                              </h3>
                              {project.project_number && (
                                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                  {project.project_number}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{project.basicInfo?.serviceName || 'サービス名未設定'}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {project.created_at && (
                            <>
                              <span>作成: {new Date(project.created_at).toLocaleString('ja-JP')}</span>
                              {project.updated_at && (
                                <>
                                  <span className="mx-2">|</span>
                                  <span>更新: {new Date(project.updated_at).toLocaleString('ja-JP')}</span>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <Edit2 className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 詳細表示
  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            一覧に戻る
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (selectedProjectId) {
                  window.location.href = `/interview?projectId=${selectedProjectId}`;
                }
              }}
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AIヒアリング整理
            </button>
            <button
              onClick={() => {
                if (selectedProjectId) {
                  window.location.href = `/copy?projectId=${selectedProjectId}`;
                }
              }}
              className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              LPコピー生成
            </button>
            <button
              onClick={() => {
                if (selectedProjectId) {
                  window.location.href = `/design-instruction?projectId=${selectedProjectId}`;
                }
              }}
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Palette className="w-4 h-4 mr-2" />
              デザイン指示生成
            </button>
            <button
              onClick={handleSaveToDrive}
              disabled={isSavingToDrive}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSavingToDrive ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Google Driveに保存
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
          </div>
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

        <form>
          <FormSection title="1. 基本情報" subtitle="商品・サービスに関する基本情報を入力してください">
            <InputField
              label="企業名"
              name="companyName"
              required
              value={formData.basicInfo.companyName}
              onChange={(value) => updateField('basicInfo', 'companyName', value)}
              error={errors['basicInfo.companyName']}
              placeholder="例: 株式会社サンプル"
            />
            <InputField
              label="商品名・サービス名"
              name="serviceName"
              required
              value={formData.basicInfo.serviceName}
              onChange={(value) => updateField('basicInfo', 'serviceName', value)}
              error={errors['basicInfo.serviceName']}
              placeholder="例: XX美容液、サンプルサービス"
            />
            <InputField
              label="商品・サービスのURL"
              name="serviceUrl"
              type="url"
              optional
              value={formData.basicInfo.serviceUrl}
              onChange={(value) => updateField('basicInfo', 'serviceUrl', value)}
              error={errors['basicInfo.serviceUrl']}
              placeholder="https://example.com"
            />
            <InputField
              label="商品・サービスのカテゴリー"
              name="industry"
              required
              value={formData.basicInfo.industry}
              onChange={(value) => updateField('basicInfo', 'industry', value)}
              error={errors['basicInfo.industry']}
              placeholder="例: 美容、飲食、教育、不動産など"
            />
            <TextareaField
              label="商品・サービスの詳細"
              name="businessDescription"
              required
              value={formData.basicInfo.businessDescription}
              onChange={(value) => updateField('basicInfo', 'businessDescription', value)}
              error={errors['basicInfo.businessDescription']}
              placeholder="可能な範囲で詳細にご記入ください"
              rows={4}
            />
          </FormSection>

          <FormSection title="2. ターゲット情報" subtitle="想定されるターゲット顧客について教えてください">
            <TextareaField
              label="主なターゲット"
              name="mainTarget"
              required
              value={formData.targetInfo.mainTarget}
              onChange={(value) => updateField('targetInfo', 'mainTarget', value)}
              error={errors['targetInfo.mainTarget']}
              placeholder="例: 中小企業の経営者、20-30代の女性、フリーランスのデザイナーなど"
              rows={3}
            />
            <TextareaField
              label="ターゲットの課題・悩み"
              name="targetIssues"
              required
              value={formData.targetInfo.targetIssues}
              onChange={(value) => updateField('targetInfo', 'targetIssues', value)}
              error={errors['targetInfo.targetIssues']}
              placeholder="ターゲットが抱えている課題や悩みを具体的にご記入ください"
              rows={4}
            />
          </FormSection>

          <FormSection title="3. 提供価値・ベネフィット" subtitle="貴社のサービスが提供する価値について教えてください">
            <TextareaField
              label="主な提供価値"
              name="mainValue"
              required
              value={formData.valueProposition.mainValue}
              onChange={(value) => updateField('valueProposition', 'mainValue', value)}
              error={errors['valueProposition.mainValue']}
              placeholder="商品・サービスが顧客に提供する主な価値を記入してください"
              rows={4}
            />
            <TextareaField
              label="主な特徴・強み"
              name="mainFeatures"
              required
              value={formData.valueProposition.mainFeatures}
              onChange={(value) => updateField('valueProposition', 'mainFeatures', value)}
              error={errors['valueProposition.mainFeatures']}
              placeholder="他社と差別化できる特徴や強みをご記入ください"
              rows={4}
            />
            <TextareaField
              label="顧客が得られるメリット"
              name="customerBenefits"
              required
              value={formData.benefits.customerBenefits}
              onChange={(value) => updateField('benefits', 'customerBenefits', value)}
              error={errors['benefits.customerBenefits']}
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
              error={errors['proofPoints.achievements']}
              placeholder="例: 導入実績1,000社以上、ユーザー数10万人突破など"
              rows={3}
            />
            <TextareaField
              label="お客様の声・レビュー"
              name="customerReviews"
              optional
              value={formData.proofPoints.customerReviews}
              onChange={(value) => updateField('proofPoints', 'customerReviews', value)}
              error={errors['proofPoints.customerReviews']}
              placeholder="代表的な顧客の声や評価をご記入ください"
              rows={3}
            />
            <TextareaField
              label="メディア掲載"
              name="mediaFeatures"
              optional
              value={formData.proofPoints.mediaFeatures}
              onChange={(value) => updateField('proofPoints', 'mediaFeatures', value)}
              error={errors['proofPoints.mediaFeatures']}
              placeholder="掲載されたメディア名や記事タイトルをご記入ください"
              rows={3}
            />
            <TextareaField
              label="受賞歴・認定"
              name="awards"
              optional
              value={formData.proofPoints.awards}
              onChange={(value) => updateField('proofPoints', 'awards', value)}
              error={errors['proofPoints.awards']}
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
              error={errors['competitorInfo.mainCompetitors']}
              placeholder="主要な競合サービス名をご記入ください"
              rows={3}
            />
            <TextareaField
              label="競合との違い・優位性"
              name="competitiveAdvantage"
              optional
              value={formData.competitorInfo.competitiveAdvantage}
              onChange={(value) => updateField('competitorInfo', 'competitiveAdvantage', value)}
              error={errors['competitorInfo.competitiveAdvantage']}
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
              error={errors['brandInfo.brandImage']}
              placeholder="例: モダン、信頼感、親しみやすい、プロフェッショナルなど"
              rows={3}
            />
            <TextareaField
              label="参考にしたいLP・サイト"
              name="referenceUrls"
              optional
              value={formData.brandInfo.referenceUrls}
              onChange={(value) => updateField('brandInfo', 'referenceUrls', value)}
              error={errors['brandInfo.referenceUrls']}
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
              error={errors['brandInfo.brandColor']}
              placeholder="#FF5733"
            />
            <TextareaField
              label="使用したい画像・素材"
              name="imageAssets"
              optional
              value={formData.brandInfo.imageAssets}
              onChange={(value) => updateField('brandInfo', 'imageAssets', value)}
              error={errors['brandInfo.imageAssets']}
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
              error={errors['goals.mainPurpose']}
              options={purposeOptions}
            />
            <InputField
              label="希望するCTA（コールトゥアクション）"
              name="desiredCta"
              optional
              value={formData.goals.desiredCta}
              onChange={(value) => updateField('goals', 'desiredCta', value)}
              error={errors['goals.desiredCta']}
              placeholder="例: 今すぐ無料で始める、資料をダウンロードする など"
            />
            <TextareaField
              label="その他要望・メッセージ"
              name="additionalRequests"
              optional
              value={formData.goals.additionalRequests}
              onChange={(value) => updateField('goals', 'additionalRequests', value)}
              error={errors['goals.additionalRequests']}
              placeholder="その他、ご要望やお伝えしたいことがあればご記入ください"
              rows={4}
            />
          </FormSection>
        </form>
      </div>
    </div>
  );
}
