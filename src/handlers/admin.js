const database = require('../database');
const config = require('../config');

async function isAdmin(ctx) {
  return ctx.from.id === config.ADMIN_ID;
}

async function broadcastHandler(ctx) {
  if (!await isAdmin(ctx)) return ctx.reply('Admin only');
  
  const message = ctx.message.text.replace('/broadcast', '').trim();
  if (!message) return ctx.reply('Usage: /broadcast [message]');
  
  const users = await database.getAllUsers();
  let sent = 0;
  
  for (const user of users) {
    try {
      await ctx.telegram.sendMessage(user.userId, message);
      sent++;
    } catch(e) {}
  }
  
  await ctx.reply(`✅ Sent to ${sent} users`);
}

async function statsHandler(ctx) {
  if (!await isAdmin(ctx)) return ctx.reply('Admin only');
  
  const stats = await database.getStats();
  await ctx.reply(`📊 STATS\n\nUsers: ${stats.totalUsers}\nReferrals: ${stats.totalReferrals}\nActive: ${stats.activeUsers}`);
}

module.exports = { broadcastHandler, statsHandler, isAdmin };