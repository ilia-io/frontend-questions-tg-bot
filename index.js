const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');
require('dotenv').config();
const { getRandomQuestion, getCorrectAnswer } = require('./utils');

const bot = new Bot(process.env.BOT_API_KEY);
console.log(`Bot is running!`);

bot.command('start', async (ctx) => {
  const startKeyboard = new Keyboard()
    .text('HTML')
    .text('CSS')
    .row()
    .text('JavaScript')
    .text('React')
    .resized();
  await ctx.reply('Hello World!');
  await ctx.reply('Выбери тему вопроса в меню 👇', { reply_markup: startKeyboard });
});

bot.hears(['HTML', 'CSS', 'JavaScript', 'React'], async (ctx) => {
  const topic = ctx.message.text;
  const question = getRandomQuestion(topic);
  // const inlineKeyboard = new InlineKeyboard().text(
  //   `Узнать ответ`,
  //   JSON.stringify({
  //     type: ctx.message.text,
  //     questionId: question.id,
  //     command: `getAnswer`,
  //   })
  // );
  let inlineKeyboard;
  if (question.hasOptions) {
    const buttons = question.options.map((option) => {
      return [
        InlineKeyboard.text(
          option.text,
          JSON.stringify({
            type: `${topic}-option`,
            isCorrect: option.isCorrect,
            questionId: question.id,
          })
        ),
      ];
    });
    inlineKeyboard = InlineKeyboard.from(buttons);
  } else {
    inlineKeyboard = new InlineKeyboard().text(
      `Узнать ответ`,
      JSON.stringify({
        type: topic,
        questionId: question.id,
        command: `getAnswer`,
      })
    );
  }
  await ctx.reply(question.text, { reply_markup: inlineKeyboard });
});

bot.on('callback_query:data', async (ctx) => {
  const callbackData = JSON.parse(ctx.callbackQuery.data);
  const { type, questionId, command, isCorrect, answer } = callbackData;
  // if (ctx.callbackQuery.data === 'cancel') {
  //   await ctx.reply(`Отменено`);
  //   await ctx.answerCallbackQuery();
  //   return;
  // }
  if (!callbackData.type.includes('-option')) {
    const answer = getCorrectAnswer(callbackData.type, callbackData.questionId);
    await ctx.reply(answer);
    await ctx.answerCallbackQuery();
  }

  if (isCorrect) {
    await ctx.reply(`Верно!`);
  } else {
    await ctx.reply(`Неверно!`);
  }
  await ctx.answerCallbackQuery();
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e);
  } else {
    console.error('Unknown error:', e);
  }
});

bot.start();
