const { std } = require('mathjs')
const express = require('express');
const Crypto = require('../model/schema');
const router = express.Router();


const coins = [
  { id: 'bitcoin', name: 'Bitcoin' },
  { id: 'matic-network', name: 'Matic' },
  { id: 'ethereum', name: 'Ethereum' },
];

router.get('/stats', async (req, res) => {
  const coinId = req.query.coin; 
  
  if (!coinId) {
    return res.status(400).send('Coin parameter is required');
  }

  const coin = coins.find(c => c.id === coinId);
  if (!coin) {
    return res.status(404).send('Invalid coin ID');
  }
  try {
    const data = await Crypto.findOne({ coin: coin.name }).sort({ timestamp: -1 });
    if (!data) {
      return res.status(404).json({ error: 'Data not found' });
    }

    res.json({
      price: data.price,
      marketCap: data.marketCap,
      '24hChange': data.change24h,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from the database' });
  }
})

router.get('/deviation', async (req, res) => {
  const coinId = req.query.coin;
  
  if (!coinId) {
    return res.status(400).send('Coin parameter is required');
  }

  const coin = coins.find(c => c.id === coinId);
  if (!coin) {
    return res.status(404).send('Invalid coin ID');
  }
  
  try {
    const data = await Crypto.find({ coin: coin.name }).sort({ timestamp: -1 }).limit(100);

    if (data.length < 2) {
      return res.status(400).json({ error: 'Not enough data to calculate standard deviation' });
    }

    const prices = data.map(record => record.price);
    const deviation = std(prices);

    res.json({ deviation });
  } catch (error) {
    res.status(500).json({ error: 'Error calculating standard deviation' });
  }
});

module.exports = router;
