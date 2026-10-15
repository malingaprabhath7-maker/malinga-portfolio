import type { Lang } from './site';
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Link to a page or file inside the site, respecting the GitHub Pages base path */
export const url = (path = '') => `${base}/${path.replace(/^\//, '')}`;
/** Page link in a given language: English at the root, Sinhala under /si */
export const page = (lang: Lang, path = '') => url((lang === 'si' ? 'si/' : '') + path.replace(/^\//, ''));
