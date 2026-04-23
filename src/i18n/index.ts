import { uz } from './uz';
import { ru } from './ru';
import { en } from './en';
import type { Language } from '../types';

export const translations = { uz, ru, en };
export type TranslationKey = keyof typeof uz;
export function t(lang: Language, key: TranslationKey): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
