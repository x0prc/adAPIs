require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const limiter = require('./config/rateLimit');
const corsOptions = require('./config/corsOptions');
const authenticateToken = require('./middleware/authenticate');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const setupProxy = require('./services/proxyService');
const routes = require('./config/routes');

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(limiter);
app.use(requestLogger);

// Authenticate only proxied routes (not healthcheck or root)
app.use((req, res, next) => {
  if (Object.keys(routes).some(route => req.path.startsWith(route))) {
    return authenticateToken(req, res, next);
  }
  next();
});

// Proxy setup
setupProxy(app);

app.get('/healthz', (req, res) => res.json({ status: 'ok', timestamp: Date.now() }));

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`adapis secure API gateway running on port ${port}`);
});
