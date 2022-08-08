function groupBy(arr, predicate) {
  return arr.reduce((obj, item) => {
    // Check if the predicate is a function to run on the item or a property of it
    const key = predicate
      ? typeof predicate === 'function'
        ? predicate(item)
        : item[predicate]
      : item;

    if (obj && !obj.hasOwnProperty(key)) {
      obj[key] = [];
    }

    // Push the value to the object
    obj[key].push(item);

    // Return the object to the next item in the loop
    return obj;
  }, {});
}

export default groupBy;
