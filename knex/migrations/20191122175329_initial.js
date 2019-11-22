
exports.up = function(knex) {
  knex.schema
  .createTable('users', table => {
    table.increments('id').primary()
    table.string('first_name').notNull();
    table.string('last_name').nullable();
    table.string('email').nullable();
    table.string('password_hash').nullable();

  })
  .createTable('questions', table => {
    table.increments('id').primary()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table
      .integer('user_id')
      .unsigned()
      .references('users.id')

    table.text('query', 150)
    table.json('tags_selected')    
  })

  .createTable('rooms', table => {
    table.increments('id').primary()
    table.dateTime('datetime_start').notNull()
    table.dateTime('datetime_end').notNull()
    table.string('room_name').notNull()
    table.string('room_hash').notNull()
    table.boolean('is_active').notNull().defaultTo('false')
  })
  

  
  
  .then(() => {
    console.log('KNEX: Created users and questions tables')
  })
  .catch((e) => {
      console.error(e);
  })
};

exports.down = function(knex) {
  knex.schema
  .dropTableIfExists('users')
  .dropTableIfExists('questions')
  .dropTableIfExists('rooms')
};
