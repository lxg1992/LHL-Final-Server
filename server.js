const morganBody = require('morgan-body')
const express = require('express');
const PORT = process.env.PORT || 3001;
const knex = require('./knex/db.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config');
const jwt = require('jsonwebtoken');

const { auth } = require('./middleware/auth')
const { generateRandomString } = require('./helpers/generateRandomString')
const { hashPassword, checkPassword } = require('./helpers/hashHelp')
const { getTotalQuestionsCount, getTotalGuestsCount, getIndividualTagsCount, getTotalTagsCount, getTotalQuestionsByGuestId, getQuestionsInvolvingTags } = require('./helpers/analysisHelp')

const app = express()
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
morganBody(app, {
  theme: 'darkened'
});


//Test route
app.get('/', (req, res) => {
  res.send({ message: 'No resource at this route, try /users, /rooms, /guests, /questions' })
})

//USER ROUTES
//Get all users
app.get('/users', async (req, res) => {
  try {
    let result = await knex('users')
    res.json(result);
  } catch (error) {
    console.error(error)
  }
})


//Create a new user
app.post('/users/register', async (req, res) => {
  try {
    let { first_name, last_name, email, password } = req.body

    if (!first_name || !last_name || !email || !password) {
      res.status(400).send({ error: 'Please enter all fields' })
    } else {

      let emailCheck = await knex('users').where('email', email)
      if (emailCheck.length) {
        res.status(400).json({ error: "Email already registered" })
      } else {
        let password_hash = await hashPassword(password)
        let user = await knex('users').insert(
          {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password_hash: password_hash
          })
          .returning('*')

        jwt.sign(
          { id: user[0].id },
          config.get('jwtSecret'),
          (err, token) => {
            if (err) throw err;
            res.json({ user, token })
          }
        )
      }
    }
  } catch (error) {
    console.error(error)
  }
})

//Login a user
app.post('/users/login', async (req, res) => {
  try {
    let { email, password } = req.body
    let queryEmail = await knex('users')
      .where({ 'email': email })
      .returning('email')
    if (!queryEmail.length) {
      res.status(403).json({ error: 'Unable to find user' })
    } else {
      let user = await knex.select('*').from('users')
        .where('email', email)
        .returning('*')
      let checkConfirmed = await checkPassword(password, user[0].password_hash)
      if (checkConfirmed) {
        jwt.sign(
          { id: user[0].id },
          config.get('jwtSecret'),
          (err, token) => {
            if (err) throw err;
            res.json({ user, token })
          }
        )
      } else {
        res.status(403).json({ error: "Wrong password" })
      }
    }
  } catch (error) {
    console.error(error)
  }
})




app.get('/users/hash/:hash', async (req, res) => {
  try {
    let hash = req.params.hash
    let result = await knex
      .select(['first_name', 'last_name', 'email', 'guests.guest_hash'])
      .from('users')
      .join('guests', 'user_id', 'users.id')
      .where('guests', hash)
    if (result.length) {
      res.json(result);
    } else {
      res.status(400).json({ error: "This is not a guest hash belonging to any guests" })
    }
  } catch (error) {
    console.error(error)
  }
})

//Get all rooms where userID is the host
app.get('/users/:id/rooms/all', async (req, res) => {
  try {
    let host_id = req.params.id
    let result = await knex('rooms')
      .where('host_id', host_id)
    if (result.length) {
      res.json(result)
    } else {
      res.status(400).json({ error: 'Either this user is not a host to any rooms, or no such user id exists' })
    }
  } catch (error) {
    console.error(error)
  }
})

app.get('/users/:id/rooms/past', async (req, res) => {
  try {
    let host_id = req.params.id
    let result = await knex('rooms')
      .where({ 'host_id': host_id })
      .andWhere('datetime_end', '<', knex.fn.now())
      .orderBy('datetime_start', 'desc')

    res.json(result)
  } catch (error) {
    console.error(error)
  }
})

app.get('/users/:id/rooms/current', async (req, res) => {
  try {
    let host_id = req.params.id
    let result = await knex('rooms')
      .where({ 'host_id': host_id })
      .andWhere('datetime_end', '>', knex.fn.now())
      .andWhere('datetime_start', '<', knex.fn.now())
      .orderBy('datetime_start', 'desc')
    res.json(result)
  } catch (error) {
    console.error(error)
  }
})

app.get('/users/:id/rooms/future', async (req, res) => {
  try {
    let host_id = req.params.id
    let result = await knex('rooms')
      .where({ 'host_id': host_id })
      .andWhere('datetime_start', '>', knex.fn.now())
      .orderBy('datetime_start', 'desc')
    res.json(result)
  } catch (error) {
    console.error(error)
  }
})


//ROOMS

//get all rooms
app.get('/rooms', async (req, res) => {
  try {
    let result = await knex('rooms')
    res.json(result)
  } catch (error) {
    console.error(error)
  }
})

