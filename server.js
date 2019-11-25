const express = require('express');
const PORT = process.env.PORT || 3001;
const knex = require('./knex/db.js');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

//get all users
app.get('/users', async (req,res) => {
  let result = await knex('users');
  res.json(result);
})


app.get('/questions', async (req, res) => {
    let result = await knex('questions')
    res.json(result);
});

app.get('/questions/:id', async (req, res) => {
  let id = req.params.id;
  let result = await knex('questions').where('id',id)
  res.json(result);
})

app.get('/rooms', async (req, res) => {
  let result = await knex('rooms')
  res.json({result})
})

app.post('/questions', async (req, res) => {
   let msgs = req.body.messages;
    let message = msgs.message;
    let tags = msgs.tags;

    let result = await knex.insert({user_id: 1,query: message, tags_selected: JSON.stringify(tags)});
    res.json({result});

})


app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
}).on('error', err => {
  console.log('Error', err);
});