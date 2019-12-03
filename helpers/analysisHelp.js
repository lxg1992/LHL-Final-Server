const questions = [
  {
      "id": 4,
      "created_at": "2019-11-25T23:00:25.000Z",
      "guest_id": 4,
      "room_id": 3,
      "query": "What is SQL and Javascript",
      "tags_selected": [
          "SQL",
          "Javascript"
      ]
  },
  {
      "id": 5,
      "created_at": "2019-11-25T23:02:30.000Z",
      "guest_id": 5,
      "room_id": 3,
      "query": "How do I connect to Javascript database",
      "tags_selected": [
          "Javascript",
          "Database"
      ]
  },
  {
      "id": 6,
      "created_at": "2019-11-25T23:02:45.000Z",
      "guest_id": 6,
      "room_id": 3,
      "query": "Is Javascript faster than Ruby",
      "tags_selected": [
          "Javascript"
      ]
  },
  {
      "id": 7,
      "created_at": "2019-11-25T23:02:50.000Z",
      "guest_id": 6,
      "room_id": 3,
      "query": "Is javascript REAAALY faster than Ruby",
      "tags_selected": [
          "Javascript"
      ]
  },
  {
      "id": 8,
      "created_at": "2019-12-02T01:50:31.546Z",
      "guest_id": 7,
      "room_id": 3,
      "query": "You should not be able to see this question",
      "tags_selected": []
  },
  {
      "id": 9,
      "created_at": "2019-11-25T23:01:45.000Z",
      "guest_id": 8,
      "room_id": 3,
      "query": "You shouldn't be able to see this either",
      "tags_selected": [
          "Ban",
          "me",
          "please"
      ]
  }
]

const guests =  [
  {
      "id": 3,
      "room_id": 3,
      "user_id": 2,
      "guest_hash": "kek",
      "is_allowed": true
  },
  {
      "id": 4,
      "room_id": 3,
      "user_id": 3,
      "guest_hash": "kik",
      "is_allowed": true
  },
  {
      "id": 5,
      "room_id": 3,
      "user_id": 4,
      "guest_hash": "kak",
      "is_allowed": true
  },
  {
      "id": 6,
      "room_id": 3,
      "user_id": 5,
      "guest_hash": "kuk",
      "is_allowed": false
  },
  {
      "id": 7,
      "room_id": 3,
      "user_id": 6,
      "guest_hash": "kyk",
      "is_allowed": false
  }
]


// function getTotalQuestionsCount(questionArray){
//   return questionArray.length
// }

// function getTotalGuestsCount(guestArray){
//   return guestArray.length
// }

// function getTotalTagsCount(questionArray){
//   let tagCount = 0;
//   for(let question of questionArray){
//     tagCount += question.tags_selected.length
//   }
//   return tagCount
// }

// function getIndividualTagsCount(questionArray){
//   let tagCountObject = {}
//   for(let question of questionArray){
//     for(let tag of question.tags_selected){

//       let tagUC = tag.toString().toUpperCase();
//       if(tagCountObject[tagUC] === undefined){
//         tagCountObject[tagUC] = 1
//       } else {
//         tagCountObject[tagUC]++
//       }
//     }
//   }
//   return tagCountObject
// }


// function getQuestionsByTag(questionArray){

// }





// function getTotalQuestionsByGuestId(questionArray){
//   let questionByGuestObject = {}
//   for(let question of questionArray){
//     if(questionByGuestObject[question.guest_id] === undefined){
//       questionByGuestObject[question.guest_id] = 1
//     } else {
//       questionByGuestObject[question.guest_id]++
//     }
//   }
//   console.log(Object.keys(questionByGuestObject).length)
//   return questionByGuestObject
// }

// function getUniqueQuestionAskers(questionArray){
  
// }

// function averageQuestionsPerGuest(questionArray){
  
// }

// function percentParticipation(questionArray, guestArray){

// }

// console.log('TOTAL QUESTIONS',getTotalQuestionsCount(questions));
// console.log('TOTAL GUESTS', getTotalGuestsCount(guests));
// console.log('INDIVIDUAL TAGS', getIndividualTagsCount(questions));
// console.log('TOTAL TAGS ACTIVATED',getTotalTagsCount(questions));
// console.log('QUESTIONS BY GUEST ID', getTotalQuestionsByGuestId(questions));

tagCountObject = {}

for (let question of questions){
  for (let tag of question.tags_selected){
    let tagUC = tag.toString().toUpperCase();
    if(tagCountObject[tagUC] === undefined){
      tagCountObject[tagUC] = {question: [question.query], count: 1};
    }
    else{
      tagCountObject[tagUC]={question: [...tagCountObject[tagUC].question, question.query], count: tagCountObject[tagUC]["count"] += 1};
    }
  }
}

console.log(tagCountObject);




module.exports = {}