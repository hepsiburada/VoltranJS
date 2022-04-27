import { ServerApiManagerCache, ClientApiManagerCache } from './apiManagerCache';

const getApiService = () => {
  const isBrowser = typeof window !== 'undefined';

  return isBrowser ? ClientApiManagerCache : ServerApiManagerCache;
};

const apiService = getApiService();
export default apiService;
