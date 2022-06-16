import freezeServices from './freezeServices';

const createCache = (ApiManager, services, config, func) => {
  const cache = {};
  const frozenServicesData = freezeServices(services);

  Object.entries(services).forEach(entity => {
    const [serviceKey, serviceValues] = entity;
    cache[frozenServicesData[serviceKey]] = ApiManager(serviceValues, config, func);
  });

  return cache;
};

export default createCache;
