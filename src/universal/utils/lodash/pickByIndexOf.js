const isSomeKey = (item, cookiesKey) => {
  if (typeof item === "string") {
    return cookiesKey.indexOf(item) !== -1;
  }

  if (typeof item?.value === "string") {
    if (item?.exact) {
      return cookiesKey === item.value;
    }
    return cookiesKey.indexOf(item?.value) !== -1;
  }

  return false;
};

function pickByIndexOf(object, keys) {
  if (object == null) {
    return {};
  }

  const result = Object.keys(object).reduce((result, cookiesKey) => {
    if (object[cookiesKey]) {
      if (keys.some(item => isSomeKey(item, cookiesKey))) {
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

export default pickByIndexOf;
