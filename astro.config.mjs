import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://malingaprabhath7-maker.github.io',
  base: '/malinga-portfolio',
  trailingSlash: 'ignore',
  vite: { plugins: [tailwindcss()] },
});
