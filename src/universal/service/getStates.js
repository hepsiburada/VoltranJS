const getResponseData = (component, context, data) => {
  let result = {};

  if (component?.setResponseData) {
    if (typeof component.setResponseData === 'function') {
      result = component.setResponseData(context, data);
    } else {
      result = component.setResponseData;
    }
  }

  return result;
};

const getExtraProps = (component, context, data) => {
  let result = {};

  if (component?.setExtraProps) {
    if (typeof component.setExtraProps === 'function') {
      result = component.setExtraProps(context, data);
    } else {
      result = component.setExtraProps;
    }
  }

  return result;
};

const getStates = async (component, context, predefinedInitialState) => {
  const initialState = predefinedInitialState || { data: {} };
  let subComponentFiles = [];
  let responseOptions = {};
  let responseData = {};
  const extraPropKeys = getExtraProps(component, context, initialState.data);

  if (context.isWithoutState) {
    return { initialState, subComponentFiles, responseOptions, extraPropKeys, ...responseData };
  }

  if (!predefinedInitialState && component?.getServerSideProps) {
    initialState.data = await component.getServerSideProps(context);
  }

  if (initialState?.data?.subComponentFiles) {
    subComponentFiles = initialState?.data?.subComponentFiles || [];
  }

  if (initialState?.data?.responseOptions) {
    responseOptions = initialState?.data?.responseOptions || {};
  }

  responseData = getResponseData(component, context, initialState.data);

  return {
    initialState,
    subComponentFiles,
    responseOptions,
    extraPropKeys,
    ...responseData
  };
};

export default getStates;
