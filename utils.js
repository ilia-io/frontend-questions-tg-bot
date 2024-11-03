const questions = require('./db/default-questions.json');
const { Random } = require('random-js');

const getRandomQuestion = (topic) => {
  const random = new Random();
  if (topic === `случайный вопрос`) {
    topic = random.pick(Object.keys(questions));
  }
  // native js
  // const randomIndex = Math.floor(Math.random() * questions[topic].length);
  // return questions[topic][randomIndex];

  // random-js integer
  // const randomIndex = random.integer(0, questions[topic].length - 1);
  // return questions[topic][randomIndex];

  // random-js pick
  const randomQuestion = random.pick(questions[topic]);
  return { question: randomQuestion, returnedTopic: topic.toLowerCase() };
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
