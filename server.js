require('dotenv').config();

const express = require('express');
const usersRouter = require('./routes/routes');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



app.use('/users', usersRouter);

const SECRET_KEY = 'api-test';
// Middleware to authenticate requests
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
