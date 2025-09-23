// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxt/image'],
  image: {
    format: ['webp'],
    ...(process.env.NODE_ENV === 'production'
      ? { domains: ['shati.reisan.dev', 'api.shati.reisan.dev'] }
      : {}),
  },
  css: ['assets/css/main.css'],
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
  fonts: {
    families: [{ name: 'Noto Sans JP Variable', provider: 'fontsource' }],
  },
  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'tartiary',
        'text',
        'success',
        'warning',
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