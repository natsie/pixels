# Pexie: A Pexels API Client Library

Pexie is a lightweight, fast, and dependency-free client library designed to interact with the Pexels API. It provides an intuitive and fully typed interface for accessing Pexels' extensive collection of free stock photos and videos. Here are its key features:

- 💻**Intuitive API**: Simple and straightforward methods for searching and retrieving media.
- 🦺**Fully Typed**: Built with TypeScript, offering comprehensive type definitions for enhanced developer experience and fewer runtime errors.
- ⚡**Lightweight and Fast**: Minimal overhead with a focus on performance.
- 🎈**Dependency-Free**: No external libraries required, keeping your project lean.
- ✨**Flexible API**: Supports multiple parameter-passing styles (strings, arrays, objects).
- 📦**Built-in Cache**: Automatically caches API responses to reduce redundant requests and improve speed.
- 🔑**API Key Validation**: Validates the API key upon instantiation to ensure it works before making requests.

## Installation

To install Pexie, use npm:

```bash
npm install pexie
```

Or with Yarn:

```bash
yarn add pexie
```

## Usage

To get started, obtain an API key from [Pexels](https://www.pexels.com/api/). Then, create a Pexie client instance:

```typescript
import { createPexieClient } from 'pexie';

async function main() {
  try {
    const pexie = await createPexieClient('YOUR_API_KEY');
    console.log('Pexie client created successfully!');
  } catch (error) {
    console.error('Failed to create Pexie client:', error);
  }
}

main();
```

### Fetching a Photo by ID

Retrieve a specific photo using its ID:

```typescript
const photo = await pexie.image.get('2014422');
console.log(photo.alt); // Logs the photo's alt text
```

### Searching for Photos

Search for photos with a simple query:

```typescript
const results = await pexie.image.search('nature');
console.log(results.photos);
```

Or use detailed parameters:

```typescript
const results = await pexie.image.search({
  query: 'mountain',
  orientation: 'landscape',
  size: 'large',
  per_page: '5'
});
```

### Fetching Curated Photos

Get a list of curated photos:

```typescript
const curated = await pexie.getCuratedImages({ page: '1', per_page: '10' });
console.log(curated.photos);
```

### Fetching a Video by ID

Retrieve a specific video:

```typescript
const video = await pexie.video.get('2499611');
console.log(video.duration); // Logs the video duration
```

### Searching for Videos

Search for videos with a query:

```typescript
const results = await pexie.video.search('beach');
console.log(results.videos);
```

### Fetching Popular Videos

Get a list of popular videos:

```typescript
const popular = await pexie.getPopularVideos({ per_page: '5', min_duration: '10' });
console.log(popular.videos);
```

## API Reference

### `createPexieClient(apiKey: string): Promise<PexieClient>`

Creates a `PexieClient` instance after validating the API key.

- **Parameters**:
  - `apiKey`: A string representing your Pexels API key.
- **Returns**: A `Promise` resolving to a `PexieClient` instance.
- **Throws**:
  - `TypeError`: If the API key is not a string.
  - `Error`: If the API key is invalid (e.g., fails a test request).

### `PexieClient`

The core class for interacting with the Pexels API.

#### Properties

- `apikey: string`: The API key used for authentication.
- `cache: PexieCache`: The built-in cache instance.
- `image`: Methods for photo operations.
  - `search(...args): Promise<Response.Photo.Search>`: Searches for photos.
  - `get(id: string | number | { id: string }): Promise<Photo>`: Retrieves a photo by ID.
- `video`: Methods for video operations.
  - `search(...args): Promise<Response.Video.Search>`: Searches for videos.
  - `get(id: string | number | { id: string }): Promise<Video>`: Retrieves a video by ID.

#### Methods

- `getCuratedImages(...args): Promise<Response.Photo.Curated>`: Fetches curated photos.
- `getPopularVideos(...args): Promise<Response.Video.Popular>`: Fetches popular videos.
- `searchImages(...args): Promise<Response.Photo.Search>`: Alias for `image.search`.
- `searchVideos(...args): Promise<Response.Video.Search>`: Alias for `video.search`.

#### Parameter Flexibility

Methods accepting parameters (e.g., `searchImages`, `getCuratedImages`) support three input styles:

1. **Positional Strings**: Pass parameters as strings in order:
   ```typescript
   pexie.searchImages('nature', 'landscape', 'large');
   ```
2. **Array of Strings**: Pass an array of strings:
   ```typescript
   pexie.searchImages(['nature', 'landscape', 'large']);
   ```
3. **Object**: Pass an object with named parameters:
   ```typescript
   pexie.searchImages({ query: 'nature', orientation: 'landscape', size: 'large' });
   ```

Refer to the type definitions (e.g., `PhotoSearchParameters`) for valid parameter names and values.

### Key Types

- `PhotoSize`: Enum-like type for photo sizes (`"tiny"`, `"small"`, etc.).
- `Photo`: Interface for photo data (id, photographer, src, etc.).
- `Video`: Interface for video data (id, duration, video_files, etc.).
- `Response.Photo.Search`: Shape of photo search results.
- `Response.Video.Popular`: Shape of popular video results.

For a full list, see the type definitions in the source code.

## Cache

Pexie includes a built-in caching system via the `PexieCache` class, which extends `Map`. It features:

- **Maximum Age**: Entries expire after a set time (default: 5000ms for searches, 86400ms for individual media).
- **Maximum Entries**: Limits cache to 100 entries, evicting the oldest when full.
- **Automatic Caching**: Responses are cached automatically on fetch.

Example of cache in action:

```typescript
const photo1 = await pexie.image.get('2014422'); // Fetches from API
const photo2 = await pexie.image.get('2014422'); // Retrieves from cache
```

## Error Handling

Pexie handles errors as follows:

- **Invalid API Key**: `createPexieClient` throws an `Error` if the key fails validation.
- **Invalid Parameters**: Methods throw `TypeError` for incorrect input types (e.g., invalid ID).
- **API Errors**: Failed requests reject with the response object, which can be inspected for details.

Wrap calls in try-catch blocks for robust error handling:

```typescript
try {
  const photo = await pexie.image.get('invalid-id');
} catch (error) {
  console.error('Error fetching photo:', error);
}
```

## Testing

Pexie includes tests written with Chai and chai-as-promised. To run them:

1. Set your Pexels API key in the environment variable `PEXELS_API_KEY`, or update the test file with a valid key.
2. Install dependencies (e.g., `npm install chai chai-as-promised`).
3. Run the tests:

```bash
npm test
```

The test suite covers client creation, image/video fetching, searching, and caching behavior.