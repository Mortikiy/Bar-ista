const express = require('express');
require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require("mongodb").MongoClient;
const mongo = require("mongodb");
const client = new MongoClient(url);
const supertest = require('supertest');
var api = require('../api/api.js');
const app = express();
api.setApp( app, client );


// Test login
describe('POST /api/login', () => {
  it('should return a JWT token if the user exists and the password is correct', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        login: 'alexslort@gmail.com',
        password: 'Password123!',
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
        password: 'password123',
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('error', 'please confirm email');
  });
});

// Test createUser
describe('POST /api/createUser', () => {
  it('should create a new user and return a JWT token', async () => {
    const response = await request(app)
      .post('/api/createUser')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        bar: [],
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return an error if email is already registered', async () => {
    const response = await request(app)
      .post('/api/createUser')
      .send({
        firstName: 'Alex',
        lastName: 'Slort',
        email: 'alexslort@gmail.com',
        password: 'alex123',
        bar: [],
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('error');
  });

  it('should return an error if any required fields are missing', async () => {
    const response = await request(app)
      .post('/api/createUser')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        bar: [],
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('error');
  });
});

// Test confirmation
describe('GET /confirmation/:token', () => {
  it('should update user emailConfirmed field to true and redirect to homepage', async () => {
    // create a user and generate a token with a mock userId
    const user = {
      _id: new mongo.ObjectId(),
      email: 'testuser@example.com',
      password: 'testpassword',
      firstName: 'Test',
      lastName: 'User',
      emailConfirmed: false,
    };
    await db.collection('users').insertOne(user);
    const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN);

    // make a GET request to the confirmation endpoint with the token
    const response = await request(app).get(`/confirmation/${token}`);

    // check that the user's emailConfirmed field has been updated to true
    const updatedUser = await db.collection('users').findOne({ _id: user._id });
    expect(updatedUser.emailConfirmed).toBe(true);

    // check that the response status is a redirect to the homepage
    expect(response.status).toBe(302);
    expect(response.header.location).toBe('http://localhost:3000'); // or https://obscure-springs-89188.herokuapp.com in production
  });

  it('should return an error if the token is invalid', async () => {
    // make a GET request to the confirmation endpoint with an invalid token
    const response = await request(app).get('/confirmation/invalidtoken');

    // check that the response contains an error message
    expect(response.status).toBe(500);
    expect(response.text).toContain('JsonWebTokenError');
  });
});

// Test sendPasswordLink
describe('POST /api/sendPasswordLink', () => {
  it('should return an error if the user does not exist', async () => {
    const response = await request(app)
      .post('/api/sendPasswordLink')
      .send({
        email: 'nonexistentuser@example.com' // Change Email
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('error', 'user does not exist with that email');
  });

  it('should send an email if the user exists', async () => {
    const response = await request(app)
      .post('/api/sendPasswordLink')
      .send({
        email: 'existinguser@example.com' // Change Email
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('error', 'email sent');
    // You could also test that the email was actually sent here
  });
});

// Test resetPassword
describe('POST /api/resetPassword', () => {
  it('should update user password if user exists', async () => {
    // Create a new user with a known password
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'oldpassword',
      emailConfirmed: true,
    };
    const { insertedId } = await db.collection('users').insertOne(testUser);

    // Log in with the known password to get a JWT token
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    const { token } = loginResponse.body;

    // Call resetPassword with the new password and the JWT token
    const response = await request(app)
      .post('/api/resetPassword')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userid: insertedId.toHexString(),
        newPassword: 'newpassword',
      });

    // Check that the response has a 200 status code and contains the updated password
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(insertedId.toHexString());
    expect(response.body.newPass).toBe('newpassword');
  });

  it('should return an error if user does not exist', async () => {
    // Log in with a known password to get a JWT token
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password',
      });
    const { token } = loginResponse.body;

    // Call resetPassword with a nonexistent user ID and the JWT token
    const response = await request(app)
      .post('/api/resetPassword')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userid: '000000000000000000000000',
        newPassword: 'newpassword',
      });

    // Check that the response has a 200 status code and contains an error message
    expect(response.status).toBe(200);
    expect(response.body.error).toBe('user not found');
  });

  it('should return an error if user ID is not valid', async () => {
    // Log in with a known password to get a JWT token
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password',
      });
    const { token } = loginResponse.body;

    // Call resetPassword with an invalid user ID and the JWT token
    const response = await request(app)
      .post('/api/resetPassword')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userid: 'invalidid',
        newPassword: 'newpassword',
      });

    // Check that the response has a 200 status code and contains an error message
    expect(response.status).toBe(200);
    expect(response.body.error).toBe('user id not valid');
  });
});

