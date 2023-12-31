import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    // server: {
    //   https: true,
    // },
    plugins: [
      react(),
      // mkcert()
    ],
    base: '/',
    resolve: {
      alias: {
        src: "/src",
        assets: "/src/assets",
        components: "/src/components",
        context: "/src/context",
        domain: "/src/domain",
        fire: "/src/fire",
        hooks: "/src/hooks",
        pages: "/src/pages",
        routes: "/src/routes",
        styles: "/src/styles",
        types: "/src/types",
        utils: "/src/utils",
      },
    },
  }

  // if (command !== 'serve') {
  //   config.base = '/loyalty-cards/'
  // }

  return config
})
