import request from 'supertest';
import { app } from './app';

describe('CRUD API Tests', () => {
  let itemId: string;

  it('should create a new item', async () => {
    const response = await request(app)
      .post('/items')
      .send({ name: 'Test Item' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    itemId = response.body.id;
  });

  it('should retrieve the created item', async () => {
    const response = await request(app).get(`/items/${itemId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', itemId);
  });

  it('should update the created item', async () => {
    const response = await request(app)
      .post(`/items/${itemId}`)
      .send({ name: 'Updated Item' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', itemId);
    expect(response.body).toHaveProperty('name', 'Updated Item');
  });

  it('should delete the created item', async () => {
    const response = await request(app).delete(`/items/${itemId}`);

    expect(response.status).toBe(204);

    const getResponse = await request(app).get(`/items/${itemId}`);
    expect(getResponse.status).toBe(404);
  });
});
