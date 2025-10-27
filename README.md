# adAPIs
Idea : A secure API gateway for modern web applications, focusing on authentication, routing, rate limiting, and logging.

Name Inspiration : Adapis, like its namesake primate, embodies adaptability, perceptive threat detection, evolutionary foundation, and efficient balance—making it the agile, secure bridge for modern APIs.

## Features

- JWT authentication for all protected endpoints
- Rate limiting for abuse prevention
- CORS restriction to allowed origins
- Detailed request logging
- Proxy logic for backend microservices

## Quick Start

1. **Install dependencies**
    ```
    npm install
    ```

2. **Configure environment**
    - Create a `.env` file with your settings (see `.env.example`):
      ```
      PORT=3000
      JWT_SECRET=your_super_secure_jwt_secret
      USER_SERVICE_URL=http://localhost:4001
      ORDER_SERVICE_URL=http://localhost:4002
      ALLOWED_ORIGINS=https://yourfrontend.com
      RATE_LIMIT_WINDOW=60000
      RATE_LIMIT_MAX=100
      ```
    - Edit the `config/routes.js` if you need more or different services.

3. **Start the gateway**
    ```
    npm start
    ```

4. **Use API**
    - Proxying `/api/users` and `/api/orders` to microservices requires `Authorization: Bearer <token>` in requests.

5. **Healthcheck**
    - Check `/healthz` for status.

## Testing

Run tests using [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest) to verify authentication, rate limiting, routing, logging, and CORS security.

1. Install test dependencies if needed:
    ```
    npm install --save-dev jest supertest
    ```

2. Run the test suite:
    ```
    npm test
    ```

3. Example test cases are found in `tests/` and include health check, JWT protection, rate limiting, and CORS validation.


## References

- [API Gateway Security Best Practices](https://www.practical-devsecops.com/api-gateway-security-best-practices/)
- [Tyk Open Source API Gateway](https://github.com/TykTechnologies/tyk)
- [API Gateway in Node.js Tutorial](https://blog.bitsrc.io/implementing-the-api-gateway-pattern-in-a-microservices-based-application-with-node-js-2cb39d174094)


> [!CAUTION]
> Change values as per your configuration and DO NOT push `.env` to production or any public repository.
