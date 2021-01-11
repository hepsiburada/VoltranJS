import CacheManager from './cacheManager';

let cacheManagerInstance = null;

function createCacheManagerInstance() {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new CacheManager();
  }
  return cacheManagerInstance;
}

// eslint-disable-next-line import/prefer-default-export
export { createCacheManagerInstance };
