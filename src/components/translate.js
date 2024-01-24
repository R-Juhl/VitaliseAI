import en from '../locales/en.json';
import dk from '../locales/dk.json';

const translations = {
  en,
  dk,
  // add more languages here
};

export const translate = (key, language) => {
  return translations[language][key] || en[key] || key;
};
