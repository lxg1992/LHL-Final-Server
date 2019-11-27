const express = require('express');
const PORT = process.env.PORT || 3001;
const knex = require('./knex/db.js');
const bodyParser = require('body-parser');
const cors = require('cors');

const { generateRandomString } = require('./helpers/helpers')

const app = express()
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Test route
app.get('/', (req, res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())

  res.send({ message: 'No resource at this route, try /users, /rooms, /guests, /questions' })
})

//USER ROUTES
//Get all users
app.get('/users', async (req, res) => {
  console.log('METHOD: ',req.method,', ROUTE: ', req.originalUrl)
  try {
    let result = await knex('users')
    res.json(result);
  } catch (error) {
    console.error(error)
  }
})

//Create a new user
app.post('/users/register', async (req, res) => {
  console.log('METHOD: ',req.method,', ROUTE: ', req.originalUrl)
  try {
    let form = req.body
    let result = await knex('users').insert({ first_name: form.first_name, last_name: form.last_name, email: form.email, password_hash: form.password }).returning('*')
    res.json(result)
  } catch (error) {
    console.error(error)
  }
})

//Login a user
app.post('/users/login', async (req, res) => {
  console.log('METHOD: ',req.method,', ROUTE: ', req.originalUrl)
  try {

    let form = req.body
    let result = await knex('users').where({ 'email': form.email, 'password_hash': form.password }).returning('*')
    if (!result.length) {
      res.json({ error: 'Unable to verify user' })
    } else {
      res.json(result)
    }
  } catch (error) {
    console.error(error)
  }
})


//Get a user by email
app.get('/users/:email', async (req, res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())

  try {
    let email = req.params.email
    let result = await knex('users').where('email', email)
    if (result.length) {
      res.json(result)
    } else {
      res.json({ error: "No such email" })
    }
  } catch (error) {
    console.error(error)
  }
})

//Get all rooms where userID is the host
app.get('/users/:id/rooms/all', async (req, res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())

  try {
    let host_id = req.params.id
    let result = await knex('rooms')
      .where('host_id', host_id)
    if (result.length) {
      res.json(result)
    } else {
      res.json({ error: 'Either this user is not a host to any rooms, or no such user id exists' })
    }
  } catch (error) {
    console.error(error)
  }
})

app.get('/users/:id/rooms/past', async(req, res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())

  try {
    let host_id = req.params.id
    let result = await knex('rooms')
      .where({'host_id':host_id})
      .andWhere('datetime_end', '<', knex.fn.now())
    res.json(result)
  } catch (error) {
    console.error(error)
  }
})

app.get('/users/:id/rooms/current', async(req,res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())

  try {
    let host_id = req.params.id
    let result = await knex('rooms')
      .where({'host_id':host_id})
      .andWhere('datetime_end', '>', knex.fn.now())
      .andWhere('datetime_start','<', knex.fn.now())
    res.json(result)
  } catch (error) {
    console.error(error)
  }
})

app.get('/users/:id/rooms/future', async(req, res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())

  try {
    let host_id = req.params.id
    let result = await knex('rooms')
      .where({'host_id':host_id})
      .andWhere('datetime_start','>', knex.fn.now())
    res.json(result)
  } catch (error) {
    console.error(error)
  }
})


//ROOMS

//get all rooms
app.get('/rooms', async (req, res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())

  try {
    let result = await knex('rooms')
    res.json(result)
  } catch (error) {
    console.error(error)
  }
})

app.get('/rooms/:hash', (req, res) => {
  
})

app.post('/rooms', async (req, res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())

  try {
    let host_id = req.body.host_id
    let datetime_start = req.body.datetime_start
    let datetime_end = req.body.datetime_end
    let room_name = req.body.room_name
    let room_hash = generateRandomString(5);
    let tags_created = req.body.topics

    let result = await knex('rooms')
      .insert({host_id: host_id, datetime_start: datetime_start, datetime_end: datetime_end, room_name: room_name, room_hash: room_hash, tags_created: JSON.stringify(tags_created) })
      .returning('*')
    
    if(result.length){
      res.json(result);
    } else {
      res.json({error: "Unable to insert room"})
    }




  } catch (error) {
    console.error(error)
  }
})


//get all questions by room hash
app.get('/rooms/:hash/questions', async (req, res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())
  try {

    let hash = req.params.hash

    let room_id_obj = await knex.select('rooms.id')
      .from('rooms')
      .where('rooms.room_hash', hash)

    let room_id = room_id_obj[0].id


    console.log('========ROOM ID:',room_id,'=======')


      
    let result = await knex.raw('select guests.guest_hash, questions.* from questions, guests where guests.id = questions.user_id and questions.room_id = ? ORDER BY questions.created_at ASC ',[room_id])


    console.log('RESULT IS: ', result.rows)

  if (result.rows.length) {
    res.json(result.rows);
  } else {
    res.status(204).json({ error: 'Either wrong hash or this room has no questions' })      
  }

  } catch (error) {
    console.error(error);
  }
})

//Get tags_created for a room
app.get('/rooms/:hash/tags', async (req, res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())
  try {

    let hash = req.params.hash
    let result = await knex
      .select(['rooms.tags_created'])
      .from('rooms')
      .where('rooms.room_hash', hash)
    if (result.length) {
      res.json(result);
    } else {
      res.json({ error: 'Either wrong hash or this room has no questions' })
    }
  } catch (error) {
    console.error(error);
  }
})

//get all current guests for a room hash
app.get('/rooms/:hash/guests', async (req, res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())

  try {
    let hash = req.params.hash;
    let result = await knex
      .select(['first_name', 'last_name', 'guests.guest_hash'])
      .from('users')
      .join('guests', 'guest_id', 'users.id')
      .join('rooms', 'room_id', 'rooms.id')
      .where('rooms.room_hash', hash)
    if (result.length) {
      res.json(result);
    } else {
      res.json({ error: "Either this room does not exist or there are no guests here" })
    }
  } catch (error) {
    console.error(error);
  }
})


//Post a question into current rooms question 
app.post('/rooms/:hash/questions', async (req, res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())
  try {

    let hash = req.params.hash
    let query = req.body.message
    let tags_selected = req.body.tags
    let user_id = req.body.user_id

    console.log(`/rooms/${hash}/questions has been hit with:`)
    console.log("hash, query, tags_selected, user_id")
    console.log("===================================")
    console.log(hash, query, tags_selected, user_id)
    console.log("===================================")

    let room_id_obj = await knex.select('rooms.id')
      .from('rooms')
      .where('rooms.room_hash', hash)

    let room_id = room_id_obj[0].id


    console.log('========ROOM ID:',room_id,'=======')

    //res.json(room_id)


    let result = await knex('questions')
      .insert({ user_id: user_id, room_id: room_id, query: query, tags_selected: JSON.stringify(tags_selected) })
      

    res.json(result);
  } catch (error) {
    console.error(error);
  }
})


//get all questions
app.get('/questions', async (req, res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())

  try {
    let result = await knex('questions')
    res.json(result)
  } catch (error) {
    console.error(error)
  }
});

//get specific question
app.get('/questions/:room_id', async (req, res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())

  try {
    let id = req.params.id;
    let result = await knex('questions').where('id', id)
    res.json(result);
  } catch (error) {
    console.error(error);
  }
})



app.get('/guests', async (req, res) => {
  console.log('METHOD:',req.method,'; ROUTE:', req.originalUrl, '; TIME:',new Date().toLocaleTimeString())

  try {
    let result = await knex('guests')
    res.json(result);
  } catch (error) {
    console.error(error);
  }
})




app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
}).on('error', err => {
  console.log('Error', err);
});