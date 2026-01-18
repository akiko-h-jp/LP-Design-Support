export interface ClientFormData {
  basicInfo: {
    companyName: string;
    serviceName: string;
    serviceUrl: string;
    industry: string;
    businessDescription: string;
  };
  targetInfo: {
    mainTarget: string;
    targetIssues: string;
  };
  valueProposition: {
    mainValue: string;
    mainFeatures: string;
    functionalityDescription: string;
  };
  benefits: {
    customerBenefits: string;
  };
  proofPoints: {
    achievements: string;
    customerReviews: string;
    mediaFeatures: string;
    awards: string;
  };
  competitorInfo: {
    mainCompetitors: string;
    competitiveAdvantage: string;
  };
  brandInfo: {
    brandImage: string;
    referenceUrls: string;
    brandColor: string;
    imageAssets: string;
  };
  goals: {
    mainPurpose: string;
    desiredCta: string;
    additionalRequests: string;
  };
}

export interface FormErrors {
  [key: string]: string;
}

export interface ApiResponse {
  success: boolean;
  project_id?: string;
  message: string;
  errors?: string[];
  warnings?: string[];
}
