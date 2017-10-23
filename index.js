const delay = require('delay')
const config = require('./lib/config')
const { run, finish, quit } = require('./lib/utils')

let server

module.exports = async function start() {
  try {
    if(process.env.SKIP_BUILD) {
      process.stdout.write("SKIP_BUILD set, skipping build phase...\n")
    } else {
      const build = run('build')
      await finish(build)
    }

    const server = run('server')
    await delay(config.delay)
    
    const test = run('test')
    await finish(test)
  
    quit()
  } catch (e) {
    console.error(e)
    quit()
  }
}