import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.TRANSLATE_API_KEY;
const locales = ['en', 'es', 'fr', 'pt', 'de', 'ar', 'hi', 'bn', 'zh', 'ja', 'id', 'tr', 'vi', 'ko', 'ru', 'it', 'pl', 'th', 'tl'];

const baseTranslations = {
  "alcohol_withdrawal_tracker": "Alcohol Withdrawal Log",
  "track_symptoms_progress": "Track symptoms & progress",
  "entries": "Entries",
  "symptoms": "Symptoms",
  "high_severe": "High/Severe",
  "no_logs_this_week": "No logs this week",
  "tap_plus_to_add": "Tap + to add your first entry",
  "add_log": "Add Log",
  "log_withdrawal_symptoms_title": "Log Withdrawal Symptoms",
  "severity": "Severity",
  "symptoms_label": "Symptoms",
  "vitals_optional": "Vitals (optional)",
  "heart_rate_placeholder": "Heart rate (bpm)",
  "blood_pressure_placeholder": "Blood pressure",
  "notes_label": "Notes",
  "how_are_you_feeling": "How are you feeling?",
  "save_log": "Save Log",
  "mild": "Mild",
  "moderate": "Moderate",
  "high": "High",
  "severe": "Severe",
  "tremors": "Tremors",
  "sweating": "Sweating",
  "nausea": "Nausea",
  "anxiety": "Anxiety",
  "insomnia": "Insomnia",
  "headache": "Headache",
  "irritability": "Irritability",
  "fatigue": "Fatigue",
  "loss_of_appetite": "Loss of appetite",
  "confusion": "Confusion",
  "hallucinations": "Hallucinations",
  "seizures": "Seizures",
  "page_not_found": "Oops! Page not found",
  "return_to_home": "Return to Home",
  "today": "Today"
};

async function run() {
  const keys = Object.keys(baseTranslations);
  const values = Object.values(baseTranslations);

  for (const lang of locales) {
    console.log(`Translating to ${lang}...`);
    const translatedJson: Record<string, string> = {};
    if (lang === 'en') {
      keys.forEach((key, i) => {
        translatedJson[key] = values[i];
      });
    } else {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            q: values,
            target: lang,
            format: 'text'
          }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json() as any;
        if (data.error) {
           console.error(`Error in translation response for ${lang}:`, JSON.stringify(data.error));
           keys.forEach((key, i) => { translatedJson[key] = values[i]; });
        } else {
          keys.forEach((key, i) => {
            translatedJson[key] = data.data.translations[i].translatedText;
          });
        }
      } catch (error) {
        console.error(`Error translating to ${lang}:`, error);
        keys.forEach((key, i) => { translatedJson[key] = values[i]; });
      }
    }

    const dir = path.join(__dirname, '../src/i18n/locales', lang);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, 'translation.json'), JSON.stringify(translatedJson, null, 2));
  }
  console.log('All translations generated!');
}

// run().catch(console.error);
console.log('Script is disabled after generation.');
