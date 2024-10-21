const questions = require('./db/pomazkov-js-questions.json');
const { Random } = require('random-js');

const getRandomQuestion = (topic) => {
  const questionTopic = topic.toLowerCase();
  // native js
  // const randomIndex = Math.floor(Math.random() * questions[questionTopic].length);
  // return questions[questionTopic][randomIndex];

  const random = new Random();
  // random-js integer
  // const randomIndex = random.integer(0, questions[questionTopic].length - 1);
  // return questions[questionTopic][randomIndex];

  // random-js pick
  const randomQuestion = random.pick(questions[questionTopic]);
  return randomQuestion;
};

module.exports = { getRandomQuestion };
