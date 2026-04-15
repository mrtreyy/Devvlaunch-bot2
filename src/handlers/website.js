const { Markup } = require('telegraf');
const config = require('../config');
const utils = require('../utils');

async function websiteMenuHandler(ctx) {
  await ctx.editMessageText('🌐 WEBSITE SERVICES\nChoose:',
    Markup.inlineKeyboard([
      [Markup.button.callback('📦 Order Websites', 'order_websites')],
      [Markup.button.callback('🎨 Custom Request', 'request_custom')],
      [Markup.button.callback('⬅ Back', 'main_menu')]
    ]));
}

async function orderWebsitesHandler(ctx) {
  await ctx.editMessageText('Select website:',
    Markup.inlineKeyboard([
      [Markup.button.callback('🏦 Banking', 'web_banking')],
      [Markup.button.callback('🏡 Real Estate', 'web_realestate')],
      [Markup.button.callback('🎨 Comic', 'web_comic')],
      [Markup.button.callback('🔗 Linktree', 'web_linktree')],
      [Markup.button.callback('👨‍💻 Portfolio', 'web_portfolio')],
      [Markup.button.callback('⬅ Back', 'website_menu')]
    ]));
}

async function showWebsite(ctx, type) {
  const name = utils.getWebsiteDisplayName(type);
  const features = config.WEBSITE_FEATURES[type];
  
  await ctx.editMessageText(`${name}\n\nFeatures:\n${features}\n\nClick to order:`,
    Markup.inlineKeyboard([
      [Markup.button.callback('📩 Contact Dev', `order_${type}`)],
      [Markup.button.callback('⬅ Back', 'order_websites')]
    ]));
}

async function contactForOrder(ctx, type) {
  const name = utils.getWebsiteDisplayName(type);
  await ctx.telegram.sendMessage(config.DEV_USERNAME, 
    `Order: ${name}\nFrom: @${ctx.from.username || ctx.from.first_name}`);
  await ctx.answerCbQuery('✅ Request sent!');
}

async function requestCustomWebsite(ctx) {
  await ctx.editMessageText('What type of website do you need?\n\nPlease describe your requirements:',
    Markup.inlineKeyboard([Markup.button.callback('⬅ Back', 'website_menu')]));
  ctx.session = { ...ctx.session, awaitingCustomRequest: true };
}

async function handleCustomRequest(ctx) {
  if (!ctx.session?.awaitingCustomRequest) return false;
  
  const userInput = ctx.message.text;
  await ctx.telegram.sendMessage(config.DEV_USERNAME, 
    `Custom Website Request: ${userInput}\nFrom: @${ctx.from.username || ctx.from.first_name}`);
  await ctx.reply('✅ Request sent! Dev Treyy will contact you.');
  ctx.session.awaitingCustomRequest = false;
  return true;
}

module.exports = { 
  websiteMenuHandler, 
  orderWebsitesHandler, 
  showWebsite, 
  contactForOrder,
  requestCustomWebsite,
  handleCustomRequest
};