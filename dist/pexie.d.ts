import type { Photo, Video, Response as APIResponse } from "./types";
declare class PexieCache extends Map<string, object> {
    maxage: number;
    maxentries: number;
    entryorder: string[];
    timeouts: Record<string, ReturnType<typeof setTimeout>>;
    set(key: string, value: object, age?: number): this;
}
declare class PexieClient {
    #private;
    static endpoints: {
        image: string;
        video: string;
        imagesearch: string;
        videosearch: string;
        imagecurated: string;
        videopopular: string;
    };
    static parameterpositions: Map<"image" | "video" | "imagesearch" | "videosearch" | "imagecurated" | "videopopular", {
        [index: string]: number;
    }>;
    apikey: string;
    cache: PexieCache;
    image: {
        search: (...args: any[]) => Promise<APIResponse.Photo.Search>;
        get: (id: string | {
            id: string;
        }) => Promise<Photo>;
    };
    video: {
        search: (...args: any[]) => Promise<APIResponse.Video.Search>;
        get: (id: string | {
            id: string;
        }) => Promise<Video>;
    };
    constructor(apiKey: string);
    getImage(id: string | number | {
        id: string;
    }): Promise<Photo>;
    getVideo(id: string | number | {
        id: string;
    }): Promise<Video>;
    getCuratedImages(...args: (string | string[] | {
        [index: string]: string;
    })[]): Promise<APIResponse.Photo.Curated>;
    getPopularVideos(...args: (string | string[] | {
        [index: string]: string;
    })[]): Promise<APIResponse.Video.Popular>;
    searchImages(...args: (string | string[] | {
        [index: string]: string;
    })[]): Promise<APIResponse.Photo.Search>;
    searchVideos(...args: (string | string[] | {
        [index: string]: string;
    })[]): Promise<APIResponse.Video.Search>;
}
declare function createPexieClient(key: string): Promise<PexieClient>;
export { createPexieClient, PexieClient };
