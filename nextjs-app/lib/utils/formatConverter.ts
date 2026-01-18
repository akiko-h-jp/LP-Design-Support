/**
 * フロントエンドとバックエンドのデータ形式を変換するユーティリティ
 * 
 * フロントエンド: camelCase (companyName)
 * バックエンド: snake_case (company_name)
 */

interface FrontendData {
  basicInfo?: {
    companyName: string;
    serviceName: string;
    serviceUrl: string;
    industry: string;
    businessDescription: string;
  };
  targetInfo?: {
    mainTarget: string;
    targetIssues: string;
  };
  valueProposition?: {
    mainValue: string;
    mainFeatures: string;
    functionalityDescription: string;
  };
  benefits?: {
    customerBenefits: string;
  };
  proofPoints?: {
    achievements: string;
    customerReviews: string;
    mediaFeatures: string;
    awards: string;
  };
  competitorInfo?: {
    mainCompetitors: string;
    competitiveAdvantage: string;
  };
  brandInfo?: {
    brandImage: string;
    referenceUrls: string;
    brandColor: string;
    imageAssets: string;
  };
  goals?: {
    mainPurpose: string;
    desiredCta: string;
    additionalRequests: string;
  };
  // AI分析結果と質問（フロントエンド形式）
  aiAnalysis?: {
    missing: string[];
    ambiguous: string[];
    contradictions: string[];
    summary: string;
  };
  aiQuestions?: Array<{
    question: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
  }>;
}

interface BackendData {
  basic_info?: {
    company_name: string;
    service_name: string;
    service_url: string;
    industry: string;
    business_description: string;
  };
  target_info?: {
    target_audience: string;
    target_pain_points: string;
  };
  value_proposition?: {
    main_value: string;
    main_features: string;
    service_details: string;
  };
  benefits?: {
    customer_benefits: string;
  };
  social_proof?: {
    achievements: string;
    testimonials: string;
    media_coverage: string;
    awards: string;
  };
  competitor_info?: {
    competitors: string;
    differentiators: string;
  };
  brand_info?: {
    brand_tone: string;
    reference_urls: string;
    brand_color: string;
    image_requirements: string;
  };
  lp_goals?: {
    main_purpose: string;
    desired_cta: string;
    additional_notes: string;
  };
  // AI分析結果と質問（バックエンド形式）
  ai_analysis?: {
    missing: string[];
    ambiguous: string[];
    contradictions: string[];
    summary: string;
  };
  ai_questions?: Array<{
    question: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
  }>;
}

export function convertFrontendToBackend(frontendData: FrontendData): BackendData {
  const converted: BackendData = {};

  if (frontendData.basicInfo) {
    converted.basic_info = {
      company_name: frontendData.basicInfo.companyName || '',
      service_name: frontendData.basicInfo.serviceName || '',
      service_url: frontendData.basicInfo.serviceUrl || '',
      industry: frontendData.basicInfo.industry || '',
      business_description: frontendData.basicInfo.businessDescription || '',
    };
  }

  if (frontendData.targetInfo) {
    converted.target_info = {
      target_audience: frontendData.targetInfo.mainTarget || '',
      target_pain_points: frontendData.targetInfo.targetIssues || '',
    };
  }

  if (frontendData.valueProposition) {
    converted.value_proposition = {
      main_value: frontendData.valueProposition.mainValue || '',
      main_features: frontendData.valueProposition.mainFeatures || '',
      service_details: frontendData.valueProposition.functionalityDescription || '',
    };
  }

  if (frontendData.benefits) {
    converted.benefits = {
      customer_benefits: frontendData.benefits.customerBenefits || '',
    };
  }

  if (frontendData.proofPoints) {
    converted.social_proof = {
      achievements: frontendData.proofPoints.achievements || '',
      testimonials: frontendData.proofPoints.customerReviews || '',
      media_coverage: frontendData.proofPoints.mediaFeatures || '',
      awards: frontendData.proofPoints.awards || '',
    };
  }

  if (frontendData.competitorInfo) {
    converted.competitor_info = {
      competitors: frontendData.competitorInfo.mainCompetitors || '',
      differentiators: frontendData.competitorInfo.competitiveAdvantage || '',
    };
  }

  if (frontendData.brandInfo) {
    let referenceUrls = frontendData.brandInfo.referenceUrls || '';
    if (Array.isArray(referenceUrls)) {
      referenceUrls = referenceUrls.join('\n');
    }

    converted.brand_info = {
      brand_tone: frontendData.brandInfo.brandImage || '',
      reference_urls: referenceUrls,
      brand_color: frontendData.brandInfo.brandColor || '',
      image_requirements: frontendData.brandInfo.imageAssets || '',
    };
  }

  if (frontendData.goals) {
    const purposeMap: Record<string, string> = {
      download: '資料ダウンロード',
      contact: 'お問い合わせ',
      trial: '無料トライアル申込',
      purchase: '商品購入',
      registration: '会員登録',
      other: 'その他',
    };
    const mainPurpose = purposeMap[frontendData.goals.mainPurpose] || frontendData.goals.mainPurpose;

    converted.lp_goals = {
      main_purpose: mainPurpose,
      desired_cta: frontendData.goals.desiredCta || '',
      additional_notes: frontendData.goals.additionalRequests || '',
    };
  }

  // AI分析結果と質問（そのまま保存）
  if (frontendData.aiAnalysis) {
    converted.ai_analysis = frontendData.aiAnalysis;
  }
  if (frontendData.aiQuestions) {
    converted.ai_questions = frontendData.aiQuestions;
  }

  return converted;
}

