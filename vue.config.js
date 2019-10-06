module.exports = {
  css: {
    loaderOptions: {
      sass: {
        includePaths: ['./node_modules/'],
        implementation: require('sass'),
        fiber: require('fibers')
      }
    }
  }
}
