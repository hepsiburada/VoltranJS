let featureToggleService = [];

function load(tempFeatureToggles) {
  featureToggleService = tempFeatureToggles;
}

function isOn(name) {
  const index = featureToggleService.findIndex(toggle => toggle.name === name);

  if (index > -1) {
    return featureToggleService[index].isOn;
  }

  return false;
}

const getToggles = data => {
  return data.reduce((el, name) => {
    // eslint-disable-next-line no-param-reassign
    el[name] = isOn(name);
    return el;
  }, {});
};

export default { isOn, load, getToggles };
