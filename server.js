const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const path = require("path");
const PORT = process.env.PORT || 5000;
const app = express();
app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require("mongodb").MongoClient;
const mongo = require("mongodb");
const client = new MongoClient(url);
client.connect(console.log("MongoDB connected"));

const emailer = require('./emailer');
const jwt = require('jsonwebtoken');

//const PORT = process.env.PORT || 5000;

// Accessing the path module
//const path = require("path");

// Step 1:
// app.use(express.static(path.resolve(__dirname, "./frontend/build")));
// // Step 2:
// app.get("*", function (request, response) {
//   response.sendFile(path.resolve(__dirname, "./frontend/build", "index.html"));
// });


if (process.env.NODE_ENV === 'production')
{
// Set static folder
app.use(express.static('frontend/build'));
app.get('/', (req, res) =>
{
res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});

app.get('/forgot', (req, res) =>
{
res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});

app.get('/reset-password/:token', (req, res) =>
{
res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});
}

app.post('/api/login', async (req, res, next) => 
{
  // incoming: email, password
  // outgoing: id, firstName, lastName, email, password, bar, error

  //alexslort@gmail.com
  //alex123

  var error = '';
  const { login, password } = req.body;
  const db = client.db("LargeProject");
  const results = await db.collection('users').find({email:login, password:password}).toArray();
  

  var id = -1;
  var fn = '';
  var ln = '';
  var em = '';
  var pass = '';
  var bar = '';
  var sd;
  var ec;

  if( results.length > 0 )
  {
    if(results[0].emailConfirmed == false)
    {
      var ret = {error: 'please confirm email'};
      res.status(200).json(ret);
      return;
    }

    id = results[0]._id
    fn = results[0].firstName
    ln = results[0].lastName;
    em = results[0].email;
    pass = results[0].password;
    bar = results[0].bar;
    sd = results[0].savedDrinks;
    ec = results[0].emailConfirmed;
    //fing = bar[0];
    //Iib = bar.length;

    var ret = { _id:id, firstName:fn, lastName:ln, bar:bar, savedDrinks:sd, emailConfirmed:ec, error:''};
    res.status(200).json(ret);

  }

  else{
    var ret = {error: 'no user found'};
    res.status(200).json(ret);
  }
});

app.post('/api/createUser', async (req, res, next) => 
{
  // incoming: firstName, lastName, email, password
  // outgoing: id, firstName, lastName, email, password, bar, error

  var error = '';
  const { firstName, lastName, email, password } = req.body;
  const db = client.db("LargeProject");
  //const results = await db.collection('users').insertOne({firstName:first, lastName:last, email:email, password:password, bar:''}).toArray();
  const search = await db.collection('users').find({email:email}).toArray();



  if( search.length > 0 )
  {
    var results = {error: 'user already exists'};
    res.status(200).json(results);
  }

  else{
    const results = await db.collection('users').insertOne({firstName:firstName, lastName:lastName, email:email, password:password, bar:[], savedDrinks:[], emailConfirmed:false});
    const ret = await db.collection('users').find({_id:results.insertedId}).toArray();
    //console.log(results.insertedId);
    emailer.confirmationEmail(ret[0]);
    res.status(200).json(ret[0]);
  }
});

app.get('/confirmation/:token', async (req, res, next) => 
{
  try{
    let userId = jwt.verify(req.params.token, process.env.SECRET_TOKEN).id;
    var o_id = new mongo.ObjectId(userId);
    console.log(o_id);
    console.log(req.params.token);
    //const update = db.collection('users').updateOne({_id:o_id}, {$set:{"emailConfirmed":true}}).toArray();
    const db = client.db("LargeProject");
    db.collection('users').updateOne({_id:o_id}, {$set:{"emailConfirmed":true}});
    //const ret = await db.collection('users').find({_id:o_id}).toArray();
   
    
    
  }
  catch(e)
  {
    res.send(e);
  }

  if (process.env.NODE_ENV === 'production')
  {
    res.redirect('https://obscure-springs-89188.herokuapp.com');
  }
  else
  {
    res.redirect('http://localhost:3000');
  }
});

app.post('/api/sendPasswordLink', async (req, res, next) =>{
  //incoming: user email
  const { email } = req.body;
  const db = client.db("LargeProject");
  const user = await db.collection('users').find({email:email}).toArray();
  console.log(email);

  if(!user.length)
  {
    var results = {error: 'user does not exist with that email'};
    res.status(200).json(results);
    
  }

  else
  {
    emailer.sendResetPassword(user[0]);
    var ret = {error:'email sent'};
    res.status(200).json(ret);
  }



});

