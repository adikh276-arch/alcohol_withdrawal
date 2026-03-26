import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ko', name: '한국어' },
  { code: 'ru', name: 'Русский' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
  { code: 'th', name: 'ไทย' },
  { code: 'tl', name: 'Tagalog' }
];

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const lang = searchParams.get('lang');
    if (lang && languages.some(l => l.code === lang)) {
      i18n.changeLanguage(lang);
      localStorage.setItem('language', lang);
    }
  }, [searchParams, i18n]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-muted transition-colors cursor-pointer group">
        <Globe className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        <select
          value={i18n.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-transparent text-sm font-medium text-muted-foreground group-hover:text-foreground focus:outline-none cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
