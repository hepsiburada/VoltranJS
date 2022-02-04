import omit from 'lodash/omit';
import camelCase from 'lodash/camelCase';

const blacklistFunctionName = [
  'getServerSideProps',
  'getServicesWithMultiple',
  'getInitialStateWithMultiple',
  'setDependencies',
  'setSeoState',
  'setRedirection',
  'setPageData'
];

const getCustomSetters = (component, context, data) => {
  const pattern = new RegExp(`^set`);
  const functions = omit(component, blacklistFunctionName);
  let result = {};

  Object.entries(functions).forEach(entity => {
    const [name, method] = entity;
    const isValidName = pattern.test(name);
    if (isValidName) {
      const propertyName = camelCase(name.replace(pattern, ''));
      let value = null;
      if (typeof method === 'function') {
        value = method(context, data);
      } else {
        value = method;
      }

      if (value) {
        result = {
          ...result,
          [propertyName]: value
        };
      }
    }
  });

  return result;
};

const getStates = async (component, context, predefinedInitialState) => {
  const initialState = predefinedInitialState || { data: {} };
  let subComponentFiles = [];
  let seoState = {};
  let responseOptions = {};
  let dependencies = [];
  let redirection = null;

  if (component.setDependencies) {
    dependencies = component.setDependencies(context);
  }

  if (context.isWithoutState) {
    return { initialState, seoState, dependencies, subComponentFiles, responseOptions };
  }

  if (!predefinedInitialState && component.getServerSideProps) {
    initialState.data = await component.getServerSideProps(context);
  }

  if (component?.setSeoState) {
    seoState = component.setSeoState(initialState?.data) || {};
  }

  if (initialState?.data?.subComponentFiles) {
    subComponentFiles = initialState?.data?.subComponentFiles || [];
  }

  if (initialState?.data?.responseOptions) {
    responseOptions = initialState?.data?.responseOptions || {};
  }

  if (component.setRedirection) {
    redirection = component.setRedirection(context, initialState.data);
  }

  if (component.setPageData) {
    redirection = component.setPageData(context, initialState.data);
  }

  const setters = getCustomSetters(component, context, initialState.data);

  return {
    initialState,
    seoState,
    subComponentFiles,
    responseOptions,
    dependencies,
    redirection,
    ...setters
  };
};

export default getStates;
