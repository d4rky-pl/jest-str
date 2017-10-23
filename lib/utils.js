const path = require('path')
const config = require('./config')
const { exec } = require('child_process');

const APP_PATH = path.resolve('./')

const execOpts =  {
  cwd: APP_PATH,
  shell: true,
  env: Object.assign({}, process.env, {
    CI: 1,
    FORCE_COLOR: 1
  })
}

const spawnedChildren = []

function quit(code) {
  spawnedChildren.map((child) => {
    try {
      child.kill('SIGTERM')
    } catch(e) {
      console.error(e)
    }
  })
  process.exit(code)
}

function write(namespace, output, data) {
  process[output].write(namespace ? `${namespace}: ${data.toString()}` : `${data.toString()}`)
}

function attachOutput(child, namespace) {
  child.stdout.on('data',  (data) => write(namespace, 'stdout', data))
  child.stdout.on('error', (data) => write(namespace, 'stdout', data))
  
  child.stderr.on('data',  (data) => write(namespace, 'stderr', data))
  child.stderr.on('error', (data) => write(namespace, 'stderr', data))
  
  child.on('error', (error) => {
    console.error(error)
    quit(1)
  })

  child.on('exit', (code) => {
    if(code !== 0) {
      console.error(namespace + ': process exited with code ' + code)
      quit(code)
    }
  })
}

function run(name) {
  process.stdout.write(`> ${config[name]}\n`)
  const command = exec(config[name], execOpts)
  attachOutput(command, name)
  spawnedChildren.push(command)
  return command
}

function finish(process) {
  return new Promise((resolve, reject) => {
    process.on('exit', (code) => code === 0 ? resolve(code) : reject(code))
  })
}

module.exports = { run, finish, quit }