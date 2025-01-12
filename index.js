require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const runJob = require('./jobs/fetchJob');
const apiRouters = require('./router/router');
const rateLimit = require('express-rate-limit');

mongoose.connect(process.env.mongo_db_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

const app = express();
const port = process.env.port

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: 'Too many requests, please try again later.',
})
app.use(limiter)


const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;

console.log(`[${new Date().toISOString()}] Starting first crypto fetch job`);
runJob(); 

setInterval(() => {
  console.log(`[${new Date().toISOString()}] Running scheduled crypto fetch job`);
  runJob();
}, twoHoursInMilliseconds);



app.use('/', apiRouters)


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

