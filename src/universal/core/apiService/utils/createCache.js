import freezeServices from './freezeServices';

const createCache = (ApiManager, services, timeout) => {
  const cache = {};
  const frozenServicesData = freezeServices(services);

  Object.entries(services).forEach(entity => {
    const [serviceKey, serviceValues] = entity;
    cache[frozenServicesData[serviceKey]] = ApiManager(serviceValues, timeout);
  });

  return cache;
};

export default createCache;
