
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('guests').del()
    .then(function () {
      // Inserts seed entries
      return knex('guests').insert([
        {room_id: 1, guest_id: 2, guest_hash: 'jel'},
        {room_id: 1, guest_id: 3, guest_hash: 'jok'},

        {room_id: 3, guest_id: 2, guest_hash: 'kek'},
        {room_id: 3, guest_id: 3, guest_hash: 'kik'},

        {room_id:6, guest_id:4, guest_hash: 'lel'},
        {room_id:6, guest_id:5, guest_hash: 'lil'},
        {room_id:6, guest_id:6, guest_hash: 'lul'},
        {room_id:6, guest_id:3, guest_hash: 'ban', is_allowed: false}

      ]);
    });
};
