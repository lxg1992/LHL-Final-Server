
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('rooms').del()
    .then(function () {
      // Inserts seed entries
      return knex('rooms').insert([
        {host_id: '1', datetime_start:'2019-11-23 16:00:00', datetime_end:'2019-11-23 18:00:00', room_name: 'past room with javascript, database and sql', room_hash: 'abces', is_active: 'false', tags_created: JSON.stringify(['Javascript', 'Database', 'SQL'])},
        {host_id: '1', datetime_start:'2019-12-23 16:00:00', datetime_end:'2019-12-23 18:00:00', room_name: 'future room with javascript', room_hash: 'bdefa', is_active: 'false', tags_created: JSON.stringify(['Javascript'])},
        {host_id: '1', datetime_start:'2019-11-24 00:00:00', datetime_end:'2019-11-30 23:59:59', room_name: 'current room with javascript, database and sql', room_hash: 'ejfak', is_active: 'true', tags_created: JSON.stringify(['Javascript', 'Database', 'SQL'])},
        {host_id: '1', datetime_start:'2019-11-30 16:00:00', datetime_end:'2019-11-30 18:00:00', room_name: 'future room with python, node and npm', room_hash: 'lmfao', is_active: 'false', tags_created: JSON.stringify(['Node', 'Python', 'NPM'])},
        {host_id: '2', datetime_start:'2019-12-01 16:00:00', datetime_end:'2019-12-01 18:00:00', room_name: 'future room with database and sql', room_hash: 'rotfl', is_active: 'false', tags_created: JSON.stringify(['Database', 'SQL'])},
        {host_id: '2', datetime_start:'2019-11-23 17:00:00', datetime_end:'2019-11-23 23:00:00', room_name: 'past room with javascript, database and sql, python', room_hash: 'm8dba', is_active: 'false', tags_created: JSON.stringify(['Javascript', 'Database', 'SQL', 'Python'])},
        {host_id: '2', datetime_start:'2019-11-23 18:00:00', datetime_end:'2019-11-23 23:00:00', room_name: 'past room with javascript, database and sql', room_hash: 'd1111', is_active: 'false', tags_created: JSON.stringify(['Javascript', 'Database', 'SQL'])},
      ]);
    });
};
