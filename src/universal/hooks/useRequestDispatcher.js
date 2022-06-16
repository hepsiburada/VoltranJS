import { useEffect, useReducer } from 'react';
import requestDispatcher from '../utils/requestDispatcher';

function createAction(type, payload) {
  return {
    type,
    payload
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const initialState = {
  isLoading: false,
  data: null,
  err: null
};

function init(defaultData) {
  return { ...initialState, data: { ...initialState.data, ...defaultData } };
}

const useRequestDispatcher = ({ effect, subscribe = '', defaultData }) => {
  const [store, dispatch] = useReducer(reducer, defaultData, init);
  const { isLoading, data, error } = store;

  const fetchData = params => {
    if (effect) {
      dispatch(
        createAction('SET_LOADING', {
          isLoading: true
        })
      );
      if (Array.isArray(effect)) {
        effect?.forEach(request => {
          requestDispatcher.request(request, params);
        });
      } else {
        requestDispatcher.request(effect, params);
      }
    }
  };

  useEffect(() => {
    if (process.env.BROWSER && subscribe) {
      requestDispatcher.subscribe(subscribe, (error, data) => {
        if (error) {
          dispatch(
            createAction('UPDATE_DATA', {
              isLoading: false,
              error
            })
          );
        } else {
          dispatch(
            createAction('UPDATE_DATA', {
              isLoading: false,
              error: null,
              data
            })
          );
        }
      });
    }
  }, []);

  return {
    isLoading,
    data,
    error,
    fetchData
  };
};

export default useRequestDispatcher;
