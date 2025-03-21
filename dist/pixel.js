var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PixelClient_instances, _a, _PixelClient_retrieveDataFromEndpoint;
class PixelCache extends Map {
    constructor() {
        super(...arguments);
        this.maxage = 5000;
        this.maxentries = 100;
        this.entryorder = [];
    }
    set(key, value, age = this.maxage) {
        super.set(key, value);
        this.entryorder.push(key);
        if (this.entryorder.length > this.maxentries) {
            const oldest = this.entryorder.shift();
            if (oldest)
                super.delete(oldest);
        }
        setTimeout(() => this.delete(key), age);
        return this;
    }
}
class PixelClient {
    constructor(apiKey) {
        _PixelClient_instances.add(this);
        this.apikey = apiKey;
        this.cache = new PixelCache();
        this.image = {
            search: this.searchImages.bind(this),
            get: this.getImage.bind(this),
        };
        this.video = {
            search: this.searchVideos.bind(this),
            get: this.getVideo.bind(this),
        };
    }
    getImage(id) {
        if (typeof id === "string")
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "image", [id]);
        if (typeof id === "number")
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "image", [`${id}`]);
        if (typeof id === "object")
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "image", [id.id]);
        throw new TypeError("Invalid image ID");
    }
    getVideo(id) {
        if (typeof id === "string")
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "video", [id]);
        if (typeof id === "number")
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "video", [`${id}`]);
        if (typeof id === "object")
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "video", [id.id]);
        throw new TypeError("Invalid video ID");
    }
    getCuratedImages(...args) {
        const params = ["", ""];
        if (typeof args[0] === "string") {
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "imagecurated", params.map((v, i) => args[i] || v));
        }
        if (Array.isArray(args[0])) {
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "imagecurated", params.map((v, i) => String(args[0][i]) || v));
        }
        if (typeof args[0] === "object") {
            const parameterpositions = _a.parameterpositions.get("imagecurated");
            if (!parameterpositions)
                throw new Error(); // this will never run
            for (const [key, value] of Object.entries({
                page: args[0].page,
                per_page: args[0].per_page,
            })) {
                const pos = parameterpositions[key];
                params[pos] = value !== null && value !== void 0 ? value : params[pos];
            }
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "imagecurated", params);
        }
        throw new TypeError("Invalid curated images parameters");
    }
    getPopularVideos(...args) {
        const params = ["", ""];
        if (typeof args[0] === "string") {
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "videopopular", params.map((v, i) => args[i] || v));
        }
        if (Array.isArray(args[0])) {
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "videopopular", params.map((v, i) => String(args[0][i]) || v));
        }
        if (typeof args[0] === "object") {
            const parameterpositions = _a.parameterpositions.get("videopopular");
            if (!parameterpositions)
                throw new Error(); // this will never run
            for (const [key, value] of Object.entries({
                min_width: args[0].min_width,
                min_height: args[0].min_height,
                min_duration: args[0].min_duration,
                max_duration: args[0].max_duration,
                page: args[0].page,
                per_page: args[0].per_page,
            })) {
                const pos = parameterpositions[key];
                params[pos] = value !== null && value !== void 0 ? value : params[pos];
            }
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "videopopular", params);
        }
        throw new TypeError("Invalid popular videos parameters");
    }
    searchImages(...args) {
        const params = Array(7).fill("");
        if (typeof args[0] === "string") {
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "imagesearch", params.map((v, i) => args[i] || v));
        }
        if (Array.isArray(args[0])) {
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "imagesearch", params.map((v, i) => String(args[0][i]) || v));
        }
        if (typeof args[0] === "object") {
            const parameterpositions = _a.parameterpositions.get("imagesearch");
            if (!parameterpositions)
                throw new Error(); // this will never run
            for (const [key, value] of Object.entries({
                query: args[0].query,
                orientation: args[0].orientation,
                size: args[0].size,
                color: args[0].color,
                locale: args[0].locale,
                page: args[0].page,
                per_page: args[0].per_page
            })) {
                const pos = parameterpositions[key];
                params[pos] = value !== null && value !== void 0 ? value : params[pos];
            }
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "imagesearch", params);
        }
        throw new TypeError("Invalid search parameters");
    }
    searchVideos(...args) {
        const params = Array(6).fill("");
        if (typeof args[0] === "string") {
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "videosearch", params.map((v, i) => args[i] || v));
        }
        if (Array.isArray(args[0])) {
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "videosearch", params.map((v, i) => String(args[0][i]) || v));
        }
        if (typeof args[0] === "object") {
            const parameterpositions = _a.parameterpositions.get("videosearch");
            if (!parameterpositions)
                throw new Error(); // this will never run
            for (const [key, value] of Object.entries({
                query: args[0].query,
                orientation: args[0].orientation,
                size: args[0].size,
                locale: args[0].locale,
                page: args[0].page,
                per_page: args[0].per_page
            })) {
                const pos = parameterpositions[key];
                params[pos] = value !== null && value !== void 0 ? value : params[pos];
            }
            return __classPrivateFieldGet(this, _PixelClient_instances, "m", _PixelClient_retrieveDataFromEndpoint).call(this, "videosearch", params);
        }
        throw new TypeError("Invalid search parameters");
    }
}
_a = PixelClient, _PixelClient_instances = new WeakSet(), _PixelClient_retrieveDataFromEndpoint = function _PixelClient_retrieveDataFromEndpoint(endpointId, parameters) {
    const endpoint = _a.endpoints[endpointId];
    if (!endpoint)
        throw new Error("Invalid endpoint ID");
    const endpointUrl = endpoint.replace(/\{\{(\d+)\}\}/g, (match, index) => parameters[index] || "");
    if (this.cache.has(endpointUrl))
        return Promise.resolve(this.cache.get(endpointUrl));
    return fetch(endpointUrl, {
        mode: "no-cors",
        headers: {
            Authorization: this.apikey,
        },
    })
        .then((res) => {
        if (!res.ok)
            throw res;
        return res.json();
    })
        .then((data) => {
        this.cache.set(endpointUrl, data, ["image", "video"].includes(endpoint) ? 86400 : undefined);
        return data;
    });
};
PixelClient.endpoints = {
    image: "https://api.pexels.com/v1/photos/{{0}}",
    video: "https://api.pexels.com/videos/videos/{{0}}",
    imagesearch: "https://api.pexels.com/v1/search/?query={{0}}&orientation={{1}}&size={{2}}&color={{3}}&locale={{4}}&page={{5}}&per_page={{6}}",
    videosearch: "https://api.pexels.com/videos/search/?query={{0}}&orientation={{1}}&size={{2}}&locale={{3}}&page={{4}}&per_page={{5}}",
    imagecurated: "https://api.pexels.com/v1/curated/?page={{0}}&per_page={{1}}",
    videopopular: "https://api.pexels.com/videos/popular/?min_width={{0}}&min_height={{1}}&min_duration={{2}}&max_duration={{3}}&page={{4}}&per_page={{5}}",
};
PixelClient.parameterpositions = new Map([
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
export function createPixelClient(key) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(key && typeof key === "string")) {
            throw new TypeError("API key must be a string");
        }
        const testStatus = yield fetch("https://api.pexels.com/v1/photos/2014422", {
            mode: "no-cors",
            headers: {
                Authorization: key,
            },
        })
            .then((res) => res.status)
            .catch((_) => 0);
        if (testStatus === 200)
            return new PixelClient(key);
        throw new Error("Invalid API key");
    });
}
