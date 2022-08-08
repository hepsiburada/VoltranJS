const keyControl = (keys, key) => {
  for (const item in keys) {
    if (Array.isArray(keys[item])) {
      const arrayStatus = keyControl(keys[item], key);
      if (!arrayStatus) {
        return false;
      }
    }
    if (keys[item] === key) {
      return false;
    }
  }
  return true;
};

function omit(obj, ...keys) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => keyControl(keys, k)));
}

export default omit;
