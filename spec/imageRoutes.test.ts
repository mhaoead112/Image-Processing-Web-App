import request from 'supertest';
import express from 'express';
import path from 'path';
import {imageRoutes} from '../src/backend/routes/imageRoutes';

const app = express();
app.use(express.json());
app.use('/api/images', imageRoutes);

const testPort = 5000; // Change to an available port
let server: any;

beforeAll((done) => {
  server = app.listen(testPort, () => {
    console.log(`Test server running on http://localhost:${testPort}`);
    done();
  });
});

afterAll(() => {
  if (server) {
    server.close();
  }
});

describe('Image Routes', () => {
  it('should upload an image', async () => {
    const response = await request(app)
      .post('/api/images/upload')
      .attach('image', path.join(__dirname, '../images/img1.jpg'));

    expect(response.status).toBe(200);
  });

  it('should return resized image', async () => {
    const response = await request(app)
      .get('/api/images/resize')
      .query({ filename: 'img1.jpg', width: 100, height: 100 });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/image\/jpeg/);
  });
});
