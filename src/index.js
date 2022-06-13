import voltran from './universal/partials/withBaseComponent';
import apiService, { ClientApiManager, ServerApiManager } from './universal/core/apiService';
import requestDispatcher from './universal/utils/requestDispatcher';
import useRequestDispatcher from './universal/hooks/useRequestDispatcher';

export default voltran;
export { ClientApiManager, ServerApiManager, apiService, requestDispatcher, useRequestDispatcher };
