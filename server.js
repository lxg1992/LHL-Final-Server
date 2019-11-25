const express = require('express');
const PORT = process.env.PORT || 3001;
const knex = require('./knex/db.js');
const bodyParser = require('body-parser');



const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//USER ROUTES
app.get('/', (req,res) => {
  res.send({error: 'No resource at this route'})
})
//Get all users
app.get('/users', async (req,res) => {
  try {
    let result = await knex('users')
    res.json(result);
  } catch (error) {
    console.error(error)
  }
})

//Create a new user
app.post('/users/register', async(req, res) => {
  try {
    let form = req.body
    let result = await knex('users').insert({first_name: form.first_name, last_name: form.last_name, email: form.email, password_hash: form.password}).returning('*')
    res.json(result)
  } catch (error) {
    console.error(error)
  }
})

//Login
app.post('/users/login', async(req,res) => {
  try {
    let form = req.body
    let result = await knex('users').where({'email': form.email, 'password_hash': form.password}).returning('*')
    if(!result.length){
      res.json({error: 'Unable to verify user'})
    } else {
      res.json(result)
    }
  } catch (error) {
    console.error(error)
  }
})

//Get specific user by id
// app.get('/users/:id', async (req, res) => {
//   try {
//     let id = req.params.id;
//     let result = await knex('users').where('id',id)
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//   }
// })

//get specific user by email
app.get('/users/:email', async(req,res) => {
  try {
    let email = req.params.email
    let result = await knex('users').where('email',email)
    if (result.length){
      res.json(result)
    } else {
      res.json({error:"No such email"})
    }
  } catch (error) {
    console.error(error)
  }
})


app.get('/users/:id/rooms', async(req,res) => {
  try {
  } catch (error) {
    
  }
})


//ROOMS

app.get('/rooms', async (req, res) => {
  let result = await knex('rooms')
  res.json(result)
})


//get all rooms by host_id

//get all questions by room hash
app.get('/rooms/:hash/questions', async (req, res) => {
  try {
    let hash = req.params.hash
    let result = await knex
      .select(['query','tags_selected'])
      .from('questions')
      .join('rooms', 'rooms.id', 'questions.room_id')
      .where('rooms.room_hash',hash)
    if(result.length){      
      res.json(result);
    } else {
      res.json('Either')
    }
  } catch (error) {
    console.error(error);
  }
})

//get all current guests for a room hash
app.get('/rooms/:hash/guests', async (req, res) => {
  try {
    let hash = req.params.hash;
    let result = await knex
    .select(['first_name', 'last_name', 'guests.guest_hash'])
    .from('users')
    .join('guests', 'guest_id', 'users.id')
    .join('rooms', 'room_id', 'rooms.id' )
    .where('rooms.room_hash', hash)
    if(result.length){
      res.json(result);
    } else {

    }
  } catch (error) {
    console.error(error);
  }
})


//Post a question into current rooms question DB
app.post('/rooms/:hash/questions', async (req, res) => {
  try {
    
  } catch (error) {
    
  }
})

//





//get specific question
app.get('/questions/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let result = await knex('questions').where('id',id)
    res.json(result);
    
  } catch (error) {
    console.error(error);
  }
})


app.post('/questions', async (req, res) => {
  let msgs = req.body.messages;
  let message = msgs.message;
  let tags = msgs.tags;  
  let result = await knex.insert({user_id: 1,query: message, tags_selected: JSON.stringify(tags)});
  res.json({result});  
})
//get all questions
app.get('/questions', async (req, res) => {
  try{
    let result = await knex('questions')
    res.json(result)
  } catch (error) {
    console.error(error)
  }
});


app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
}).on('error', err => {
  console.log('Error', err);
});