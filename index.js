const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const app = express();

//Enabling CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const connectionString = "mongodb+srv://vtrao:rbrMW3Yg0oePIzsR@vtrao.0ma8f.mongodb.net/vtrao?retryWrites=true&w=majority";

const client = new MongoClient(connectionString, { useUnifiedTopology: true});
client.connect(err => {
	assert.equal(null, err);
    const db = client.db('vtrao');
    const categoriesCollection = db.collection('categories');

  // perform actions on the collection object
  console.log("Connection Successfull");
  
    // ========================
    // Middlewares
    // ========================
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

    // ========================
    // Routes
    // ========================
    app.get('/', (req, res) => {
		res.json({"Server Stauus": " : Up and Running"});
    });
	
    app.get('/categories', (req, res) => {
      db.collection('categories').find().toArray()
        .then(categories => {
          res.json(categories);
        })
        .catch()
    });	

    app.post('/categories', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.json({});
        })
        .catch(error => console.error(error))
    });

    app.put('/categories', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    });

    app.delete('/categories', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json('Deleted Darth Vadar\'s quote')
        })
        .catch(error => console.error(error))
    });
	
	    // ========================
    // Listen
    // ========================
    const isProduction = process.env.NODE_ENV === 'production'
    const port = process.env.PORT || 5000;
    app.listen(port, function () {
      console.log(`listening on ${port}`)
    });
});

