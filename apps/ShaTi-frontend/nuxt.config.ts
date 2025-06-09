import { URL, fileURLToPath } from "node:url";
import ui from '@nuxt/ui/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  srcDir: 'src/',
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: 'http://127.0.0.1:8787',
    },
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  vite: {
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
  },
  fonts: {
    provider: 'google',
    families: [{ name: 'Noto Sans JP', provider: 'google' }],
  },
  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'tartiary',
        'text',
        'success',
        'warn',
        'error',
        'neutral',
      ],
    },
  },
  appConfig: {
    ui: {
      button: {
        compoundVariants: [
          {
            color: 'primary',
            variant: 'solid',
            class:
              'bg-secondary hover:bg-secondary/75 disabled:bg-primary aria-disabled:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
          },
        ],
      },
    },
  },
});