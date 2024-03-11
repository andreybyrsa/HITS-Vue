const { defineConfig } = require('@vue/cli-service')
const path = require('path')

const resolvePath = (currentPath) => path.resolve(__dirname, currentPath)

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "./src/assets/styles/main.scss";',
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        // "@Main": ["src/main.ts"],
        // "@Config": ["src/config.ts"],
        // "@Api": ["src/api/index.ts"],
        // "@Domain": ["src/domain/.index.ts"],
        // "@Hooks": ["src/hooks/.index.ts"],
        // "@Assets": ["src/assets/index.ts"],
        // "@Router": ["src/router/index.ts"],
        // "@Service": ["src/service/.index.ts"],
        // "@Store": ["src/store/.index.ts"],
        // "@Utils": ["src/utils/.index.ts"],
        // "@Components/*": ["src/components/*"],
        // "@Layouts/*": ["src/layouts/*"],
        // "@Views/*": ["src/views/*"]

        '@Main': resolvePath('src/main.ts'),
        '@Config': resolvePath('src/config.ts'),
        '@Api': resolvePath('src/api/index.ts'),
        '@Domain': resolvePath('src/domain/index.ts'),
        '@Hooks': resolvePath('src/hooks/.index.ts'),
        '@Assets': resolvePath('src/assets/index.ts'),
        '@Router': resolvePath('src/router/index.ts'),
        '@Service': resolvePath('src/service/.index.ts'),
        '@Store': resolvePath('src/store/.index.ts'),
        '@Utils': resolvePath('src/utils/.index.ts'),
        '@Components': resolvePath('src/components/'),
        '@Layouts': resolvePath('src/layouts/'),
        '@Views': resolvePath('src/views/'),
      },
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          defineModel: true,
        }
      })
  },
})
