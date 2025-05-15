import type { Photo, Video, RetrieveDataFromEndpoint, Response as APIResponse } from "./types";

class PexieCache extends Map<string, object> {
  maxage = 5000;
  maxentries = 100;
  entryorder: string[] = [];
  timeouts: Record<string, ReturnType<typeof setTimeout>> = {};
  set(key: string, value: object, age = this.maxage) {
    super.set(key, value);
    this.entryorder.push(key);
    if (this.entryorder.length > this.maxentries) {
      const oldest = this.entryorder.shift();
      if (oldest) {
        super.delete(oldest);
        delete this.timeouts[oldest];
        clearTimeout(this.timeouts[oldest]);
      }
    }

    clearTimeout(this.timeouts[`${key}`]);
    this.timeouts[`${key}`] = setTimeout(() => this.delete(key), age);
    return this;
  }
}

class PexieClient {
  static endpoints = {
    image: "https://api.pexels.com/v1/photos/{{0}}",
    video: "https://api.pexels.com/videos/videos/{{0}}",
    imagesearch:
      "https://api.pexels.com/v1/search/?query={{0}}&orientation={{1}}&size={{2}}&color={{3}}&locale={{4}}&page={{5}}&per_page={{6}}",
    videosearch:
      "https://api.pexels.com/videos/search/?query={{0}}&orientation={{1}}&size={{2}}&locale={{3}}&page={{4}}&per_page={{5}}",
    imagecurated: "https://api.pexels.com/v1/curated/?page={{0}}&per_page={{1}}",
    videopopular:
      "https://api.pexels.com/videos/popular/?min_width={{0}}&min_height={{1}}&min_duration={{2}}&max_duration={{3}}&page={{4}}&per_page={{5}}",
  };

  static parameterpositions = new Map<
    keyof typeof PexieClient.endpoints,
    { [index: string]: number }
  >([
    ["image", { id: 0 }],
    ["video", { id: 0 }],
    [
      "imagesearch",
      { query: 0, orientation: 1, size: 2, color: 3, locale: 4, page: 5, per_page: 6 },
    ],
    ["videosearch", { query: 0, orientation: 1, size: 2, locale: 3, page: 4, per_page: 5 }],
    ["imagecurated", { page: 0, per_page: 1 }],
    [
      "videopopular",
      { min_width: 0, min_height: 1, min_duration: 2, max_duration: 3, page: 4, per_page: 5 },
    ],
  ]);

