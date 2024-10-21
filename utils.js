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

const getCorrectAnswer = (topic, id) => {
  const question = questions[topic].find((question) => question.id === id);
  if (!question.hasOptions) {
    return question.answer;
  }
  const correctOption = question.options.find((option) => option.isCorrect);
  return correctOption.text;
};

module.exports = { getRandomQuestion, getCorrectAnswer };
