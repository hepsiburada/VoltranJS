// eslint-disable-next-line import/prefer-default-export
const structUtils = {
  groupBy(list, getFn) {
    const map = {};
    list.map(item => {
      const key = getFn(item);
      const collection = map[key];
      if (!collection) {
        map[key] = [item];
      } else {
        collection.push(item);
      }
    });
    return map;
  }
};

export default structUtils;
