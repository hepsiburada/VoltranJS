import { getEventBus, getProjectWindowData } from '../../utils/helper';

const isEventExist = eventName => {
  const eventBus = getEventBus();
  return eventBus && Object.keys(eventBus.events).indexOf(eventName) > -1;
};

const isExitCondition = condition => {
  return (
    Object.keys(getProjectWindowData()).indexOf(condition?.toUpperCase()) > -1 ||
    condition === 'default'
  );
};

export { isExitCondition, isEventExist };
