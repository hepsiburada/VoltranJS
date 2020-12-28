function registerControllers(hiddie) {
  hiddie.use('/api/status', (req, res) => {
    res.json({ status: true });
  });
}

export default registerControllers;
