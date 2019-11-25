
exports.seed = function(knex) {
  return knex('questions').del()
    .then(function () {
      return knex('guests').del()
      .then(function () {
        return knex('rooms').del()
        .then(function() {
          return knex('users').del()
        })
      });
    });
};
