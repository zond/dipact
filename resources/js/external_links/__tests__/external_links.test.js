const fetch = require('node-fetch');
const { expect } = require('@jest/globals');
import links from '../external_links.js';

describe('External links', () => {
  it('All external links return ok response', async () => {
    Object.values(links).forEach(async link => {
      const response = await fetch(link);
      expect(response.ok).toBe(true);
    });
  });
});