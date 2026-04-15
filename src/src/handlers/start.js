const { Markup } = require('telegraf');
const config = require('../config');
const database = require('../database');

async function checkGroup(ctx) {
  try {
    const member = await ctx.telegram.getChatMember(config.GROUP_ID, ctx.from.id);
    return ['member', 'administrator', 'creator'].includes(member.status);
  } catch {
    return false;
  }
}

async function startHandler(ctx) {
  const isMember = await checkGroup(ctx);
  
  if (!isMember) {
    return ctx.reply('✨ Welcome! Please join our community first.',
      Markup.inlineKeyboard([
        [Markup.button.url('🔗 Join Community', `https://t.me/devlaunchcommunity`)],
        [Markup.button.callback('✅ I\'ve Joined', 'verify')]
      ]));
  }
  
  await database.updateUser(ctx.from.id, { isVerified: true });
  
  await ctx.replyWithPhoto(
    'https://via.placeholder.com/800x400/1a1a2e/ffffff?text=DevLaunch',
    {
      caption: '✨ WELCOME TO DEVLAUNCH ✨\n\nChoose an option:',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🌐 Website Services', 'menu_website')],
        [Markup.button.callback('💳 Purchase Accounts', 'menu_purchase')],
        [Markup.button.callback('🎯 Referral Program', 'menu_referral')],
        [Markup.button.callback('👨‍💻 Contact Dev', 'contact')]
      ])
    }
  );
}

async function verifyMembership(ctx) {
  const isMember = await checkGroup(ctx);
  if (isMember) {
    await startHandler(ctx);
    await ctx.answerCbQuery('✅ Verified!');
  } else {
    await ctx.answerCbQuery('❌ Please join first!');
  }
}

module.exports = { startHandler, verifyMembership };