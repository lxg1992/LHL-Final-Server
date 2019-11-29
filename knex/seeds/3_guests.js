
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('guests').del()
    .then(function () {
      // Inserts seed entries
      return knex('guests').insert([
        /*1*/{room_id: 1, user_id: 2, guest_hash: 'jel'},
        /*2*/{room_id: 1, user_id: 3, guest_hash: 'jok'},
  
        /*3*/{room_id: 3, user_id: 2, guest_hash: 'kek'},
        /*4*/{room_id: 3, user_id: 3, guest_hash: 'kik'},
        /*5*/{room_id: 3, user_id: 4, guest_hash: 'kak', is_allowed: false},
        /*6*/{room_id: 3, user_id: 5, guest_hash: 'kuk', is_allowed: false},
        /*7*/{room_id: 3, user_id: 6, guest_hash: 'kyk', is_allowed: false},
        
  
        /*8*/{room_id:6, user_id:4, guest_hash: 'lel'},
        /*9*/{room_id:6, user_id:5, guest_hash: 'lil'},
        /*10*/{room_id:6, user_id:6, guest_hash: 'lul'},
        /*11*/{room_id:6, user_id:3, guest_hash: 'ban', is_allowed: false}

      ]);
    });
};
