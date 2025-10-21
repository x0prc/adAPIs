const { createProxyMiddleware } = require('http-proxy-middleware');
const routes = require('../config/routes');

function setupProxy(app) {
  Object.entries(routes).forEach(([path, target]) => {
    app.use(path, createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^${path}`]: '' },
      onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(502).json({ error: 'Proxy error encountered.' });
      }
    }));
  });
}

module.exports = setupProxy;
