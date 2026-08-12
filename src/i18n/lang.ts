export type Lang = 'id' | 'en';

export function getLang(): Lang {
  try {
    return (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'id';
  } catch (e) {
    return 'id';
  }
}

export function setLang(lang: Lang): void {
  try {
    localStorage.setItem('lang', lang);
  } catch (e) {}
}
