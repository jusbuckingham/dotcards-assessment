// test/app.test.ts
import assert from 'assert';
import request from 'supertest';
import app from '../src/app';

describe('Database Proxy API', () => {
  it('should create a new item', async () => {
    const newItem = { name: 'John Doe', age: 30 };
    const response = await request(app).post('/users').send(newItem);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.name, newItem.name);
    assert.strictEqual(response.body.age, newItem.age);
  });

  it('should read an item by id', async () => {
    const newItem = { name: 'John Doe', age: 30 };
    const postResponse = await request(app).post('/users').send(newItem);
    const id = postResponse.body.id;

    const response = await request(app).get(`/users/${id}`);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.name, newItem.name);
    assert.strictEqual(response.body.age, newItem.age);
  });

  it('should update an item', async () => {
    const newItem = { name: 'John Doe', age: 30 };
    const postResponse = await request(app).post('/users').send(newItem);
    const id = postResponse.body.id;

    const updateData = { name: 'Updated John Doe', age: 35 };
    const response = await request(app).post(`/users/${id}`).send(updateData);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.name, updateData.name);
    assert.strictEqual(response.body.age, updateData.age);
  });

  it('should delete an item', async () => {
    const newItem = { name: 'John Doe', age: 30 };
    const postResponse = await request(app).post('/users').send(newItem);
    const id = postResponse.body.id;

    const deleteResponse = await request(app).delete(`/users/${id}`);
    assert.strictEqual(deleteResponse.status, 204);

    const getResponse = await request(app).get(`/users/${id}`);
    assert.strictEqual(getResponse.status, 404);
    assert.strictEqual(getResponse.body.error, 'Item not found');
  });
});
