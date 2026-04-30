import request from 'supertest';
import app from '#src/app.js';

const api = request(app);
const withUA = req => req.set('User-Agent', 'jest-test');

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await withUA(api.get('/health'));

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api', () => {
    it('should return API message', async () => {
      const response = await withUA(api.get('/api'));

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Docker Acquisitions API is running..'
      );
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await withUA(api.get('/nonexsistent'));

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});
