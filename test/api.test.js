const express = require('express');
require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require("mongodb").MongoClient;
const mongo = require("mongodb");
const client = new MongoClient(url);
const request = require('supertest');
var api = require('../api/api.js');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
api.setApp( app, client );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.use(express.json());

describe('GET /api/getIngredients', () => {
  it('should return an array of ingredients', async () => {
    const response = await request(app)
    .get('/api/getIngredients')


    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('_id');
    expect(response.body[0]).toHaveProperty('ingredient');
    expect(response.body[0]).toHaveProperty('type');
  });
});

describe('GET /api/getAllDrinks', () => {
  it('should respond with status 200', async () => {
    const response = await request(app)
    .get('/api/getAllDrinks');

    expect(response.status).toBe(200);
  });

  it('should respond with an array of drinks', async () => {
    const response = await request(app)
    .get('/api/getAllDrinks');

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should respond with at least one drink', async () => {
    const response = await request(app)
    .get('/api/getAllDrinks');

    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/getRandomDrink', () => {
  it('responds with JSON containing an array of 4 drink objects', async () => {
    const response = await request(app)
      .get('/api/getRandomDrink')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(4);
    response.body.forEach(drink => {
      expect(drink).toHaveProperty('_id');
      expect(drink).toHaveProperty('img');
      expect(drink).toHaveProperty('ingMeasurments');
      expect(drink).toHaveProperty('ingNeeded');
      expect(drink).toHaveProperty('instructions');
      expect(drink).toHaveProperty('name');
    });
  });
});

describe.only('POST /api/login', () => {
  it('should return a JWT token if the user exists and the password is correct', async () => {
    const response = await request(app)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send({
        login: 'alexslort@gmail.com',
        password: 'Password123!'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return an error message if the user does not exist', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        login: 'nonexistentuser@gmail.com',
        password: 'password123',
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('error', 'no user found');
  });

  it('should return an error message if the user has not confirmed their email', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        login: 'unconfirmeduser@gmail.com',
        password: 'password123'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('error', 'please confirm email');
  });
});