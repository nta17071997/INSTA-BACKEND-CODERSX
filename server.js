const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const routeAuth = require('./routes/auth');
const routePost = require('./routes/post');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', routeAuth);
app.use('/api/posts', routePost);

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (err) => {
    if (err) {
      console.log(`Mongodb Connected error: ${err} `);
    } else {
      console.log('Mongodb connected successfuly!');
    }
  }
);
app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
