const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();

class Database {
  async getUser(userId) {
    const user = await redis.get(`user:${userId}`);
    return user ? JSON.parse(user) : null;
  }

  async saveUser(user) {
    await redis.set(`user:${user.userId}`, JSON.stringify(user));
  }

  async createUser(userId, username, firstName, referredBy = null) {
    const user = {
      userId,
      username: username || null,
      firstName: firstName || null,
      referredBy,
      referralPoints: 0,
      referralsCount: 0,
      pointsRedeemed: 0,
      totalOrders: 0,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isVerified: false
    };
    
    await this.saveUser(user);
    
    if (referredBy && referredBy !== userId) {
      await this.addReferralPoints(referredBy, userId);
    }
    
    return user;
  }

  async updateUser(userId, updates) {
    const user = await this.getUser(userId);
    if (user) {
      Object.assign(user, updates);
      user.lastActive = new Date().toISOString();
      await this.saveUser(user);
      return user;
    }
    return null;
  }

  async addReferralPoints(referrerId, newUserId) {
    const referrer = await this.getUser(referrerId);
    if (referrer) {
      referrer.referralPoints += 1;
      referrer.referralsCount += 1;
      await this.saveUser(referrer);
    }
  }

  async useReferralPoints(userId, pointsToUse) {
    const user = await this.getUser(userId);
    if (user && user.referralPoints >= pointsToUse) {
      user.referralPoints -= pointsToUse;
      user.pointsRedeemed += pointsToUse;
      await this.saveUser(user);
      return true;
    }
    return false;
  }

  async getAllUsers() {
    const keys = await redis.keys('user:*');
    const users = [];
    for (const key of keys) {
      const user = await redis.get(key);
      if (user) users.push(JSON.parse(user));
    }
    return users;
  }

  async getStats() {
    const users = await this.getAllUsers();
    return {
      totalUsers: users.length,
      totalReferrals: users.reduce((sum, u) => sum + (u.referralsCount || 0), 0),
      activeUsers: users.filter(u => {
        const lastActive = new Date(u.lastActive);
        return (Date.now() - lastActive) / (1000 * 60 * 60 * 24) <= 7;
      }).length
    };
  }
}

module.exports = new Database();