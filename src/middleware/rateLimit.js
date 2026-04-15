const userLimits = new Map();

async function rateLimitMiddleware(ctx, next) {
  const userId = ctx.from.id;
  const now = Date.now();
  const userLimit = userLimits.get(userId) || { count: 0, resetTime: now + 60000 };
  
  if (now > userLimit.resetTime) {
    userLimit.count = 1;
    userLimit.resetTime = now + 60000;
    userLimits.set(userId, userLimit);
    return next();
  }
  
  if (userLimit.count >= 10) {
    return ctx.reply('⏳ Please slow down');
  }
  
  userLimit.count++;
  userLimits.set(userId, userLimit);
  return next();
}

module.exports = { rateLimitMiddleware };