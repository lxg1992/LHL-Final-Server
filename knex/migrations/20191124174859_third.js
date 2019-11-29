

exports.up = function(knex) {
  return knex.schema
  .createTable('users', table => {
    table.increments('id').primary()
    table.string('first_name').notNull();
    table.string('last_name').nullable();
    table.string('email').nullable();
    table.string('password_hash').nullable();

  })
  
  .createTable('rooms', table => {
    table.increments('id').primary()    
    table
      .integer('host_id')
      .unsigned()
      .references('users.id')
    table.dateTime('datetime_start').notNull()
    table.dateTime('datetime_end').notNull()
    table.string('room_name').notNull()
    table.string('room_hash').notNull()
    table.boolean('is_active').notNull().defaultTo('false')
    table.json('tags_created') // = ['ruby','java']
  })
  
  
  .createTable('guests', table => {
    table.increments('id').primary()
    table
    .integer('room_id')
    .unsigned()
    .references('rooms.id')
    .notNull()
    .onDelete('CASCADE')
    table
    .integer('user_id')
    .unsigned()
    .references('users.id')
    .notNull()
    table.string('guest_hash').notNull()
    table.boolean('is_allowed').defaultTo('true')
  })
  
  .createTable('questions', table => {
    table.increments('id').primary()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table
      .integer('guest_id')
      .unsigned()
      .references('guests.id')
      .notNull()
      .onDelete('CASCADE')
    table
      .integer('room_id')
      .unsigned()
      .references('rooms.id')
      .notNull()
      .onDelete('CASCADE')
    table.text('query', 150)
    table.json('tags_selected')
  })
  
  
  .then((result) => {
    console.log('Finished creating tables')
  })
  .catch((e) => {
    console.error(e);
  })
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('questions')
    .dropTableIfExists('guests')
    .dropTableIfExists('rooms')
    .dropTableIfExists('users')
};
