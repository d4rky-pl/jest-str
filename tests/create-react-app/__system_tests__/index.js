import Nightmare from 'nightmare'

describe('App', () => {
  it('renders the initial app', async () => {
    const nightmare = Nightmare()
    return nightmare
      .goto('http://localhost:4000')
      .evaluate(() => document.querySelector('h1.App-title').textContent)
      .end()
      .then((header) => {
        expect(header).toMatch('Welcome to React');
      })
  });
});