const { Telegraf, session } = require('telegraf');
const express = require('express');
const config = require('./config');
const database = require('./database');
const { authMiddleware } = require('./middleware/auth');
const { rateLimitMiddleware } = require('./middleware/rateLimit');
const { startHandler } = require('./handlers/start');
const { handleCustomRequest } = require('./handlers/website');
const { handleCallback } = require('./handlers/callbacks');
const { broadcastHandler, statsHandler } = require('./handlers/admin');

const bot = new Telegraf(config.BOT_TOKEN);
const app = express();

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

if (config.WEBHOOK_DOMAIN) {
  app.use(bot.webhookCallback('/webhook'));
  app.listen(config.PORT, async () => {
    await bot.telegram.setWebhook(`${config.WEBHOOK_DOMAIN}/webhook`);
    console.log('Webhook set');
  });
} else {
  bot.launch();
}

console.log('Bot started');