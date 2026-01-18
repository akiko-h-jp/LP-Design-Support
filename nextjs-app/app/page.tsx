'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Send, CheckCircle, XCircle, Loader2, LogIn } from 'lucide-react';
import FormSection from '@/components/FormSection';
import InputField from '@/components/InputField';
import TextareaField from '@/components/TextareaField';
import SelectField from '@/components/SelectField';
import { ClientFormData, FormErrors, ApiResponse } from '@/types/form';
import { validateForm } from '@/lib/utils/validation';

const initialFormData: ClientFormData = {
  basicInfo: {
    companyName: '',
    serviceName: '',
    serviceUrl: '',
    industry: '',
    businessDescription: '',
  },
  targetInfo: {
    mainTarget: '',
    targetIssues: '',
  },
  valueProposition: {
    mainValue: '',
    mainFeatures: '',
    functionalityDescription: '',
  },
  benefits: {
    customerBenefits: '',
  },
  proofPoints: {
    achievements: '',
    customerReviews: '',
    mediaFeatures: '',
    awards: '',
  },
  competitorInfo: {
    mainCompetitors: '',
    competitiveAdvantage: '',
  },
  brandInfo: {
    brandImage: '',
    referenceUrls: '',
    brandColor: '',
    imageAssets: '',
  },
  goals: {
    mainPurpose: '',
    desiredCta: '',
    additionalRequests: '',
  },
};

const purposeOptions = [
  { value: 'download', label: '資料ダウンロード' },
  { value: 'contact', label: 'お問い合わせ' },
  { value: 'trial', label: '無料トライアル申込' },
  { value: 'purchase', label: '商品購入' },
  { value: 'registration', label: '会員登録' },
  { value: 'other', label: 'その他' },
];

export default function Home() {
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    projectId?: string;
  }>({ type: null, message: '' });

  const updateField = (section: keyof ClientFormData, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    if (errors[`${String(section)}.${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`${String(section)}.${field}`];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: '' });

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus({
        type: 'error',
        message: '入力内容にエラーがあります。必須項目を確認してください。',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/client-input/receive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message,
          projectId: result.project_id,
        });
        setFormData(initialFormData);
        setErrors({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || '送信に失敗しました',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'サーバーとの通信に失敗しました。時間をおいて再度お試しください。',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogIn className="w-4 h-4 mr-2" />
            デザイナー用ログイン
          </Link>
        </div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LP制作のための事前アンケート</h1>
          <p className="text-gray-600">
            クライアント様情報入力フォーム
          </p>
          <p className="text-sm text-gray-500 mt-2">
            以下の項目をお分かりの範囲でご記入ください。
          </p>
        </div>

        {submitStatus.type && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start ${
              submitStatus.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {submitStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p
                className={`font-medium ${
                  submitStatus.type === 'success' ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {submitStatus.message}
              </p>
              {submitStatus.projectId && (
                <p className="text-sm text-green-700 mt-1">
                  プロジェクトID: {submitStatus.projectId}
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  送信する
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 text-center mt-3">
              送信後、担当者より連絡させていただきます
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
