const { Telegraf } = require('telegraf');
const config = require('../src/config');

// Initialize your bot
const bot = new Telegraf(config.BOT_TOKEN);

// --- Your Bot's Logic (Copy this section exactly from your working src/bot.js) ---
// Make sure to include all your bot.command, bot.action, and bot.on handlers here.
// For a quick test, we'll add a simple /start command.
bot.command('start', (ctx) => ctx.reply('Vercel deployment successful!'));

// --- The CRITICAL Vercel Handler ---
module.exports = async (req, res) => {
    try {
        // Only process POST requests from Telegram
        if (req.method === 'POST') {
            // Pass the incoming update to your bot
            await bot.handleUpdate(req.body, res);
            res.status(200).send('OK');
        } else {
            // Respond to GET requests to confirm the function is alive
            res.status(200).send('Bot is ready.');
        }
    } catch (error) {
        console.error('Error handling update:', error);
        res.status(400).send('Bad Request');
    }
};