app.post('/api/resetPassword', async (req, res, next) =>{
  //incoming: user email
  const { userid, newPassword } = req.body;
  //var o_id = new mongo.ObjectId(userid);
  try{
  var o_id = new mongo.ObjectId(userid);
  const db = client.db("LargeProject");
  const user = await db.collection('users').find({_id:o_id}).toArray();

  if(user.length > 0)
  {
    await db.collection('users').updateOne({_id:o_id},{$set:{password:newPassword}});
    const updatedUser = await db.collection('users').find({_id:o_id}).toArray();
    let ret = {id:updatedUser[0]._id,newPass:updatedUser[0].password};
    res.status(200).json(ret);
  }
  

  else
  {
    let results = {error: 'user not found'};
    res.status(200).json(results);
  }

  
  }
  catch(e)
  {
    let results = {error: 'user id not valid'};
    res.status(200).json(results);
    return;
  }

  

});

app.post('/api/searchIngredient', async (req, res, next) => 
{
  // incoming: userId, search
  // outgoing: results[], error
  var error = '';
  const { search } = req.body;
  var _search = search.trim();
  
  const db = client.db("LargeProject");
  const results = await db.collection('ingredients').find({"ingredient":{$regex:_search+'.*', $options:'i'}}).toArray();
  
  
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i]);
  }
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});

app.post('/api/getDrinks', async (req, res, next) => 
{
  // incoming: userId
  // outgoing: drink data
  var error = '';
  const { userId } = req.body;
  var o_id = new mongo.ObjectId(userId);
  //console.log(o_id);
  
  const db = client.db("LargeProject");
  const user = await db.collection('users').find({_id:o_id}).toArray();
  //let test = await User.findOne({_id:o_id});
  //console.log(test);
  
  
  if( user.length > 0 )
  {
    var bar = user[0].bar;
    //fing = bar[0];
    //Iib = bar.length;
    //const drinks = await db.collection('Drinks').find({}).toArray();
    //console.log(bar);
    var ret = [];
    const makeDrink = await db.collection('Drinks').find({ingNeeded: { $not: {$elemMatch: { $nin: bar}}}}).toArray();
    
    //console.log(makeDrink.length);

    for( var i=0; i<makeDrink.length; i++ )
    {
      //ingNeed = drinks[i].ingNeeded;
      //console.log(makeDrink[1]);
      ret.push(makeDrink[i]);
      //const makeDrink = db.collection('Drinks').find({tags: { $all: [bar] }});
    }
    //ingNeed = drinks[1].ingNeeded;
    var ree = {Drinks:ret};
    //console.log(ret[0]);

    
    res.status(200).json(ret);


  }
  else{
    var ret = {error: 'no user found'};
    res.status(200).json(ret);
  }
  
  
});

app.post('/api/searchDrink', async (req, res, next) => 
{
  // incoming: search
  // outgoing: results[], error
  var error = '';
  const { search } = req.body;
  var _search = search.trim();
  
  const db = client.db("LargeProject");
  const results = await db.collection('Drinks').find({"name":{$regex:_search+'.*', $options:'i'}}).toArray();
  
  
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i]);
  }
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});

app.get('/api/getIngredients', async (req, res, next) => 
{
  
  // outgoing: Ingredients
  
  const db = client.db("LargeProject");
  const results = await db.collection('ingredients').find({}).toArray();
  console.log("hit");
  
  
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i]);
  }
  
  res.status(200).json(_ret);
});

app.get('/api/getAllDrinks', async (req, res, next) => 
{
  
  // outgoing: Ingredients
  
  const db = client.db("LargeProject");
  const results = await db.collection('Drinks').find({}).toArray();
  
  
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i]);
  }
  
  res.status(200).json(_ret);
});

app.get('/api/getRandomDrink', async (req, res, next) => 
{
  
  // outgoing: Ingredients
  
  const db = client.db("LargeProject");
  const results = await db.collection('Drinks').aggregate([{$sample: {size: 4}}]).toArray();
  
  
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i]);
  }
  
  res.status(200).json(_ret);
});

app.post('/api/addIngredientToBar', async (req, res, next) => 
{
  // incoming: search
  // outgoing: results[], error
  var error = '';
  const { userId, ingName } = req.body;
  var o_id = new mongo.ObjectId(userId);
  
  const db = client.db("LargeProject");
  const user = await db.collection('users').find({_id: o_id}).toArray();

  if(user.length>0)
  {
    const result = await db.collection('ingredients').find({ingredient: ingName}).toArray();

    if(result.length>0)
    {
      const add = await db.collection('users').updateOne({_id:user[0]._id}, {$addToSet:{bar:ingName}});
      const updated = await db.collection('users').find({_id: o_id}).toArray();
      res.status(200).json(updated[0]);
    }
    else
    {
      var ret = {error: 'ingredient not found'};
      res.status(200).json(ret);
    
    }
  }
  else{
    var ret = {error: 'user not found'};
    res.status(200).json(ret);
  }
  
});

app.get('/', (req, res) => {
  res.send('hello world')
});

app.listen(PORT, () =>
{
console.log('Server listening on port ' + PORT);
}); // start Node + Express server on port 5000
