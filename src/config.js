require('dotenv').config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  GROUP_ID: parseInt(process.env.GROUP_ID),
  ADMIN_ID: parseInt(process.env.ADMIN_ID),
  BOT_USERNAME: process.env.BOT_USERNAME,
  DEV_USERNAME: process.env.DEV_USERNAME,
  PORT: parseInt(process.env.PORT) || 3000,
  
  WEBSITE_PRICES: {
    banking: { usd: 35, ngn: 35000 },
    realestate: { usd: 40, ngn: 40000 },
    comic: { usd: 5, ngn: 5000 },
    linktree: { usd: 3.5, ngn: 3500 },
    portfolio: { usd: 0, ngn: 0 }
  },
  
  DISCOUNT_RATES: {
    5: 0.30,
    4: 0.20
  },
  
  WEBSITE_FEATURES: {
    banking: '• Modern banking UI\n• User dashboard\n• Transaction history\n• Balance management\n• Admin panel\n• Secure login',
    realestate: '• Property listing\n• Search filters\n• Property details\n• Agent contact\n• Admin management',
    comic: '• Comic upload\n• Creator profiles\n• Chapter publishing\n• Reader interface\n• Comment system',
    linktree: '• Multi-link page\n• Social media integration\n• Analytics tracking\n• Mobile optimized',
    portfolio: '• Developer showcase\n• Skills section\n• Project gallery\n• Contact system'
  }
};