const { Markup } = require('telegraf');
const config = require('../config');
const database = require('../database');

async function purchaseMenuHandler(ctx) {
  await ctx.editMessageText('💳 PURCHASE ACCOUNTS\n\nDiscount: 5 points = 30% off\n4 points = 20% off\n\nSelect:',
    Markup.inlineKeyboard([
      [Markup.button.callback('🏦 Banking - $35', 'buy_banking')],
      [Markup.button.callback('🏡 Real Estate - $40', 'buy_realestate')],
      [Markup.button.callback('🎨 Comic - $5', 'buy_comic')],
      [Markup.button.callback('🔗 Linktree - $3.50', 'buy_linktree')],
      [Markup.button.callback('👨‍💻 Portfolio - FREE', 'buy_portfolio')],
      [Markup.button.callback('⬅ Back', 'main_menu')]
    ]));
}

async function initiatePurchase(ctx, type) {
  const price = config.WEBSITE_PRICES[type];
  ctx.session.purchase = { type, price: price.usd };
  
  if (ctx.user.referralPoints >= 4) {
    await ctx.editMessageText(`Price: $${price.usd}\nYou have ${ctx.user.referralPoints} points. Apply discount?`,
      Markup.inlineKeyboard([
        [Markup.button.callback('✅ Use Points', 'apply_discount')],
        [Markup.button.callback('💰 No Discount', 'no_discount')],
        [Markup.button.callback('⬅ Back', 'purchase_menu')]
      ]));
  } else {
    await ctx.editMessageText(`Price: $${price.usd}\nEarn more points for discount!`,
      Markup.inlineKeyboard([
        [Markup.button.callback('💰 Buy Now', 'no_discount')],
        [Markup.button.callback('⬅ Back', 'purchase_menu')]
      ]));
  }
}

async function applyDiscount(ctx) {
  const purchase = ctx.session.purchase;
  const pointsToUse = ctx.user.referralPoints >= 5 ? 5 : 4;
  const discountPercent = pointsToUse === 5 ? 30 : 20;
  const finalPrice = purchase.price * (1 - (discountPercent / 100));
  
  await ctx.editMessageText(`Original: $${purchase.price}\nDiscount: ${discountPercent}%\nFinal: $${finalPrice.toFixed(2)}\n\nConfirm?`,
    Markup.inlineKeyboard([
      [Markup.button.callback('✅ Confirm', `confirm_${pointsToUse}`)],
      [Markup.button.callback('⬅ Back', 'purchase_menu')]
    ]));
  
  ctx.session.finalPrice = finalPrice;
  ctx.session.pointsUsed = pointsToUse;
}

async function noDiscount(ctx) {
  await ctx.editMessageText(`Price: $${ctx.session.purchase.price}\n\nConfirm purchase?`,
    Markup.inlineKeyboard([
      [Markup.button.callback('✅ Confirm', 'confirm_0')],
      [Markup.button.callback('⬅ Back', 'purchase_menu')]
    ]));
  ctx.session.finalPrice = ctx.session.purchase.price;
  ctx.session.pointsUsed = 0;
}

async function confirmPurchase(ctx, pointsUsed) {
  if (pointsUsed > 0) {
    await database.useReferralPoints(ctx.from.id, pointsUsed);
  }
  
  await database.updateUser(ctx.from.id, { totalOrders: ctx.user.totalOrders + 1 });
  
  const message = `Purchase: ${ctx.session.purchase.type}\nPrice: $${ctx.session.finalPrice}\nFrom: @${ctx.from.username}`;
  await ctx.telegram.sendMessage(config.DEV_USERNAME, message);
  
  await ctx.editMessageText('✅ Purchase request sent! Dev Treyy will contact you.',
    Markup.inlineKeyboard([Markup.button.callback('⬅ Back', 'main_menu')]));
  
  delete ctx.session.purchase;
}

module.exports = { purchaseMenuHandler, initiatePurchase, applyDiscount, noDiscount, confirmPurchase };