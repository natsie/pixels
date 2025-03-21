# 📸 Pixel

A simple, lightweight JavaScript library for interacting with the Pexels API. Easily fetch and search for royalty-free **images** and **videos** with built-in caching and flexible parameters.

> ⚠️ This is an **alpha release**. Expect updates and enhancements.

* * *

## Table of Contents

- Features
- Installation
- Getting Started
- API Reference
    - PixelClient
    - PixelCache
- Available Methods
- Error Handling
- Development & Testing
- License

* * *

## Features

- 📷 Fetch images and videos by ID
- 🔍 Search with flexible parameters (object, array, or positional)
- ⚡ Built-in cache with expiration and max entries
- 🔑 API key validation before usage
- 🧩 Lightweight and dependency-free for runtime

* * *

## Installation

Clone this repo and install dependencies:

```bash
git clone https://github.com/natsie/pixel.git
cd pixel
npm install
```

Run development or test scripts:

```bash
npm run dev # Run development script
npm test # Run Mocha tests
```

* * *

## Getting Started

### 1. Import the library

```javascript
import { createPixelClient } from './dist/pixel.js';
```

### 2. Create a client instance

```javascript
(async () => {
  const pixel = await createPixelClient('YOUR_PEXELS_API_KEY');
  const imageData = await pixel.image.get('2014422');
  console.log(imageData);
  }
)();
```

* * *

## API Reference

### PixelClient

> 
> The main interface to interact with Pexels API.

#### Properties

| Property | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | Your Pexels API key |
| `cache` | `PixelCache` | Cache instance for responses |
| `image` | `object` | Methods: `search`, `get` |
| `video` | `object` | Methods: `search`, `get` |

#### Do not instantiate directly

Always use `createPixelClient()` to validate your API key.

* * *

### PixelCache

In-memory cache with **expiration** and **entry limits**.

| Property | Default | Description |
| --- | --- | --- |
| `maxage` | `5000ms` | Default time-to-live per cache entry |
| `maxentries` | `100` | Max cache size (older entries evicted) |

#### Methods

```javascript
cache.set(key: string, value: object, age?: number): PixelCache
```

* * *

## Available Methods

### ```createPixelClient(apiKey: string): Promise<PixelClient>```

Validate the API key and return a client instance.

* * *

### ```pixel.image.get(id: string | { id: string }): Promise<object>```

Fetch a specific image by ID.

```javascript
const image = await pixel.image.get("2014422");
```

* * *

### ```pixel.video.get(id: string | { id: string }): Promise<object>```

Fetch a specific video by ID.

```javascript
const video = await pixel.video.get("123456");
```

* * *

### ```pixel.image.search(...params): Promise<object>```

Search images with flexible input:

#### Options:

- Positional:

```javascript
search(query, orientation, size, color, locale, page, per_page)
```

- Array:

```javascript
search(['nature', 'landscape', 'medium', 'green', 'en-US', '1', '15'])
```

- Object:

```javascript
search({ query: 'nature', orientation: 'landscape', size: 'medium', color: 'green', locale: 'en-US', page: '1', per_page: '15'});
```

* * *

### ```pixel.video.search(...params): Promise<object>```;

Same pattern as image search, including the color parameter.

* * *

### ```pixel.getCuratedImages(...params): Promise<object>```

Fetch curated image collections.

- Object Example:

```javascript
getCuratedImages({ page: '2', per_page: '10' });
```

* * *

### ```pixel.getPopularVideos(...params): Promise<object>```

Fetch popular video collections.

- Object Example:

```javascript
getPopularVideos({ page: '1', per_page: '20' });
```

* * *

## Error Handling

| Error Type | Description |
| --- | --- |
| `TypeError` | Incorrect argument types or invalid API key |
| `Error` | Network failure or invalid API responses |
| Cache Miss | If cache is empty, data is fetched and cached again |

* * *

## Development & Testing

Run a dev script:

```bash
npm run dev
```

Run tests (Mocha + Chai):

```bash
npm test
```

> 
> ✅ Tip: Store your API key securely in your dev environment when testing.

* * *

## License

**MIT OR Apache-2.0**  
© Oghenevwegba Obire

* * *

## Contributing

Pull requests, issues, and stars are welcome!  
Check [issues page](https://github.com/natsie/pixel/issues) to get started.

* * *