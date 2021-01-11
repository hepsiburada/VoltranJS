const appConfig = require('__APP_CONFIG__');

const DEFAULT_EXPIRE_TIME = appConfig?.internalCache?.defaultInternalCacheMilliseconds;

class CacheManager {
  constructor() {
    this.store = new Map();
  }

  get(options) {
    const { cacheKey, expireTime } = options;

    const cache = this.store.get(cacheKey);
    if (!cache) {
      return null;
    }

    const { createdDate, cacheValue } = cache;
    const cacheCreatedDate = cache && new Date(createdDate);
    const cacheExpireDate = new Date(new Date() - (expireTime || DEFAULT_EXPIRE_TIME));

    return {
      createdDate,
      cacheValue,
      isExpired: cacheExpireDate > cacheCreatedDate
    };
  }

  put(options, val) {
    const { cacheKey } = options;

    this.store.set(cacheKey, {
      createdDate: new Date(),
      cacheValue: val
    });
  }

  remove(cacheKey) {
    this.store.delete(cacheKey);
  }

  removeAll() {
    this.store = new Map();
  }

  delete() {
    // no op here because this is standalone, not a part of $cacheFactory
  }
}

export default CacheManager;
