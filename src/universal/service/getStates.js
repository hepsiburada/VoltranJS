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

const getStates = async (component, context, predefinedInitialState) => {
  const initialState = predefinedInitialState || { data: {} };
  let subComponentFiles = [];
  let responseOptions = {};
  const responseData = getResponseData(component, context, initialState.data);

  if (context.isWithoutState) {
    return { initialState, subComponentFiles, responseOptions, ...responseData };
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

  return {
    initialState,
    subComponentFiles,
    responseOptions,
    ...responseData
  };
};

export default getStates;
