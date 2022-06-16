import { ServerApiManagerCache, ClientApiManagerCache } from './apiManagerCache';

const getApiService = func => {
  const isBrowser = typeof window !== 'undefined';

  return isBrowser ? ClientApiManagerCache(func) : ServerApiManagerCache(func);
};

const apiService = getApiService();
export default apiService;
export { getApiService };
