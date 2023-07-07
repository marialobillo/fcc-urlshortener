require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


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

// app.post('/api/shorturl', (req, res) => {
//   console.log('The body is: ', req.body)
//   const url = new URL(req.body.url);
//   const hostnameURL = url.hostname;
//   dns.lookup(
//     hostnameURL, 
//     async (error, address, family) => {
//       if (error) {
//         console.error(error);
//         return res.status(400).json({ error: 'invalid url' });
//       } else {
//         // if no error exists, we save the url to the database
//         console.log(
//           `The ip address is ${address} and the ip version is ${family}`
//         );
//         return res.status(200).json({ message: 'valid url' });
//       }
//   })
// })

// app.get('/app/shorturl/:short_url', (req, res) => {
//   const short_url = req.params.short_url;
//   console.log('The short url is: ', short_url);
//   res.status(200).json({ message: 'short url' });
// })



// Connect to the database and start the server
const start = async () => {
  try {
      await connectDB(process.env.MONGO_URI)
      app.listen(process.env.PORT || port, () => {
        console.log('Your app is listening on port ' + port)
      })
  } catch (error) {
    console.log(error)
  }
}

start()
