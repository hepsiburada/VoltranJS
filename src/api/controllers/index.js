function registerControllersSuccess(req, res) {
  res.json({ status: true });
}

function registerControllers(hiddie) {
  hiddie.use('/api/status', registerControllersSuccess);
}

export { registerControllersSuccess };
export default registerControllers;
