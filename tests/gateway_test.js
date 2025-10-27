require('dotenv').config({ path: '.env' });
const request = require('supertest');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const limiter = require('../config/rateLimit');
const corsOptions = require('../config/corsOptions');
const authenticateToken = require('../middleware/authenticate');
const requestLogger = require('../middleware/logger');
const errorHandler = require('../middleware/errorHandler');
const setupProxy = require('../services/proxyService');
const routes = require('../config/routes');

// Setup an instance of the app for testing
const app = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(limiter);
app.use(requestLogger);

app.use((req, res, next) => {
  if (Object.keys(routes).some(route => req.path.startsWith(route))) {
    return authenticateToken(req, res, next);
  }
  next();
});

setupProxy(app);
app.get('/healthz', (req, res) => res.json({ status: 'ok', timestamp: Date.now() }));
app.use(errorHandler);

describe('Adapis API Gateway', () => {
  test('Health check endpoint returns status ok', async () => {
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('Protected route denies request without JWT', async () => {
    const res = await request(app).get('/api/users');
    // Should block unauthorized by status 401 or 403
    expect([401,403]).toContain(res.statusCode);
    expect(res.body.error).toBeDefined();
  });

  test('Rate limiting returns error after exceeding limit', async () => {
    // Adjust rateLimit config for quicker testing if needed
    for(let i=0;i<=process.env.RATE_LIMIT_MAX;i++) {
      await request(app).get('/healthz');
    }
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toBe(429);
    expect(res.body.message).toContain('Too many requests');
  });

  test('CORS allows whitelisted origin', async () => {
    const origin = process.env.ALLOWED_ORIGINS.split(',')[0];
    const res = await request(app)
      .get('/healthz')
      .set('Origin', origin);
    expect(res.headers['access-control-allow-origin']).toBe(origin);
  });

  test('CORS blocks non-whitelisted origin', async () => {
    const res = await request(app)
      .get('/healthz')
      .set('Origin', 'https://evil.com');
    expect(res.statusCode).toBe(200); // Request returns 200 but origin is not allowed
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

});
