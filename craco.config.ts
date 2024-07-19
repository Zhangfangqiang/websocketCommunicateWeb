const path = require('path')
const resolve = (pathname:string) => path.resolve(__dirname, pathname)
const pxToViewport = require('postcss-px-to-viewport')

module.exports = {
  // webpack
  webpack: {
    alias: {
      "@": resolve("src"),
      "components": resolve("src/components"),
      "utils": resolve("src/utils"),
    },
  },
  style: {
    postcss: {
      mode: 'extends',
      loaderOptions: {
        postcssOptions: {
          ident: 'postcss',
          plugins: [pxToViewport({
            viewportWidth: 500,
            viewportHeight:800
          })]
        }
      }
    }
  }
}
