const mongoose = require('mongoose');
const { Schema } = mongoose;


// MongoDB Schema
const cryptoSchema = new Schema({
    coin: String,
    price: Number,
    marketCap: Number,
    change24h: Number,
    timestamp: { type: Date, default: Date.now },
});
  
const Crypto = mongoose.model('Crypto', cryptoSchema);
module.exports = Crypto;
