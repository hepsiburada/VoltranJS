import * as ApiUtils from '../apiUtils';
import Request from '../../../model/Request';
import * as CacheUtils from '../../../core/cache/cacheUtils';

jest.mock('../../../core/cache/cacheUtils', () => ({
  createCacheManagerInstance: jest.fn()
}));

describe('apiUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getSortedParams should return undefined while nonSortedParams is undefined', () => {
    expect(ApiUtils.getSortedParams(undefined)).toEqual(undefined);
  });

  it('getSortedParams should return empty object while nonSortedParams is empty object', () => {
    expect(ApiUtils.getSortedParams({})).toEqual({});
  });

  it('getSortedParams should return correct object while nonSortedParams is defined', () => {
    const dumpNonSortedParams = {
      param2: 'param2',
      param3: 'param3',
      param1: 'param1'
    };

    const dumpSortedParams = {
      param1: 'param1',
      param2: 'param2',
      param3: 'param3'
    };
    expect(ApiUtils.getSortedParams(dumpNonSortedParams)).toEqual(dumpSortedParams);
  });

  it('getPayload should return correct payload while configArgument is undefined', () => {
    expect(ApiUtils.getPayload('url', 'method', 'params', undefined)).toEqual({
      url: 'url',
      method: 'method',
      params: 'params'
    });
  });

  it('getPayload should return correct payload while configArgument is defined', () => {
    expect(ApiUtils.getPayload('url', 'method', 'params', { argument: 'argument' })).toEqual({
      url: 'url',
      method: 'method',
      params: 'params',
      argument: 'argument'
    });
  });

  it('getRequest should return new Request object', () => {
    const spy = jest.spyOn(ApiUtils, 'getSortedParams');
    spy.mockReturnValue('mocked');

    const dumpApiManager = {
      api: {
        getUri: jest.fn()
      }
    };

    ApiUtils.getRequest(
      dumpApiManager,
      'method',
      'url',
      'paramsArgument',
      'configArgument',
      'response'
    );

    expect(ApiUtils.getSortedParams).toHaveBeenCalled();

    spy.mockRestore();
  });

  /*  const getRequest = ("apiManager", method, url, paramsArgument, configArgument, response) => {
    const params = getSortedParams(paramsArgument);
    const payload = getPayload(url, method, params, configArgument);
    const uri = apiManager.api.getUri(payload);

    return new Request(apiManager.api, payload, uri, response);
  }; */
});
