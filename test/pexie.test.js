import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { createPexieClient, PexieClient } from '../dist/pexie.js';

use(chaiAsPromised);

// Mock API Key - Replace with your real API key for live tests
const VALID_API_KEY = globalThis.process?.env?.PEXELS_API_KEY || 'YOUR_VALID_PEXELS_API_KEY';
const INVALID_API_KEY = 'INVALID_KEY';

describe('Pexie Library', function () {
  this.timeout(3000); // Extend timeout for async calls

  let /** @type {PexieClient} */ pexie;

  describe('createPexieClient()', () => {
    it('should throw TypeError if API key is not a string', async () => {
      await expect(createPexieClient(null)).to.be.rejectedWith(TypeError);
      await expect(createPexieClient(12345)).to.be.rejectedWith(TypeError);
    });

    it('should throw Error if API key is invalid', async () => {
      await expect(createPexieClient(INVALID_API_KEY)).to.be.rejectedWith(Error);
    });

    it('should create a PexieClient instance with a valid API key', async function () {
      // Skip if API key is not provided
      if (VALID_API_KEY === 'YOUR_VALID_PEXELS_API_KEY') {
        return this.skip();
      }

      const client = await createPexieClient(VALID_API_KEY);
      expect(client).to.be.an('object');
      expect(client.apikey).to.equal(VALID_API_KEY);
      expect(client.image).to.have.property('get');
      expect(client.video).to.have.property('get');
    });
  });

  describe('PexieClient image methods', () => {
    before(async function () {
      if (VALID_API_KEY === 'YOUR_VALID_PEXELS_API_KEY') {
        this.skip();
      }
      pexie = await createPexieClient(VALID_API_KEY);
    });

    it('should fetch an image by ID', async () => {
      const image = await pexie.image.get('2014422');
      expect(image).to.be.an('object');
      expect(image).to.have.property('id');
    });

    it('should search images with a query string', async () => {
      const results = await pexie.image.search('nature');
      expect(results).to.be.an('object');
      expect(results).to.have.property('photos');
    });

    it('should search images with an object parameter', async () => {
      const results = await pexie.image.search({ query: 'mountain', per_page: '5' });
      expect(results).to.have.property('photos');
    });

    it('should fetch curated images', async () => {
      const curated = await pexie.getCuratedImages({ page: '1', per_page: '3' });
      expect(curated).to.have.property('photos');
    });
  });

  describe('PexieClient video methods', () => {
    before(async function () {
      if (VALID_API_KEY === 'YOUR_VALID_PEXELS_API_KEY') {
        this.skip();
      }
      pexie = await createPexieClient(VALID_API_KEY);
    });

    it('should fetch a video by ID', async () => {
      const video = await pexie.video.get('2499611');
      expect(video).to.be.an('object');
      expect(video).to.have.property('id');
    });

    it('should search videos with a query string', async () => {
      const results = await pexie.video.search('beach');
      expect(results).to.have.property('videos');
    });

    it('should fetch popular videos', async () => {
      const popular = await pexie.getPopularVideos({ page: '1', per_page: '5' });
      expect(popular).to.have.property('videos');
    });
  });

  describe('Cache behavior', () => {
    it('should cache a request and retrieve from cache', async function () {
      if (VALID_API_KEY === 'YOUR_VALID_PEXELS_API_KEY') {
        this.skip();
      }

      const pexie = await createPexieClient(VALID_API_KEY);
      const initial = await pexie.image.get('2014422');

      const cached = pexie.cache.get('https://api.pexels.com/v1/photos/2014422');
      expect(cached).to.equal(initial);
    });
  });
});
