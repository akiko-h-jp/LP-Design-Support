import { ClientFormData, FormErrors } from '@/types/form';

export function validateUrl(url: string): boolean {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateColorCode(color: string): boolean {
  if (!color) return true;
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

export function validateForm(formData: ClientFormData): FormErrors {
  const errors: FormErrors = {};

  if (!formData.basicInfo.companyName.trim()) {
    errors['basicInfo.companyName'] = '企業名は必須です';
  }

  if (!formData.basicInfo.serviceName.trim()) {
    errors['basicInfo.serviceName'] = '商品名・サービス名は必須です';
  }

  // serviceUrlは任意項目のため、形式チェックを行わない

  if (!formData.basicInfo.industry.trim()) {
    errors['basicInfo.industry'] = '商品・サービスのカテゴリーは必須です';
  }

  if (!formData.basicInfo.businessDescription.trim()) {
    errors['basicInfo.businessDescription'] = '商品・サービスの詳細は必須です';
  }

  if (!formData.targetInfo.mainTarget.trim()) {
    errors['targetInfo.mainTarget'] = '主なターゲットは必須です';
  }

  if (!formData.targetInfo.targetIssues.trim()) {
    errors['targetInfo.targetIssues'] = 'ターゲットの課題・悩みは必須です';
  }

  if (!formData.valueProposition.mainValue.trim()) {
    errors['valueProposition.mainValue'] = '主な提供価値は必須です';
  }

  if (!formData.valueProposition.mainFeatures.trim()) {
    errors['valueProposition.mainFeatures'] = '主な特徴・強みは必須です';
  }

  if (!formData.benefits.customerBenefits.trim()) {
    errors['benefits.customerBenefits'] = '顧客が得られるメリットは必須です';
  }

  // 任意項目の形式チェックは削除（必須項目のみエラーを表示）
  // ブランドカラー、参考URLなどは任意項目のため、形式チェックを行わない

  if (!formData.goals.mainPurpose) {
    errors['goals.mainPurpose'] = 'LPの主な目的は必須です';
  }

  return errors;
}
