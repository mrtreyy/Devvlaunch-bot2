const { Markup } = require('telegraf');
const config = require('../config');

async function referralMenuHandler(ctx) {
  await ctx.editMessageText(`🎯 REFERRAL PROGRAM\n\nPoints: ${ctx.user.referralPoints}\nReferrals: ${ctx.user.referralsCount}\n\nChoose:`,
    Markup.inlineKeyboard([
      [Markup.button.callback('🔗 Get Link', 'get_link')],
      [Markup.button.callback('📊 My Stats', 'my_stats')],
      [Markup.button.callback('⬅ Back', 'main_menu')]
    ]));
}

async function getReferralLink(ctx) {
  const link = `https://t.me/${config.BOT_USERNAME}?start=${ctx.from.id}`;
  await ctx.editMessageText(`Your link:\n${link}\n\nShare to earn points!`,
    Markup.inlineKeyboard([Markup.button.callback('⬅ Back', 'referral_menu')]));
}

async function referralStats(ctx) {
  await ctx.editMessageText(`📊 YOUR STATS\n\nPoints: ${ctx.user.referralPoints}\nReferrals: ${ctx.user.referralsCount}\nRedeemed: ${ctx.user.pointsRedeemed}`,
    Markup.inlineKeyboard([Markup.button.callback('⬅ Back', 'referral_menu')]));
}

module.exports = { referralMenuHandler, getReferralLink, referralStats };