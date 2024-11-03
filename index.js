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
    .row()
    .text('Случайный вопрос')
    .resized();
  await ctx.reply('Выбери тему вопроса в меню 👇', { reply_markup: startKeyboard });
});

bot.hears(['HTML', 'CSS', 'JavaScript', 'React', 'Случайный вопрос'], async (ctx) => {
  const topic = ctx.message.text.toLowerCase();
  const { question, returnedTopic } = getRandomQuestion(topic);
  let inlineKeyboard;
  if (question.hasOptions) {
    const buttons = question.options.map((option) => {
      return [
        InlineKeyboard.text(
          option.text,
          JSON.stringify({
            type: `${returnedTopic}-option`,
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
        type: returnedTopic,
        questionId: question.id,
        command: `getAnswer`,
      })
    );
  }
  await ctx.reply(question.text, { reply_markup: inlineKeyboard });
});

bot.on('callback_query:data', async (ctx) => {
  const callbackData = JSON.parse(ctx.callbackQuery.data);
  const { type, questionId, isCorrect } = callbackData;

  if (!callbackData.type.includes(`option`)) {
    const answer = getCorrectAnswer(type, questionId);
    await ctx.reply(answer, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
    await ctx.answerCallbackQuery();
    return;
  }

  if (isCorrect) {
    await ctx.reply(`Верно ✅`);
    await ctx.answerCallbackQuery();
    return;
  }

  const typeWoOption = type.split('-')[0];
  const answer = getCorrectAnswer(typeWoOption, questionId);
  await ctx.reply(`Неверно ❌ Правильный ответ: ${answer}`);
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
