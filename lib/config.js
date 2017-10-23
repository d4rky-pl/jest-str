const fs = require('fs')
const path = require('path')
const APP_PATH = path.resolve('./')
const MODULE_PATH = path.resolve(__dirname, '../')

const configFile = path.resolve(APP_PATH + '/system-test.config.js')
const defaultConfigFile = path.resolve(MODULE_PATH, 'presets/default')

if(!fs.existsSync(configFile)) {
  process.stdout.write("Please create a system-test.config.js in your application root path and specify a preset (or your own configuration).\n\n")
  process.exit(1)
}

const userConfig = require(configFile)
const defaultConfig = require(defaultConfigFile)

const config = {}

if(userConfig.preset) {
  const preset = require(path.resolve(MODULE_PATH, 'presets/' + userConfig.preset))
  Object.assign(config, preset)
}

Object.assign(config, defaultConfig, userConfig)

const commands = ['build', 'server', 'test']
commands.forEach((key) => config[key] = config[key].replace("<port>", config.port))

module.exports = config