// in memory cache. Probably not the best solution - especially if there are multiple servers. consider using redis
type CacheEntry<T> = {
    data: T;
    expiry: number;
};

const cache: { [key: string]: CacheEntry<any> } = {};

// Set cache TTL (e.g., 1 hour)
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

export function setCache<T>(key: string, data: T, ttl = CACHE_TTL) {
cache[key] = {
    data,
    expiry: Date.now() + ttl,
};
}

export function getCache<T>(key: string): T | null {
const entry = cache[key];
if (!entry) {
    return null;
}

if (Date.now() > entry.expiry) {
    // Cache expired
    deleteCache(key);
    return null;
}

return entry.data;
}

export function deleteCache(key: string) {
    delete cache[key];
}
  