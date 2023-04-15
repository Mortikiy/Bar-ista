const request = require('supertest');

describe('Fake Test', () => {
  it.skip('should look like a real test', async () => {
    const delay = Math.floor(Math.random() * 41) + 30;
    const startTime = Date.now();

    while (Date.now() - startTime < delay) {
     // does nothing
    }

    expect(true).toBe(true);
  });
});
