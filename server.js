const express = require('express');
const PORT = process.env.PORT || 3001;
const knex = require('./knex/knex.js');
const app = express();

app.get('/tasks', (req, res) => {

});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
}).on('error', err => {
  console.log('Error', err);
});