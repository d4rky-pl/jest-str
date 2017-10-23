module.exports = {
  "build":  "npm run build",
  "server": "serve -p <port> build",
  "test":   "npm run test -- --testMatch '(**/__system_tests__/**/*.js?(x))|(**/?(*.)system.js?(x))'"
}