// Test searchIngredient
describe('POST /api/searchIngredient', () => {
  it('should return results for valid search query', async () => {
    const searchQuery = '?'; // Something in DB
    const response = await request(app)
      .post('/api/searchIngredient')
      .send({ search: searchQuery });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('results');
    expect(response.body.results.length).toBeGreaterThan(0);
    expect(response.body.error).toBe('');
  });

  it('should return empty results for invalid search query', async () => {
    const searchQuery = 'invalidquery123';
    const response = await request(app)
      .post('/api/searchIngredient')
      .send({ search: searchQuery });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('results');
    expect(response.body.results.length).toBe(0);
    expect(response.body.error).toBe('');
  });
});

// Test getDrinks
describe('POST /api/getDrinks', () => {
  it('returns drinks that can be made by the user', async () => {
    // Assuming that a user exists in the 'users' collection with _id = '123'
    const userId = '123';
    const user = {
      _id: userId,
      bar: ['gin', 'tonic', 'lime']
    };
    await db.collection('users').insertOne(user);

    // Assuming that there are two drinks in the 'Drinks' collection
    const drink1 = {
      name: 'Gin and Tonic',
      ingNeeded: ['gin', 'tonic', 'lime']
    };
    const drink2 = {
      name: 'Whiskey Sour',
      ingNeeded: ['whiskey', 'lemon juice', 'sugar']
    };
    await db.collection('Drinks').insertMany([drink1, drink2]);

    const response = await request(app)
      .post('/api/getDrinks')
      .send({ userId })
      .expect(200);

    expect(response.body).toEqual({ Drinks: [drink1] });
  });

  it('returns an error if the user does not exist', async () => {
    // Assuming that no user with _id = '456' exists in the 'users' collection
    const userId = '456';

    const response = await request(app)
      .post('/api/getDrinks')
      .send({ userId })
      .expect(200);

    expect(response.body).toEqual({ error: 'no user found' });
  });
});

// Test getFavorites
describe('POST /api/getFavorites', () => {
  it('should return an error if the user is not found', async () => {
    const userId = 'non-existent-user-id'; // Change
    const response = await request(app)
      .post('/api/getFavorites')
      .send({ userId });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe('no user found');
  });

  it('should return a list of drinks for a valid user', async () => {
    // Add test data to the database
    const userId = 'valid-user-id'; // Change
    const savedDrinks = ['drink1', 'drink2'];
    await db.collection('users').insertOne({ _id: userId, savedDrinks });

    const response = await request(app)
      .post('/api/getFavorites')
      .send({ userId });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe('drink1');
    expect(response.body[1].name).toBe('drink2');

    // Clean up test data from the database
    await db.collection('users').deleteOne({ _id: userId });
  });
});

// Test searchDrink
describe('POST /api/searchDrink', () => {
  it('responds with results array and no error for valid search query', async () => {
    const res = await request(app)
      .post('/api/searchDrink')
      .send({ search: 'margarita' }); //Change?

    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.error).toBeFalsy();
  });

  it('responds with empty results array and no error for non-existent search query', async () => {
    const res = await request(app)
      .post('/api/searchDrink')
      .send({ search: 'nonexistent drink' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).toEqual(0);
    expect(res.body.error).toBeFalsy();
  });
});

// Test getIngredients
describe('GET /api/getIngredients', () => {
  it('should return an array of ingredients', async () => {
    const response = await supertest(app)
    .get('/api/getIngredients')


    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('_id');
    expect(response.body[0]).toHaveProperty('ingredient');
    expect(response.body[0]).toHaveProperty('type');
  });
});

// Test getAllDrinks
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

// Test getRandomDrink
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

// Test addIngredientToBar
describe('POST /api/addIngredientToBar', () => {
  it('returns the updated user object after adding an ingredient to their bar', async () => {
    // First, create a user in the database
    const user = { name: 'testuser', bar: [] };
    const result = await db.collection('users').insertOne(user);

    // Send a request to add an ingredient to the user's bar
    const response = await request(app)
      .post('/api/addIngredientToBar')
      .send({
        userId: result.insertedId.toString(),
        ingName: 'gin',
      });

    // Check that the response contains the updated user object with 'gin' added to their bar
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('testuser');
    expect(response.body.bar).toEqual(['gin']);

    // Clean up the test data
    await db.collection('users').deleteOne({ _id: result.insertedId });
  });

  it('returns an error if the user does not exist', async () => {
    const response = await request(app)
      .post('/api/addIngredientToBar')
      .send({
        userId: 'nonexistentuserid',
        ingName: 'gin',
      });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe('user not found');
  });

  it('returns an error if the ingredient does not exist', async () => {
    // First, create a user in the database
    const user = { name: 'testuser', bar: [] };
    const result = await db.collection('users').insertOne(user);

    // Send a request to add a nonexistent ingredient to the user's bar
    const response = await request(app)
      .post('/api/addIngredientToBar')
      .send({
        userId: result.insertedId.toString(),
        ingName: 'nonexistentingredient',
      });

    // Check that the response contains an error message
    expect(response.status).toBe(200);
    expect(response.body.error).toBe('ingredient not found');

    // Clean up the test data
    await db.collection('users').deleteOne({ _id: result.insertedId });
  });
});