app.get('/rooms/:hash', async (req, res) => {
  try {
    let hash = req.params.hash
    let result = await knex('rooms')
      .where('room_hash', hash)
    if (result.length) {
      console.log(`Room ${hash}exists`);
      res.json(result);
    }
  } catch (error) {
    console.error(error)
  }
})



//CREATE A ROOM
app.post('/rooms', async (req, res) => {
  try {
    let { host_id, datetime_start, datetime_end, room_name, allow_anonymous} = req.body

    if (!host_id){
      res.json({error: 'No host id'})
      return
    }

    if (!datetime_start){
      res.json({error: 'No datetime start'})
      return
    }

    if (!datetime_end){
      res.json({error: 'No datetime '})
      return
    }

    if(!room_name){
      res.json({error: 'No room name'})
      return
    }

    let tags_created = req.body.topics
    let room_hash = generateRandomString(5);
    let room_hash_check = await knex('rooms').where('room_hash', room_hash)
    //Round 1 of checks
    if (room_hash_check.length) {
      room_hash = generateRandomString(5);
      room_hash_check = await knex('rooms').where('room_hash', room_hash)
    }
    //Round 2 of checks
    if (room_hash_check.length) {
      room_hash = generateRandomString(5);
      room_hash_check = await knex('rooms').where('room_hash', room_hash)
    }
    let result = await knex('rooms')
      .insert({ host_id: host_id, datetime_start: datetime_start, datetime_end: datetime_end, room_name: room_name, room_hash: room_hash, tags_created: JSON.stringify(tags_created), allow_anonymous:allow_anonymous})
      .returning('*')
    if (result.length) {
      res.json(result);
    } else {
      res.json({ error: "Unable to insert room" })
    }
  } catch (error) {
    console.error(error)
  }
})



