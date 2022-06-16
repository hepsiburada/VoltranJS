import { getApiService } from './apiService';

const apiServiceMiddleware = func => {
  const apiService = getApiService(func);

  return apiService;
};

export default apiServiceMiddleware;
