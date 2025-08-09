// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL || 'http://127.0.0.1:3333',
    },
  },
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },
  devServer: { host: '127.0.0.1', port: 3000 },
  devtools: { enabled: true },
  modules: [
    '@nuxt/devtools',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@nuxt/image',
    "@vee-validate/nuxt",
    '@nuxtjs/i18n',
    '@formkit/auto-animate/nuxt'
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  vite: {
    server: {
      hmr: {
        clientPort: 3000
      }
    }
  },
  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'fr', name: 'Français', language: 'fr-FR', file: 'fr.json' },
      { code: 'en', name: 'English', language: 'en-US', file: 'en.json' },
    ],
    defaultLocale: 'fr',
    lazy: true,
    langDir: 'locales/',
    strategy: 'no_prefix',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      redirectOn: "no prefix",
      fallbackLocale: 'fr',
    },
    compilation: {
      strictMessage: false,
    }
  },
})