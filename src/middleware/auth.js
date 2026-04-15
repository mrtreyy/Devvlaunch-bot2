const database = require('../database');

async function authMiddleware(ctx, next) {
  const userId = ctx.from.id;
  let user = await database.getUser(userId);
  
  if (!user) {
    user = await database.createUser(
      userId,
      ctx.from.username,
      ctx.from.first_name,
      ctx.startPayload ? parseInt(ctx.startPayload) : null
    );
  }
  
  ctx.user = user;
  return next();
}

module.exports = { authMiddleware };