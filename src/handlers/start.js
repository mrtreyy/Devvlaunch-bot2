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
        [Markup.button.url('🔗 Join Community', 'https://t.me/devvlaunchcommunity')],
        [Markup.button.callback('✅ I\'ve Joined', 'verify')]
      ]));
  }

  await database.updateUser(ctx.from.id, { isVerified: true });

  await ctx.reply(
    '✨ *WELCOME TO DEVLAUNCH* ✨\n\nDevLaunch helps creators and developers build powerful digital platforms.\n\n*Inside this bot you can:*\n\n• 🌐 Order professional websites\n• 💳 Purchase ready-made website accounts\n• 🎯 Earn referral rewards\n• 🤝 Collaborate with developers\n• 👨‍💻 Contact the creator Dev Treyy\n\nStart exploring below! 🚀',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🌐 Website Services', 'menu_website')],
        [Markup.button.callback('💳 Purchase Accounts', 'menu_purchase')],
        [Markup.button.callback('🎯 Referral Program', 'menu_referral')],
        [Markup.button.callback('👨‍💻 Contact Dev', 'contact')],
        [Markup.button.callback('🌍 Join Community', 'join_group')]
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