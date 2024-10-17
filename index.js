const { Bot } = require('grammy')
require('dotenv').config()

const bot = new Bot(process.env.BOT_API_KEY)

bot.start()

