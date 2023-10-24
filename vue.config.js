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
        '@Main': resolvePath('src/main.ts'),
        '@Assets': resolvePath('src/assets/'),
        '@Components': resolvePath('src/components/'),
        '@Layouts': resolvePath('src/layouts/'),
        '@Views': resolvePath('src/views/'),
        '@Domain': resolvePath('src/domain'),
        '@Hooks': resolvePath('src/hooks/'),
        '@Services': resolvePath('src/services'),
        '@Middlewares': resolvePath('src/middlewares'),
        '@Store': resolvePath('src/store/'),
        '@Utils': resolvePath('src/utils/'),
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
