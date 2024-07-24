const path = require('path')
const resolve = (pathname:string) => path.resolve(__dirname, pathname)

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
  }
}