export function convertBackendToFrontend(backendData: BackendData | any): FrontendData {
  const converted: FrontendData = {};

  // バックエンドデータが空の場合は空のオブジェクトを返す
  if (!backendData) {
    return {
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
  }

  if (backendData.basic_info) {
    converted.basicInfo = {
      companyName: backendData.basic_info.company_name || '',
      serviceName: backendData.basic_info.service_name || '',
      serviceUrl: backendData.basic_info.service_url || '',
      industry: backendData.basic_info.industry || '',
      businessDescription: backendData.basic_info.business_description || '',
    };
  } else {
    // basic_infoが存在しない場合でも空のオブジェクトを設定
    converted.basicInfo = {
      companyName: '',
      serviceName: '',
      serviceUrl: '',
      industry: '',
      businessDescription: '',
    };
  }

  if (backendData.target_info) {
    converted.targetInfo = {
      mainTarget: backendData.target_info.target_audience || '',
      targetIssues: backendData.target_info.target_pain_points || '',
    };
  } else {
    converted.targetInfo = {
      mainTarget: '',
      targetIssues: '',
    };
  }

  if (backendData.value_proposition) {
    converted.valueProposition = {
      mainValue: backendData.value_proposition.main_value || '',
      mainFeatures: backendData.value_proposition.main_features || '',
      functionalityDescription: backendData.value_proposition.service_details || '',
    };
  } else {
    converted.valueProposition = {
      mainValue: '',
      mainFeatures: '',
      functionalityDescription: '',
    };
  }

  if (backendData.benefits) {
    converted.benefits = {
      customerBenefits: backendData.benefits.customer_benefits || '',
    };
  } else {
    converted.benefits = {
      customerBenefits: '',
    };
  }

  if (backendData.social_proof) {
    converted.proofPoints = {
      achievements: backendData.social_proof.achievements || '',
      customerReviews: backendData.social_proof.testimonials || '',
      mediaFeatures: backendData.social_proof.media_coverage || '',
      awards: backendData.social_proof.awards || '',
    };
  } else {
    converted.proofPoints = {
      achievements: '',
      customerReviews: '',
      mediaFeatures: '',
      awards: '',
    };
  }

  if (backendData.competitor_info) {
    converted.competitorInfo = {
      mainCompetitors: backendData.competitor_info.competitors || '',
      competitiveAdvantage: backendData.competitor_info.differentiators || '',
    };
  } else {
    converted.competitorInfo = {
      mainCompetitors: '',
      competitiveAdvantage: '',
    };
  }

  if (backendData.brand_info) {
    let referenceUrls = backendData.brand_info.reference_urls || '';
    if (Array.isArray(referenceUrls)) {
      referenceUrls = referenceUrls.join('\n');
    }

    converted.brandInfo = {
      brandImage: backendData.brand_info.brand_tone || '',
      referenceUrls: referenceUrls,
      brandColor: backendData.brand_info.brand_color || '',
      imageAssets: backendData.brand_info.image_requirements || '',
    };
  }

  if (backendData.lp_goals) {
    const purposeMap: Record<string, string> = {
      '資料ダウンロード': 'download',
      'お問い合わせ': 'contact',
      '無料トライアル申込': 'trial',
      '商品購入': 'purchase',
      '会員登録': 'registration',
      'その他': 'other',
    };
    const mainPurpose = purposeMap[backendData.lp_goals.main_purpose] || backendData.lp_goals.main_purpose;

    converted.goals = {
      mainPurpose: mainPurpose,
      desiredCta: backendData.lp_goals.desired_cta || '',
      additionalRequests: backendData.lp_goals.additional_notes || '',
    };
  } else {
    converted.goals = {
      mainPurpose: '',
      desiredCta: '',
      additionalRequests: '',
    };
  }

  // AI分析結果と質問（そのまま復元）
  if (backendData.ai_analysis) {
    converted.aiAnalysis = backendData.ai_analysis;
  }
  if (backendData.ai_questions) {
    converted.aiQuestions = backendData.ai_questions;
  }

  return converted;
}