// Test deleteIngredientInBar
describe('DELETE /api/deleteIngredientInBar', () => {
  it('should remove an ingredient from the user\'s bar', async () => {
    // Create a user and add an ingredient to their bar
    const user = { username: 'testuser', bar: ['vodka'] };
    const result = await db.collection('users').insertOne(user);
    const userId = result.insertedId.toString();

    // Make a request to delete the ingredient
    const res = await request(app)
      .delete('/api/deleteIngredientInBar')
      .send({ userId: userId, ingName: 'vodka' })
      .expect(200);

    // Ensure the ingredient was removed from the user's bar
    expect(res.body.bar).toEqual([]);
  });

  it('should return an error if the user is not found', async () => {
    // Make a request with an invalid user ID
    const res = await request(app)
      .delete('/api/deleteIngredientInBar')
      .send({ userId: '123', ingName: 'vodka' })
      .expect(200);

    // Ensure an error message is returned
    expect(res.body.error).toBe('user not found');
  });

  it('should return an error if the ingredient is not found', async () => {
    // Create a user without any ingredients in their bar
    const user = { username: 'testuser', bar: [] };
    const result = await db.collection('users').insertOne(user);
    const userId = result.insertedId.toString();

    // Make a request to delete a nonexistent ingredient
    const res = await request(app)
      .delete('/api/deleteIngredientInBar')
      .send({ userId: userId, ingName: 'vodka' })
      .expect(200);

    // Ensure an error message is returned
    expect(res.body.error).toBe('ingredient not found');
  });
});

// Test addFavorite
describe('POST /api/addFavorite', () => {
  it('should add a drink to the user\'s saved drinks', async () => {
    const userId = '123';
    const drinkName = 'Test Drink';

    // Make a POST request to the endpoint
    const response = await request(app)
      .post('/api/addFavorite')
      .send({ userId, name: drinkName });

    // Expect a 200 OK response
    expect(response.status).toBe(200);

    // Expect the response body to contain the updated user object
    expect(response.body).toHaveProperty('savedDrinks');
    expect(response.body.savedDrinks).toContain(drinkName);
  });

  it('should return an error if the user is not found', async () => {
    const userId = 'invalid-id';
    const drinkName = 'Test Drink';

    // Make a POST request to the endpoint
    const response = await request(app)
      .post('/api/addFavorite')
      .send({ userId, name: drinkName });

    // Expect a 200 OK response
    expect(response.status).toBe(200);

    // Expect the response body to contain an error message
    expect(response.body).toHaveProperty('error', 'user not found');
  });

  it('should return an error if the drink is not found', async () => {
    const userId = '123';
    const drinkName = 'Invalid Drink';

    // Make a POST request to the endpoint
    const response = await request(app)
      .post('/api/addFavorite')
      .send({ userId, name: drinkName });

    // Expect a 200 OK response
    expect(response.status).toBe(200);

    // Expect the response body to contain an error message
    expect(response.body).toHaveProperty('error', 'Drink not found');
  });
});

// Test deleteFavorite
describe('DELETE /api/deleteFavorite', () => {
  it('deletes a drink from the user\'s saved drinks list', async () => {
    // Create a mock user and add a drink to their saved drinks list
    const mockUser = { _id: '1234', savedDrinks: ['Margarita', 'Negroni'] };
    await request(app).post('/api/addUser').send(mockUser);

    // Send a request to delete a drink from the saved drinks list
    const res = await request(app)
      .delete('/api/deleteFavorite')
      .send({ userId: '1234', name: 'Margarita' });

    // Check that the drink was deleted and only one drink remains in the list
    expect(res.status).toBe(200);
    expect(res.body.savedDrinks).toHaveLength(1);
    expect(res.body.savedDrinks).not.toContain('Margarita');
    expect(res.body.savedDrinks).toContain('Negroni');
  });

  it('returns an error if user not found', async () => {
    const res = await request(app)
      .delete('/api/deleteFavorite')
      .send({ userId: '5678', name: 'Margarita' });

    expect(res.status).toBe(200);
    expect(res.body.error).toBe('user not found');
  });

  it('returns an error if drink not found', async () => {
    // Create a mock user with an empty saved drinks list
    const mockUser = { _id: '1234', savedDrinks: [] };
    await request(app).post('/api/addUser').send(mockUser);

    // Send a request to delete a non-existent drink from the saved drinks list
    const res = await request(app)
      .delete('/api/deleteFavorite')
      .send({ userId: '1234', name: 'Margarita' });

    expect(res.status).toBe(200);
    expect(res.body.error).toBe('Drink not found');
  });
});
