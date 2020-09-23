const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const app = express();

//Enabling CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
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
      categoriesCollection.insertOne(req.body)
        .then(categories => {
          res.json(categories);
        })
        .catch(error => console.error(error))
    });

    app.put('/categories', (req, res) => {
		console.log(req.body.body._id);
      db.collection("categories").findOneAndUpdate(
        { "_id": new ObjectID(req.body.body._id) },
        {
          $set: {
            category: req.body.body.newcategory
          }
        },
        {
          upsert: false
        }
      )
        .then(result => res.json({}))
        .catch(error => console.error(error))
    });

    app.delete('/categories', (req, res) => {
		var myquery = { "_id": new ObjectID(req.body._id) };
		console.log(myquery);
		try{
			db.collection("categories").deleteOne(myquery).then( categories => {
				res.json({});
			}).catch(error => console.error(error));			
		}catch(ex){
			console.log(ex);
		}

    });
	
	
	
    app.get('/products', (req, res) => {
      db.collection('products').find().toArray()
        .then(products => {
          res.json(products);
        })
        .catch()
    });	

    app.post('/products', (req, res) => {
      db.collection('products').insertOne(req.body)
        .then(products => {
          res.json(products);
        })
        .catch(error => console.error(error))
    });

    app.put('/products', (req, res) => {
	  console.log(req.body.body._id);
      db.collection("products").findOneAndUpdate(
        { "_id": new ObjectID(req.body.body._id) },
        {
          $set: req.body.body.newProduct
        },
        {
          upsert: false
        }
      )
        .then(result => res.json({}))
        .catch(error => console.error(error))
    });

    app.delete('/products', (req, res) => {
		var myquery = { "_id": new ObjectID(req.body._id) };
		console.log(myquery);
		try{
			db.collection("products").deleteOne(myquery).then( products => {
				res.json({});
			}).catch(error => console.error(error));			
		}catch(ex){
			console.log(ex);
		}

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

