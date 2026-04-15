const { Telegraf, session } = require('telegraf');
const config = require('../src/config');
const database = require('../src/database');
const { authMiddleware } = require('../src/middleware/auth');
const { rateLimitMiddleware } = require('../src/middleware/rateLimit');
const { startHandler } = require('../src/handlers/start');
const { handleCustomRequest } = require('../src/handlers/website');
const { handleCallback } = require('../src/handlers/callbacks');
const { broadcastHandler, statsHandler } = require('../src/handlers/admin');

const bot = new Telegraf(config.BOT_TOKEN);

bot.use(session());
bot.use(authMiddleware);
bot.use(rateLimitMiddleware);

bot.command('start', startHandler);
bot.command('broadcast', broadcastHandler);
bot.command('stats', statsHandler);

bot.on('text', async (ctx) => {
  const handled = await handleCustomRequest(ctx);
  if (!handled) {
    await ctx.reply('Please use the menu buttons. Type /start');
  }
});

bot.action(/.*/, handleCallback);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } catch (error) {
      res.status(400).json({ ok: false });
    }
  } else {
    res.status(200).send('Bot is running');
  }
}