  apikey: string;
  cache: PexieCache;
  image: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    search: (...args: any[]) => Promise<APIResponse.Photo.Search>;
    get: (id: string | { id: string }) => Promise<Photo>;
  };
  video: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    search: (...args: any[]) => Promise<APIResponse.Video.Search>;
    get: (id: string | { id: string }) => Promise<Video>;
  };
  constructor(apiKey: string) {
    this.apikey = apiKey;
    this.cache = new PexieCache();
    this.image = {
      search: this.searchImages.bind(this),
      get: this.getImage.bind(this),
    };
    this.video = {
      search: this.searchVideos.bind(this),
      get: this.getVideo.bind(this),
    };
  }

  #retrieveDataFromEndpoint: RetrieveDataFromEndpoint = async function (
    this: PexieClient,
    endpointId: keyof typeof PexieClient.endpoints,
    parameters: string[],
  ) {
    const endpoint = PexieClient.endpoints[endpointId];
    if (!endpoint) throw new Error("Invalid endpoint ID");

    const endpointUrl = endpoint.replace(
      /\{\{(\d+)\}\}/g,
      (match, index) => parameters[index] || "",
    );

    if (this.cache.has(endpointUrl)) return this.cache.get(endpointUrl);
    const res = await fetch(endpointUrl, {
      mode: "no-cors",
      headers: {
        Authorization: this.apikey,
      },
    });

    if (!res.ok) throw res;
    const data = await res.json();
    this.cache.set(endpointUrl, data, ["image", "video"].includes(endpoint) ? 86400 : undefined);
    return data;
  };

  getImage(id: string | number | { id: string }): Promise<Photo> {
    if (typeof id === "string") return this.#retrieveDataFromEndpoint("image", [id]);
    if (typeof id === "number") return this.#retrieveDataFromEndpoint("image", [`${id}`]);
    if (typeof id === "object") return this.#retrieveDataFromEndpoint("image", [id.id]);
    throw new TypeError("Invalid image ID");
  }

  getVideo(id: string | number | { id: string }): Promise<Video> {
    if (typeof id === "string") return this.#retrieveDataFromEndpoint("video", [id]);
    if (typeof id === "number") return this.#retrieveDataFromEndpoint("video", [`${id}`]);
    if (typeof id === "object") return this.#retrieveDataFromEndpoint("video", [id.id]);
    throw new TypeError("Invalid video ID");
  }

  getCuratedImages(
    ...args: (string | string[] | { [index: string]: string })[]
  ): Promise<APIResponse.Photo.Curated> {
    const params = ["", ""];
    if (typeof args[0] === "string") {
      return this.#retrieveDataFromEndpoint(
        "imagecurated",
        params.map((v, i) => (args[i] as string) || v),
      );
    }
    if (Array.isArray(args[0])) {
      return this.#retrieveDataFromEndpoint(
        "imagecurated",
        params.map((v, i) => String((args[0] as string[])[i]) || v),
      );
    }
    if (typeof args[0] === "object") {
      const parameterpositions = PexieClient.parameterpositions.get("imagecurated");
      if (!parameterpositions) throw new Error(); // this will never run
      for (const [key, value] of Object.entries({
        page: args[0].page,
        per_page: args[0].per_page,
      })) {
        const pos = parameterpositions[key];
        params[pos] = value ?? params[pos];
      }

      return this.#retrieveDataFromEndpoint("imagecurated", params);
    }

    throw new TypeError("Invalid curated images parameters");
  }

  getPopularVideos(
    ...args: (string | string[] | { [index: string]: string })[]
  ): Promise<APIResponse.Video.Popular> {
    const params = ["", ""];
    if (typeof args[0] === "string") {
      return this.#retrieveDataFromEndpoint(
        "videopopular",
        params.map((v, i) => (args[i] as string) || v),
      );
    }
    if (Array.isArray(args[0])) {
      return this.#retrieveDataFromEndpoint(
        "videopopular",
        params.map((v, i) => String((args[0] as string[])[i]) || v),
      );
    }
    if (typeof args[0] === "object") {
      const parameterpositions = PexieClient.parameterpositions.get("videopopular");
      if (!parameterpositions) throw new Error(); // this will never run
      for (const [key, value] of Object.entries({
        min_width: args[0].min_width,
        min_height: args[0].min_height,
        min_duration: args[0].min_duration,
        max_duration: args[0].max_duration,
        page: args[0].page,
        per_page: args[0].per_page,
      })) {
        const pos = parameterpositions[key];
        params[pos] = value ?? params[pos];
      }

      return this.#retrieveDataFromEndpoint("videopopular", params);
    }

    throw new TypeError("Invalid popular videos parameters");
  }

  searchImages(
    ...args: (string | string[] | { [index: string]: string })[]
  ): Promise<APIResponse.Photo.Search> {
    const params = Array(7).fill("");
    if (typeof args[0] === "string") {
      return this.#retrieveDataFromEndpoint(
        "imagesearch",
        params.map((v, i) => args[i] || v),
      );
    }
    if (Array.isArray(args[0])) {
      return this.#retrieveDataFromEndpoint(
        "imagesearch",
        params.map((v, i) => String((args[0] as string[])[i]) || v),
      );
    }
    if (typeof args[0] === "object") {
      const parameterpositions = PexieClient.parameterpositions.get("imagesearch");
      if (!parameterpositions) throw new Error(); // this will never run
      for (const [key, value] of Object.entries({
        query: args[0].query,
        orientation: args[0].orientation,
        size: args[0].size,
        color: args[0].color,
        locale: args[0].locale,
        page: args[0].page,
        per_page: args[0].per_page,
      })) {
        const pos = parameterpositions[key];
        params[pos] = value ?? params[pos];
      }

      return this.#retrieveDataFromEndpoint("imagesearch", params);
    }

    throw new TypeError("Invalid search parameters");
  }

  searchVideos(
    ...args: (string | string[] | { [index: string]: string })[]
  ): Promise<APIResponse.Video.Search> {
    const params = Array(6).fill("");
    if (typeof args[0] === "string") {
      return this.#retrieveDataFromEndpoint(
        "videosearch",
        params.map((v, i) => args[i] || v),
      );
    }
    if (Array.isArray(args[0])) {
      return this.#retrieveDataFromEndpoint(
        "videosearch",
        params.map((v, i) => String((args[0] as string[])[i]) || v),
      );
    }
    if (typeof args[0] === "object") {
      const parameterpositions = PexieClient.parameterpositions.get("videosearch");
      if (!parameterpositions) throw new Error(); // this will never run
      for (const [key, value] of Object.entries({
        query: args[0].query,
        orientation: args[0].orientation,
        size: args[0].size,
        locale: args[0].locale,
        page: args[0].page,
        per_page: args[0].per_page,
      })) {
        const pos = parameterpositions[key];
        params[pos] = value ?? params[pos];
      }

      return this.#retrieveDataFromEndpoint("videosearch", params);
    }

    throw new TypeError("Invalid search parameters");
  }
}

async function createPexieClient(key: string): Promise<PexieClient> {
  if (!(key && typeof key === "string")) {
    throw new TypeError("API key must be a string");
  }

  const testStatus = await fetch("https://api.pexels.com/v1/photos/2014422", {
    mode: "no-cors",
    headers: {
      Authorization: key,
    },
  })
    .then((res) => res.status)
    .catch((_) => 0);

  if (testStatus === 200) return new PexieClient(key);
  throw new Error("Invalid API key");
}

export { createPexieClient, PexieClient };
