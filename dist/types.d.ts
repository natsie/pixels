type PhotoSize = "tiny" | "small" | "medium" | "large" | "large2x" | "original" | "portrait" | "landscape";
type PhotoSizeMap = {
    [size in PhotoSize]: string;
};
interface PaginationParameters {
    page?: number;
    per_page?: number;
}
interface SearchParameters extends PaginationParameters {
    query: string;
    orientation?: "landscape" | "portrait" | "square";
    size?: "large" | "medium" | "small";
    locale?: string;
}
interface VideoSearchParameters extends SearchParameters {
}
interface PhotoSearchParameters extends SearchParameters {
    color?: "red" | "orange" | "yellow" | "green" | "turquoise" | "blue" | "violet" | "pink" | "brown" | "black" | "gray" | "white" | (`#${string}` & {});
}
interface CuratedPhotosParameters extends PaginationParameters {
}
interface PopularVideosParameters extends PaginationParameters {
    min_width?: number;
    min_height?: number;
    min_duration?: number;
    max_duration?: number;
}
interface User {
    Name: string;
    Id: number;
    Url: string;
}
interface VideoFile {
    id: number;
    quality: "hd" | "sd";
    file_type: string;
    width: number;
    height: number;
    fps: number;
    link: string;
}
interface VideoPicture {
    id: number;
    nr: number;
    picture: string;
}
interface Photo {
    id: number;
    width: number;
    height: number;
    url: string;
    photographer: User["Name"];
    photographer_url: User["Url"];
    photographer_id: User["Id"];
    avg_color: string;
    src: PhotoSizeMap;
    liked: boolean;
    alt: string;
}
interface Video {
    id: number;
    width: number;
    height: number;
    url: string;
    image: string;
    full_res: null;
    tags: string[];
    duration: number;
    user: User;
    video_files: VideoFile[];
    video_pictures: VideoPicture[];
}
declare namespace Response {
    namespace Photo {
        interface Search {
            total_results: number;
            page: number;
            per_page: number;
            photos: Photo[];
            prev_page?: string;
            next_page?: string;
        }
        interface Curated {
            page: number;
            per_page: number;
            photos: Photo[];
            prev_page?: string;
            next_page?: string;
        }
        interface Retrieved extends Photo {
        }
    }
    namespace Video {
        interface Search {
            total_results: number;
            page: number;
            per_page: number;
            videos: Video[];
            prev_page?: string;
            next_page?: string;
        }
        interface Popular {
            page: number;
            per_page: number;
            videos: Video[];
            prev_page?: string;
            next_page?: string;
        }
        interface Retrieved extends Video {
        }
    }
}
interface APIEndpoints {
    image: "https://api.pexels.com/v1/photos/{{0}}";
    video: "https://api.pexels.com/videos/videos/{{0}}";
    imagesearch: "https://api.pexels.com/v1/search/?query={{0}}&orientation={{1}}&size={{2}}&color={{3}}&locale={{4}}&page={{5}}&per_page={{6}}";
    videosearch: "https://api.pexels.com/videos/search/?query={{0}}&orientation={{1}}&size={{2}}&locale={{3}}&page={{4}}&per_page={{5}}";
    imagecurated: "https://api.pexels.com/v1/curated/?page={{0}}&per_page={{1}}";
    videopopular: "https://api.pexels.com/videos/popular/?min_width={{0}}&min_height={{1}}&min_duration={{2}}&max_duration={{3}}&page={{4}}&per_page={{5}}";
}
interface RetrieveDataFromEndpoint {
    (endpointId: keyof APIEndpoints, parameters: string[]): Promise<object>;
    (endpointId: "image", parameters: string[]): Promise<Photo>;
    (endpointId: "video", parameters: string[]): Promise<Video>;
    (endpointId: "imagesearch", parameters: string[]): Promise<Response.Photo.Search>;
    (endpointId: "videosearch", parameters: string[]): Promise<Response.Video.Search>;
    (endpointId: "imagecurated", parameters: string[]): Promise<Response.Photo.Curated>;
    (endpointId: "videopopular", parameters: string[]): Promise<Response.Video.Popular>;
}
export type { CuratedPhotosParameters, PaginationParameters, Photo, PhotoSearchParameters, PhotoSize, PhotoSizeMap, PopularVideosParameters, Response, SearchParameters, User, Video, VideoFile, VideoPicture, VideoSearchParameters, RetrieveDataFromEndpoint };
