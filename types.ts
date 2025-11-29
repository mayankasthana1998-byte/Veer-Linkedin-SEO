export enum PostPurpose {
  Actionable = 'Actionable',
  Promotional = 'Promotional',
  Inspirational = 'Inspirational',
  Informative = 'Informative',
  Introspective = 'Introspective',
  ThoughtLeadership = 'Thought Leadership',
  PersonalAchievement = 'Personal Achievement',
}

export enum PostTone {
  Professional = 'Professional/Formal',
  Conversational = 'Conversational',
  Witty = 'Witty/Clever',
  Direct = 'Direct',
  Authentic = 'Authentic/Human',
}

export enum PostFormat {
  BoldItalics = 'Bold and Italics',
  BulletPoints = 'Bullet Points',
  Emojis = 'Emojis',
  UniqueFonts = 'Unique Fonts',
}

export interface GenerationConfig {
  targetAudience: string;
  niche: string;
  purpose: PostPurpose;
  tone: PostTone;
  formatStyles: PostFormat[];
  brandGuidelines: string;
  geoDemographics: string;
  language: string;
}

export interface GeneratedResult {
  caption: string;
  seoScore: number;
  critique: string[];
  suggestedHashtags: string[];
}
