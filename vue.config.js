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
        '@Assets': resolvePath('src/assets/'),
        '@Components': resolvePath('src/components/'),
        '@Layouts': resolvePath('src/layouts/'),
        '@Views': resolvePath('src/views/'),
        '@Hooks': resolvePath('src/hooks/'),
        '@Services': resolvePath('src/services'),
        '@Middlewares': resolvePath('src/middlewares'),
        '@Store': resolvePath('src/store/'),
        '@Utils': resolvePath('src/utils/'),
      },
    },
  },
})
