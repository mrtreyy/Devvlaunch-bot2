const { startHandler, verifyMembership } = require('./start');
const { websiteMenuHandler, orderWebsitesHandler, showWebsite, contactForOrder, requestCustomWebsite } = require('./website');
const { purchaseMenuHandler, initiatePurchase, applyDiscount, noDiscount, confirmPurchase } = require('./purchase');
const { referralMenuHandler, getReferralLink, referralStats } = require('./referral');
const { Markup } = require('telegraf');
const config = require('../config');

async function handleCallback(ctx) {
  const data = ctx.callbackQuery.data;
  
  // Verification & Menu
  if (data === 'verify') return await verifyMembership(ctx);
  if (data === 'main_menu') return await startHandler(ctx);
  
  // Website Menu
  if (data === 'menu_website') return await websiteMenuHandler(ctx);
  if (data === 'order_websites') return await orderWebsitesHandler(ctx);
  if (data === 'website_menu') return await websiteMenuHandler(ctx);
  if (data === 'request_custom') return await requestCustomWebsite(ctx);
  
  // Purchase Menu
  if (data === 'menu_purchase') return await purchaseMenuHandler(ctx);
  if (data === 'purchase_menu') return await purchaseMenuHandler(ctx);
  
  // Referral Menu
  if (data === 'menu_referral') return await referralMenuHandler(ctx);
  if (data === 'referral_menu') return await referralMenuHandler(ctx);
  if (data === 'get_link') return await getReferralLink(ctx);
  if (data === 'my_stats') return await referralStats(ctx);
  
  // Website Selection
  if (data === 'web_banking') return await showWebsite(ctx, 'banking');
  if (data === 'web_realestate') return await showWebsite(ctx, 'realestate');
  if (data === 'web_comic') return await showWebsite(ctx, 'comic');
  if (data === 'web_linktree') return await showWebsite(ctx, 'linktree');
  if (data === 'web_portfolio') return await showWebsite(ctx, 'portfolio');
  
  // Website Orders
  if (data === 'order_banking') return await contactForOrder(ctx, 'banking');
  if (data === 'order_realestate') return await contactForOrder(ctx, 'realestate');
  if (data === 'order_comic') return await contactForOrder(ctx, 'comic');
  if (data === 'order_linktree') return await contactForOrder(ctx, 'linktree');
  if (data === 'order_portfolio') return await contactForOrder(ctx, 'portfolio');
  
  // Purchase Selection
  if (data === 'buy_banking') return await initiatePurchase(ctx, 'banking');
  if (data === 'buy_realestate') return await initiatePurchase(ctx, 'realestate');
  if (data === 'buy_comic') return await initiatePurchase(ctx, 'comic');
  if (data === 'buy_linktree') return await initiatePurchase(ctx, 'linktree');
  if (data === 'buy_portfolio') return await initiatePurchase(ctx, 'portfolio');
  
  // Discount
  if (data === 'apply_discount') return await applyDiscount(ctx);
  if (data === 'no_discount') return await noDiscount(ctx);
  if (data.startsWith('confirm_')) {
    const points = data.replace('confirm_', '');
    return await confirmPurchase(ctx, parseInt(points));
  }
  
  // Contact
  if (data === 'contact') {
    await ctx.answerCbQuery();
    await ctx.reply(`Contact @${config.DEV_USERNAME}`);
  }
  
  await ctx.answerCbQuery();
}

module.exports = { handleCallback };