import { generateComponents } from '../../utils/helper';
import RequestDispatcher from '../../components/RequestDispatcher';

const componentConfig = require('__V_COMPONENTS__');

const ROUTE_PATHS = {
  REQUEST_DISPATCHER: '/RequestDispatcher'
};
const ROUTE_COMPONENTS = {
  [ROUTE_PATHS.REQUEST_DISPATCHER]: RequestDispatcher
};
const defaultPartialsConfig = {
  paths: ROUTE_PATHS,
  components: ROUTE_COMPONENTS
};

const mergePartials = () => {
  const { paths = {}, components = [], ...others } = componentConfig.default;

  return {
    paths: { ...paths, ...defaultPartialsConfig?.paths },
    components: { ...components, ...defaultPartialsConfig?.components },
    ...others
  };
};

const components = generateComponents(mergePartials());

export default components;