//get all questions by room hash
app.get('/rooms/:hash/questions', async (req, res) => {
  try {
    let hash = req.params.hash
    let room_id_obj = await knex.select('*')
      .from('rooms')
      .where('rooms.room_hash', hash)

    let room_id = room_id_obj[0].id
    console.log(room_id);
    console.log('========ROOM ID:', room_id, '=======')
    let result = await knex.raw('select guests.*, questions.* from questions, guests where guests.id = questions.guest_id and questions.room_id = ? and guests.room_id = ? and guests.is_allowed = true ORDER BY questions.created_at DESC ', [room_id, room_id])


    //console.log('RESULT IS: ', result.rows)
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
  try {
    let hash = req.params.hash;
    let result = await knex
      .select(['first_name', 'last_name', 'guests.*'])
      .from('users')
      .join('guests', 'user_id', 'users.id')
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



app.patch('/rooms/activate', async (req, res) => {
  try {
    let { room_id, host_id } = req.body

    let checkActive = await knex('rooms')
      .where('id',room_id)
      .andWhere('host_id', host_id)
      .andWhere('is_active', true)
    
    if(checkActive.length){
      res.json(checkActive)
      return 
    }

    let result = await knex('rooms')
      .where('id', room_id)
      .andWhere('host_id', host_id)
      .update({ is_active: true, datetime_start: knex.fn.now() })
      .returning('*')

    if (result.length) {
      res.json(result)
      return
    } else {
      res.status(403).json({ error: 'Could not activate' })
      return
    }
  } catch (error) {
    console.error(error)
  }
})

app.patch('/rooms/finish', async (req, res) => {
  try {
    let { room_id, host_id } = req.body

    let result = await knex('rooms')
      .where('id', room_id)
      .andWhere('host_id', host_id)
      .update({ is_active: false, datetime_end: knex.fn.now() })
      .returning('*')

    if (result.length) {
      res.json(result)
    } else {
      res.status(403).json({ error: 'Could not finish room session' })
    }
  } catch (error) {
    console.error(error)
  }
})

app.post('/rooms/join', async (req, res) => {


  let { user_id, room_hash } = req.body
  let result1 = await knex('rooms')
    .where({ room_hash: room_hash, is_active: true })
  if (!result1.length) {
    res.status(403).json({ error: 'No such room or room is not active' })
    return
  }

  let room_id = result1[0].id


  console.log('HOSTID:', result1[0].host_id)// = user_id 
  let result2 = await knex('rooms')
    .where({ room_hash: room_hash, host_id: user_id })

  if (result2.length) {
    res.status(403).json({ error: 'Cannot join your own room' })
    return
  }

  let result3 = await knex('guests')
    .where({ user_id: user_id, room_id: room_id })

  if (result3.length) {
    let allowedGuest = await knex('guests')
      .where({ user_id: user_id, room_id: room_id, is_allowed: true })

    if (allowedGuest.length) {
      res.json(allowedGuest)
      return
    } else {
      res.status(403).json({ error: 'This user is not allowed in this room' })
      return
    }
  } else {
    let newGuest = await knex('guests')
      .insert({ user_id: user_id, room_id: room_id, guest_hash: generateRandomString(3), is_allowed: true })
      .returning('*')

    res.json(newGuest)
    return
  }
})

app.post('/rooms/join/anonymous', async (req, res) => {


  let { room_hash } = req.body
  let result1 = await knex('rooms')
    .where({ room_hash: room_hash, is_active: true, allow_anonymous: true })
  if (!result1.length) {
    res.status(403).json({ error: 'No such room or room is not active or does not allow anonymous users' })
    return
  }

  let room_id = result1[0].id

  let result3 = await knex('guests')
    .where({ user_id: 0, room_id: room_id })

  if (result3.length) {
    let allowedGuest = await knex('guests')
      .where({ user_id: 0, room_id: room_id, is_allowed: true })

    if (allowedGuest.length) {
      res.json(allowedGuest)
      return
    } else {
      res.status(403).json({ error: 'This user is not allowed in this room' })
      return
    }
  } else {
    let newGuest = await knex('guests')
      .insert({ user_id: 0, room_id: room_id, guest_hash: 'anon', is_allowed: true })
      .returning('*')

    res.json(newGuest)
    return
  }
})



//Post a question into current rooms question 
app.post('/rooms/:hash/questions', async (req, res) => {
  try {

    let hash = req.params.hash
    let query = req.body.message
    let tags_selected = req.body.tags
    let guest_id = req.body.guest_id

    if (!hash) {
      res.status(403).json({ error: 'No hash!' })
      return
    }

    if(!query){
      res.status(403).json({error: 'No input detected'})
      return
    }

    let room_id_obj = await knex.select('rooms.id')
      .from('rooms')
      .where('rooms.room_hash', hash)

    let room_id = room_id_obj[0].id

    let guest_check = await knex('guests')
      .where('room_id', room_id)
      .andWhere('id', guest_id)

    if(!guest_check[0].is_allowed){
      res.status(403).json('Banned user');
      return
    }

    let result = await knex('questions')
      .insert({ guest_id: guest_id, room_id: room_id, query: query, tags_selected: JSON.stringify(tags_selected) })

    res.json(result);
  } catch (error) {
    console.error(error);
  }
})


//DELETE A ROOM
app.delete('/rooms/delete', async (req, res) => {
  try {
    let room_id = req.body.room_id
    let host_id = req.body.host_id

    console.log(room_id)
    console.log(host_id)

    let result = await knex('rooms')
      .where('rooms.id', room_id)
      .andWhere('rooms.host_id', host_id)
      .returning('*')
      .del()

    if (result.length) {
      console.log(result[0])
      res.json({ success: `Room hash ${result[0].room_hash} deleted` })
    } else {
      res.json({ error: `Could not delete room` })
    }

  } catch (error) {
    console.error(error);
  }
})

//get all questions
app.get('/questions', async (req, res) => {
  try {
    let result = await knex('questions')
    res.json(result)
  } catch (error) {
    console.error(error)
  }
});

//get specific question
app.get('/questions/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let result = await knex('questions').where('id', id)
    res.json(result);
  } catch (error) {
    console.error(error);
  }
})

app.get('/guests', async (req, res) => {
  try {
    let result = await knex('guests')
    res.json(result);
  } catch (error) {
    console.error(error);
  }
})


app.patch('/guests/ban', async (req, res) => {
  try {
    let { guest_id } = req.body

    let result = await knex
      .select('*')
      .from('guests')
      .where({id: guest_id})
      .update({is_allowed: false})
      .returning('*')
    
    if (result.length){
      res.json(result)
      return
    } else {
      res.status(403).json({error: `Unable to ban guest ${result[0].guest_hash} from room `})
      return
    }
  } catch (error) {
    console.error(error);
  }
})

app.get('/error', async (req, res) => {
  res.json({error:'Error test'})
})

app.get('/questions/:id/analysis', async (req, res) => {
  try {
    let room_id = req.params.id
    let guests = await knex.select('*')
      .from('guests')
      .where('guests.room_id', room_id)
    if(!guests.length){
      res.status(403).json({error: 'No guests were in this room'})
      return
    }

    let questions = await knex.select('*')
      .from('questions')
      .where('room_id', room_id)
    //console.log('RESULT IS: ', result.rows)
    if (!questions.length) {
      res.status(204).json({ error: 'This room has no questions' })
      return
    }

    res.json({
      getTotalQuestionsByGuestId:getTotalQuestionsByGuestId(questions),
      getIndividualTagsCount:getIndividualTagsCount(questions),
      getQuestionsInvolvingTags:getQuestionsInvolvingTags(questions),
      getTotalGuestsCount:getTotalGuestsCount(guests),      
      getTotalQuestionsCount:getTotalQuestionsCount(questions),
      getTotalTagsCount:getTotalTagsCount(questions)
    })

    return

  } catch (error) {
    console.error(error);
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
}).on('error', err => {
  console.log('Error', err);
});