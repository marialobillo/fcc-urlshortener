require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { connectRedisClient } = require("./src/db/redis");


// Basic Configuration
const port = process.env.PORT || 3000;

const connectDB = require('./src/db/connection')
const urlsRouter = require('./src/routes/urls')

// Middlewares
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));


// Routes
app.use('/api/shorturl', urlsRouter)


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


// Connect to the database and start the server
const start = async () => {
  try {
      await connectDB(process.env.MONGO_URI)
      await connectRedisClient()
      app.listen(process.env.PORT || port, () => {
        console.log('Your app is listening on port ' + port)
      })
  } catch (error) {
    console.log(error)
  }
}

start()
