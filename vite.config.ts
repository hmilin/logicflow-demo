import vue from '@vitejs/plugin-vue'
import path from 'path'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import type { UserConfigExport } from 'vite'
import { splitVendorChunkPlugin } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

const config: UserConfigExport = {
  resolve: {
    alias: [
      // ~导入指向node_modules
      {
        find: /^~(?!\/)/,
        replacement: 'node_modules/',
      },
      {
        find: '~/',
        replacement: `${path.resolve(__dirname, 'src')}/`,
      },
      {
        find: /^lodash$/,
        replacement: 'lodash-es',
      },
    ],
  },
  server: {
    port: 3000,
  },
  plugins: [
    vue({
      include: [/\.vue$/],
    }),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ['vue'],
      // 自动引入./src/components下的组件并生成类型
      include: [/\.vue$/, /\.vue\?vue/],
      dirs: ['./src/components'],
      directoryAsNamespace: true,
      dts: 'src/components.d.ts',
      globalNamespaces: ['global'],
      resolvers: [AntDesignVueResolver()],
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: 'LogicFlow Demo',
        },
      },
    }),
    splitVendorChunkPlugin(),
  ],
  css: {
    preprocessorOptions: {
      less: {
        // https://github.com/vueComponent/ant-design-vue/blob/main/components/style/themes/default.less
        modifyVars: {
          hack: `true; @import "./src/styles/theme.less";`,
        },
        javascriptEnabled: true,
      },
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        //生成去除调试
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
}

export default config
