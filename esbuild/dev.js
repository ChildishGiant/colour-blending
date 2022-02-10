const esbuild = require('esbuild')
const FiveServer = require('five-server').default
const sassPlugin = require('esbuild-plugin-sass')

esbuild.build({
  entryPoints: ['source/index.js'],
  bundle: true,
  outfile: 'docs/bundle.js',
  sourcemap: true,
  platform: "browser",
  plugins: [sassPlugin()],
  watch: {
    onRebuild (error, result) {
      if (error) console.error('watch build failed:', error)
      else console.error('watch build succeeded:', result)
    }
  }
}).then(result => {
  // Call "stop" on the result when you're done
  console.log(result)

  new FiveServer().start({
    root: './docs',
    open: true,
    port: 1234
  })

})
