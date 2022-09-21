function pickObject(object, keys) {
  return keys.reduce((obj, key) => {
    if (Array.isArray(key)) {
      return {
        ...obj,
        ...pickObject(object, key)
      };
    }

    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      return {
        ...obj,
        [key]: object[key]
      };
    }
    return obj;
  }, {});
}

function pick(object, ...keys) {
  return object == null ? {} : pickObject(object, keys);
}

export default pick;
