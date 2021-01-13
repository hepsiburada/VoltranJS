import registerControllers, { registerControllersSuccess } from '../index';

describe('Controllers', () => {
  it('registerControllersSuccess should call res.json', () => {
    const dumpRes = {
      json: jest.fn()
    };

    registerControllersSuccess(undefined, dumpRes);

    expect(dumpRes.json).toHaveBeenCalledWith({ status: true });
  });

  it('registerControllers should call hiddie.use with correct params', () => {
    const dumpHiddie = {
      use: jest.fn()
    };

    registerControllers(dumpHiddie);

    expect(dumpHiddie.use).toHaveBeenCalledWith('/api/status', registerControllersSuccess);
  });
});
