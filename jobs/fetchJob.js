const fetchCryptoData = require('./fetchData');
const Crypto = require('../model/schema');


const runJob = async () => {
  const data = await fetchCryptoData();
  console.log(data)
  if (!data) {
    console.error('Failed to fetch data.');
    return;
  }


  const coins = [
    { id: 'bitcoin', name: 'Bitcoin' },
    { id: 'matic-network', name: 'Matic' },
    { id: 'ethereum', name: 'Ethereum' },
  ];

  for (const coin of coins) {
    const { usd: price, usd_market_cap: marketCap, usd_24h_change: change24h } = data[coin.id];

    const crypto = new Crypto({
      coin: coin.name,
      price,
      marketCap,
      change24h,
    });

    try {
      await crypto.save();
      console.log(`Saved data for ${coin.name}`);
    } catch (error) {
      console.error(`Error saving data for ${coin.name}:`, error);
    }
  }
};

module.exports = runJob;
