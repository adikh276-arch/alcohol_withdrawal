import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import es from './locales/es/translation.json';
import fr from './locales/fr/translation.json';
import pt from './locales/pt/translation.json';
import de from './locales/de/translation.json';
import ar from './locales/ar/translation.json';
import hi from './locales/hi/translation.json';
import bn from './locales/bn/translation.json';
import zh from './locales/zh/translation.json';
import ja from './locales/ja/translation.json';
import id from './locales/id/translation.json';
import tr from './locales/tr/translation.json';
import vi from './locales/vi/translation.json';
import ko from './locales/ko/translation.json';
import ru from './locales/ru/translation.json';
import it from './locales/it/translation.json';
import pl from './locales/pl/translation.json';
import th from './locales/th/translation.json';
import tl from './locales/tl/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      pt: { translation: pt },
      de: { translation: de },
      ar: { translation: ar },
      hi: { translation: hi },
      bn: { translation: bn },
      zh: { translation: zh },
      ja: { translation: ja },
      id: { translation: id },
      tr: { translation: tr },
      vi: { translation: vi },
      ko: { translation: ko },
      ru: { translation: ru },
      it: { translation: it },
      pl: { translation: pl },
      th: { translation: th },
      tl: { translation: tl },
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
