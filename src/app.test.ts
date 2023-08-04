// app.test.ts
import request from 'supertest'; // Install 'supertest' to make HTTP requests in tests
import app from './app';

// Sample test data
const testItem = {
  name: 'Test Item',
  description: 'This is a test item',
};

describe('API Endpoints', () => {
  it('should create a new item', async () => {
    const response = await request(app).post('/items').send(testItem);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ...testItem, id: expect.any(String) });
  });

  it('should get an existing item', async () => {
    const createResponse = await request(app).post('/items').send(testItem);
    const getItemResponse = await request(app).get(`/items/${createResponse.body.id}`);
    expect(getItemResponse.status).toBe(200);
    expect(getItemResponse.body).toMatchObject(createResponse.body);
  });

  it('should update an existing item', async () => {
    const createResponse = await request(app).post('/items').send(testItem);
    const updatedItem = { ...createResponse.body, name: 'Updated Item' };
    const updateResponse = await request(app)
      .post(`/items/${createResponse.body.id}`)
      .send(updatedItem);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toMatchObject(updatedItem);
  });

  it('should delete an existing item', async () => {
    const createResponse = await request(app).post('/items').send(testItem);
    const deleteResponse = await request(app).delete(`/items/${createResponse.body.id}`);
    expect(deleteResponse.status).toBe(204);
  });

  it('should return 404 for non-existing item', async () => {
    const response = await request(app).get('/items/non-existing-id');
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ error: 'Item not found' });
  });
});