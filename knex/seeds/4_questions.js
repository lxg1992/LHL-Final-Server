
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('questions').del()
    .then(function () {
      // Inserts seed entries
      return knex('questions').insert([
        //room 1 hosted by 1
        /*1*/{guest_id: 1, room_id: 1, query: 'What is SQL and Javascript', tags_selected: JSON.stringify(['SQL', 'Javascript']), created_at: '2019-11-23 18:00:25'},
        /*2*/{guest_id: 2, room_id: 1, query: 'How do I connect to Javascript database', tags_selected: JSON.stringify(['Javascript','Database']), created_at: '2019-11-23 18:02:30'},
        /*3*/{guest_id: 3, room_id: 1, query: 'Is Javascript faster than Ruby', tags_selected: JSON.stringify(['Javascript']), created_at: '2019-11-23 18:03:30'},

        /*4*/{guest_id: 4, room_id: 3, query: 'What is SQL and Javascript', tags_selected: JSON.stringify(['SQL', 'Javascript']), created_at: '2019-11-25 18:00:25'},
        /*5*/{guest_id: 5, room_id: 3, query: 'How do I connect to Javascript database', tags_selected: JSON.stringify(['Javascript','Database']), created_at: '2019-11-25 18:02:30'},
        /*6*/{guest_id: 6, room_id: 3, query: 'Is Javascript faster than Ruby', tags_selected: JSON.stringify(['Javascript']),created_at: '2019-11-25 18:02:45'},
        /*7*/{guest_id: 6, room_id: 3, query: 'Is javascript REAAALY faster than Ruby', tags_selected: JSON.stringify(['Javascript']),created_at: '2019-11-25 18:02:50'},
        /*8*/{guest_id: 7, room_id: 3, query: 'You should not be able to see this question', tags_selected: JSON.stringify([]),created_at: knex.fn.now()},
        /*9*/{guest_id: 8, room_id: 3, query: 'You shouldn\'t be able to see this either', tags_selected: JSON.stringify(['Ban','me','please']), created_at: '2019-11-25 18:01:45'},
      
        
        /*10*/ {guest_id: 9, room_id: 6, query: 'How do I connect to a database', tags_selected: JSON.stringify(['Database']), created_at: '2019-11-23 17:00:25'},
        /*11*/{guest_id: 10, room_id: 6, query: 'How do I connect to a database', tags_selected: JSON.stringify(['Database']), created_at: '2019-11-23 17:00:35'},
        /*12*/{guest_id: 11, room_id: 6, query: 'How do I connect to a database', tags_selected: JSON.stringify(['Database']), created_at: '2019-11-23 17:00:40'},
        /*13*/{guest_id: 11, room_id: 6, query: 'What is Python and Javascript and database', tags_selected: JSON.stringify(['Javascript', 'Python','Database']), created_at: '2019-11-23 17:01:40'}

       
      ]);
    });
};

