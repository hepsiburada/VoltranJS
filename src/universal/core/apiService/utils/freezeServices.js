function freezeServices(services) {
  return Object.freeze(
    Object.keys(services).reduce((obj, val) => {
      // eslint-disable-next-line no-param-reassign
      obj[val] = val;
      return obj;
    }, {})
  );
}

export default freezeServices;
