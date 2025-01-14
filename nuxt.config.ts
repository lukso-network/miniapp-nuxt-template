// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore
import { assets } from '@lukso/web-components/tools/assets'
import { copyAssets } from '@lukso/web-components/tools/copy-assets'

copyAssets('./public', assets)

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  css: ['~/assets/styles/main.scss'],
  modules: ['nuxt-graphql-client'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vue: {
    compilerOptions: {
      sourceMap: true,
      isCustomElement: (tag: string) => {
        return tag.startsWith('lukso-')
      },
    },
  },
  imports: {
    dirs: ['types/**', 'composables/**'],
  },
  ssr: false,
  ...({
    'graphql-client': {
      watch: true,
      autoImport: true,
      functionPrefix: 'Gql',
      documentPaths: ['./'],
      preferGETQueries: false,
      codegen: {
        silent: false,
        onlyOperationTypes: false,
        useTypeImports: true,
      },
      clients: {
        mainnet: {
          host: 'https://envio.lukso-mainnet.universal.tech/v1/graphql',
          queries: ['profile'],
        },
        testnet: {
          host: 'https://envio.lukso-testnet.universal.tech/v1/graphql',
          queries: ['profile'],
        },
      },
    },
  } as any),
})
