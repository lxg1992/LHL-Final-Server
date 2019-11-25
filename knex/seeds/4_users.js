
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {first_name: 'First', last_name: 'Last', email: 'fl@email.com', password_hash: 'fl'},
        {first_name: 'Alex', last_name: 'Garin', email: 'ag@email.com', password_hash: 'ag'},
        {first_name: 'mahFirst', last_name :'mahLast', email: 'mm@email.com', password_hash: 'mm' },
        {first_name: 'John', last_name:'Malone', email: 'jm@email.com', password_hash:'jm'},
        {first_name: 'John', last_name:'Galone', email: 'jg@email.com', password_hash:'jg'},
        {first_name: 'John', last_name:'Balone', email: 'jb@email.com', password_hash:'jb'}


      ]);
    });
};

/*
  INSERT INTO users (first_name, last_name, email, password_hash) VALUES
    ('fmame', 'lnamee', 'emailll', 'assssword');

*/