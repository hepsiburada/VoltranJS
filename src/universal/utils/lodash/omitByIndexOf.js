function omitByIndexOf(object, keys) {
  if (object == null) {
    return {};
  }

  const result = Object.keys(object).reduce((result, cookiesKey) => {
    if (object[cookiesKey]) {
      if (keys.some(item => cookiesKey.indexOf(item) === -1)) {
        return {
          ...result,
          [cookiesKey]: object[cookiesKey]
        };
      }
      return result;
    }
    return result;
  }, {});

  return result;
}

export default omitByIndexOf;
