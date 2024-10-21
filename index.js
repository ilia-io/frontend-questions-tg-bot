const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');
require('dotenv').config();

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
  const inlineKeyboard = new InlineKeyboard()
    .text(
      `Получить ответ`,
      JSON.stringify({ type: ctx.message.text, questionId: 1, command: `getAnswer` })
    )
    .text(`Отменить`, `cancel`);
  await ctx.reply(`Что такое ${ctx.message.text}?`, { reply_markup: inlineKeyboard });
});

bot.on('callback_query:data', async (ctx) => {
  if (ctx.callbackQuery.data === 'cancel') {
    await ctx.reply(`Отменено`);
    await ctx.answerCallbackQuery();
    return;
  }

  const callbackData = JSON.parse(ctx.callbackQuery.data);
  const { type, questionId, command } = callbackData;
  await ctx.reply(`Выбрана тема ${type}`);
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
