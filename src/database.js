const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/users.json');

class Database {
  constructor() {
    this.users = new Map();
    this.init();
  }

  async init() {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      const users = JSON.parse(data);
      users.forEach(user => this.users.set(user.userId, user));
      console.log(`Loaded ${this.users.size} users`);
    } catch (error) {
      await this.save();
    }
  }

  async save() {
    const usersArray = Array.from(this.users.values());
    await fs.writeFile(DATA_FILE, JSON.stringify(usersArray, null, 2));
  }

  async getUser(userId) {
    return this.users.get(userId) || null;
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
    
    this.users.set(userId, user);
    await this.save();
    
    if (referredBy && referredBy !== userId) {
      const referrer = await this.getUser(referredBy);
      if (referrer) {
        referrer.referralPoints += 1;
        referrer.referralsCount += 1;
        await this.save();
      }
    }
    
    return user;
  }

  async updateUser(userId, updates) {
    const user = await this.getUser(userId);
    if (user) {
      Object.assign(user, updates);
      user.lastActive = new Date().toISOString();
      this.users.set(userId, user);
      await this.save();
    }
    return user;
  }

  async getAllUsers() {
    return Array.from(this.users.values());
  }

  async getStats() {
    const users = await this.getAllUsers();
    return {
      totalUsers: users.length,
      totalReferrals: users.reduce((sum, u) => sum + u.referralsCount, 0),
      activeUsers: users.filter(u => {
        const lastActive = new Date(u.lastActive);
        return (Date.now() - lastActive) / (1000 * 60 * 60 * 24) <= 7;
      }).length
    };
  }
}

module.exports = new Database();