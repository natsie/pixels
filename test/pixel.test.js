import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { createPixelClient } from '../dist/pixel.js';

use(chaiAsPromised);

// Mock API Key - Replace with your real API key for live tests
const VALID_API_KEY = process.env.PIXEL_API_KEY || 'YOUR_VALID_PEXELS_API_KEY';
const INVALID_API_KEY = 'INVALID_KEY';

describe('Pixel Library', function () {
  this.timeout(5000); // Extend timeout for async calls

  let pixel;

  describe('createPixelClient()', () => {
    it('should throw TypeError if API key is not a string', async () => {
      await expect(createPixelClient(null)).to.be.rejectedWith(TypeError);
      await expect(createPixelClient(12345)).to.be.rejectedWith(TypeError);
    });

    it('should throw Error if API key is invalid', async () => {
      await expect(createPixelClient(INVALID_API_KEY)).to.be.rejectedWith(Error);
    });

    it('should create a PixelClient instance with a valid API key', async () => {
      // Skip if API key is not provided
      if (VALID_API_KEY === 'YOUR_VALID_PEXELS_API_KEY') {
        return this.skip();
      }

      const client = await createPixelClient(VALID_API_KEY);
      expect(client).to.be.an('object');
      expect(client.apikey).to.equal(VALID_API_KEY);
      expect(client.image).to.have.property('get');
      expect(client.video).to.have.property('get');
    });
  });

  describe('PixelClient image methods', () => {
    before(async function () {
      if (VALID_API_KEY === 'YOUR_VALID_PEXELS_API_KEY') {
        this.skip();
      }
      pixel = await createPixelClient(VALID_API_KEY);
    });

    it('should fetch an image by ID', async () => {
      const image = await pixel.image.get('2014422');
      expect(image).to.be.an('object');
      expect(image).to.have.property('id');
    });

    it('should search images with a query string', async () => {
      const results = await pixel.image.search('nature');
      expect(results).to.be.an('object');
      expect(results).to.have.property('photos');
    });

    it('should search images with an object parameter', async () => {
      const results = await pixel.image.search({ query: 'mountain', per_page: '5' });
      expect(results).to.have.property('photos');
    });

    it('should fetch curated images', async () => {
      const curated = await pixel.getCuratedImages({ page: '1', per_page: '3' });
      expect(curated).to.have.property('photos');
    });
  });

  describe('PixelClient video methods', () => {
    before(async function () {
      if (VALID_API_KEY === 'YOUR_VALID_PEXELS_API_KEY') {
        this.skip();
      }
      pixel = await createPixelClient(VALID_API_KEY);
    });

    it('should fetch a video by ID', async () => {
      const video = await pixel.video.get('2499611');
      expect(video).to.be.an('object');
      expect(video).to.have.property('id');
    });

    it('should search videos with a query string', async () => {
      const results = await pixel.video.search('beach');
      expect(results).to.have.property('videos');
    });

    it('should fetch popular videos', async () => {
      const popular = await pixel.getPopularVideos({ page: '1', per_page: '5' });
      expect(popular).to.have.property('videos');
    });
  });

  describe('Cache behavior', () => {
    it('should cache a request and retrieve from cache', async function () {
      if (VALID_API_KEY === 'YOUR_VALID_PEXELS_API_KEY') {
        this.skip();
      }

      const pixel = await createPixelClient(VALID_API_KEY);
      const initial = await pixel.image.get('2014422');

      const cached = pixel.cache.get('https://api.pexels.com/v1/photos/2014422');
      expect(cached).to.deep.equal(initial);
    });
  });
});
