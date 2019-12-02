
exports.up = function(knex) {
  return knex.schema
    .alterTable('rooms', table => {
      table.boolean('allow_anonymous').defaultTo('false').notNull()
    })

    .alterTable('users', table => [
      table.boolean('is_anonymous').defaultTo('false').notNull()

    ])
    .then((result) => {
      console.log('Added columns')
    })
    .catch((error) => {
      console.error(error)
    })
};

exports.down = function(knex) {
  return knex.schema
    .alterTable('rooms', table => {
      table.dropColumn('allow_anonymous')
    })
    .alterTable('users', table => {
      table.dropColumn('is_anonymous')
    })
    .then((result) => {
      console.log('Dropped columns')
    })
    .catch( err => {
      console.error(err);
    })
};
