const { Bot, GrammyError, HttpError, Keyboard } = require('grammy');
require('dotenv').config();

const bot = new Bot(process.env.BOT_API_KEY);
console.log(`Bot is running!`);

bot.command('start', async (ctx) => {
  await ctx.reply('Hello World!');
  console.log(ctx);
});

bot.hears('html', async (ctx) => {
  await ctx.reply('Hey there!');
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
