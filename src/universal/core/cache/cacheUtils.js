import CacheManager from './cacheManager';

let cacheManagerInstance = null;

function createCacheManagerInstance() {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new CacheManager();
  }
  return cacheManagerInstance;
}

export {
  createCacheManagerInstance,
}
