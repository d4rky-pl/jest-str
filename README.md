# jest-str (Jest System Test Runner)

jest-str is a tool to simplify setting up system tests in your application.

It automatically builds your assets, runs server, runs your tests and closes the server so you don't have to maintain
that extra bit of scripting yourself.

jest-str has been written with React applications in mind. It has bundled presets for
[create-react-app](https://github.com/facebookincubator/create-react-app) and
[razzle](https://github.com/jaredpalmer/razzle).

## Setup

First you will have to add jest-str package to your project. Don't forget to add a system tests library as well!

```bash
yarn add --dev jest-str
yarn add --dev nightmare

# this is only required if you use create-react-app preset
yarn add --dev serve
```

jest-str has been tested with [Nightmare](https://github.com/segmentio/nightmare) but it should theoretically work
with any other system tests library.

After you've installed the package, please add `test:system` to your `package.json`:

```javascript
"scripts": {
    // ...
    "test:system": "jest-str"
}
```

## system-test.config.js

For jest-str to work you need to create a config file called `system-test.config.js` in the root directory of your
project. It should look like this:

```javascript
module.exports = {
  "preset": "create-react-app"
}
```

There are currently two presets: [create-react-app](https://github.com/facebookincubator/create-react-app) and
[razzle](https://github.com/jaredpalmer/razzle). They both assume that your tests are either kept in
`src/__system_tests__` or that they have `.system.js` extension, which mirrors `__tests__`/`test.js` from unit tests.

If you don't use either of them or want to send a pull request with your own preset, you need to specify:

```javascript
module.exports = {
  "build":  "command to build your app",
  "server": "command to run your server",
  "test":   "command to run your system tests"
}
```

Keep in mind that the test command should **not** run any other tests. System tests are by their nature slower
so they should be kept in separate directory.

### Extra configuration

Since there's no reliable cross-project way to determine when the server starts, jest-str implements a delay after
starting server and before running tests. This delay is set to 3 seconds by default (3000 ms) but can be overriden.

You can also change the default port (4000) your application is started on during tests.

Example `system-test.config.js` :

```javascript
module.exports = {
  "preset": "create-react-app",
  "delay": 3000,
  "port": 4000
}
```

## Writing tests

Here's an example test that assumes you're using Nightmare and create-react-app:

```javascript
import Nightmare from 'nightmare'

describe('App', () => {
  it('renders the initial app', async () => {
    const nightmare = Nightmare()
    return nightmare
      .goto('http://localhost:4000')
      .evaluate(() => document.querySelector('h1').textContent)
      .end()
      .then((header) => {
        expect(header).toMatch('Welcome to React');
      })
  });
});
```

## Skipping rebuild step

You probably don't want to rebuild entire application every time you fix a typo in your tests.
Unfortunately jest-str does not yet support watchmode.

To skip the build process, set `SKIP_BUILD` environment variable:

```bash
SKIP_BUILD=1 yarn run test:system
```

Keep in mind that you need to have your application already compiled and ready for this to work!