const mongoose = require('mongoose');

mongoose.connect('mongodb://horizonqaapp:H%40r!z0nQA2108@13.127.179.204:27017/lm-api-qa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

module.exports = mongoose;
