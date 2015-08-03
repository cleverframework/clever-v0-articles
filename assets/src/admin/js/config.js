export default (app) => {
  const config = {};
  app.config = config;

  config.name = `Clever Administration - ${window.packageName}`;

  return app;
}
