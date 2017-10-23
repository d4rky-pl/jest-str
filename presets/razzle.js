module.exports = {
  "build":  "PORT=<port> npm run build",
  "server": "npm run start:prod",
  "test":   "npm run test -- --testMatch '(**/__system_tests__/**/*.js?(x))|(**/?(*.)system.js?(x))'"
}
