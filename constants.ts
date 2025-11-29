import { PostFormat, PostPurpose, PostTone } from "./types";

export const PURPOSE_OPTIONS = Object.values(PostPurpose);
export const TONE_OPTIONS = Object.values(PostTone);
export const FORMAT_OPTIONS = Object.values(PostFormat);

export const DEFAULT_CONFIG = {
  targetAudience: 'Professionals',
  niche: 'General Business',
  purpose: PostPurpose.Informative,
  tone: PostTone.Conversational,
  formatStyles: [PostFormat.BulletPoints, PostFormat.Emojis],
  brandGuidelines: '',
  geoDemographics: 'Global',
  language: 'English (US)',
};

export const MOCK_LOADING_STEPS = [
  "Analyzing visual content...",
  "Reading brand guidelines...",
  "Calculating social SEO vectors...",
  "Optimizing hook and structure...",
  "Finalizing formatting..."
];
