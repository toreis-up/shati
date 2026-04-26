// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon-light.ico' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon-dark.ico', media: '(prefers-color-scheme: dark)' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon-light.ico', media: '(prefers-color-scheme: light)' },
      ]
    }
  },
  compatibilityDate: "2026-01-22",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxt/image"],
  image: {
    format: ["webp"],
  },
  css: ["assets/css/main.css"],
  $development: {
    vite: {
      optimizeDeps: {
        include: [
          '@vue/devtools-core',
          '@vue/devtools-kit'
        ]
      }
    },
    runtimeConfig: {
      public: {
        apiBase: "http://127.0.0.1:8787",
      },
    },
  },
  $production: {
    runtimeConfig: {
      public: {
        apiBase: "https://api.shati.reisan.dev"
      }
    },
    image: {
      domains: ["shati.reisan.dev", "api.shati.reisan.dev"]
    }
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vueuse/core'
      ]
    }
  },
  nitro: {
    preset: "cloudflare_module",
    prerender: {
      autoSubfolderIndex: false,
    },
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },
  fonts: {
    families: [{ name: "Noto Sans JP Variable", provider: "fontsource" }],
  },
  ui: {
    theme: {
      colors: [
        "primary",
        "secondary",
        "tartiary",
        "text",
        "success",
        "warning",
        "error",
        "neutral",
      ],
    },
  },
  appConfig: {
    ui: {
      button: {
        compoundVariants: [
          {
            color: "primary",
            variant: "solid",
            class:
              "bg-secondary hover:bg-secondary/75 disabled:bg-primary aria-disabled:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary",
          },
        ],
      },
    },
  },
});
