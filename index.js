const port = 3005;
const express = require('express');
const cors = require('cors');
const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();

const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ummk1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors())

// Present Date & Time
const now = moment().format("YYYY-MM-DD HH:mm:ss");

// Main Part Started here
app.get("/",(req,res)=>{
    res.send({message:"Welcome to FTL Web Advisor API"})
})

// Started integration with mongodb
client.connect(err => {
    const serviceCollection = client.db("ftl_web_advisor").collection("services");
    const orderCollection = client.db("ftl_web_advisor").collection("orders");
    const adminCollection = client.db("ftl_web_advisor").collection("admins");

    if (err) {
        console.log("there is an error");
    }else{
       // ============ [ For Creating new service ]==============
        app.post('/create-service',(req,res)=>{
            serviceCollection.insertOne(req.body).then(result=>{
                if(result.insertedCount > 0){
                    res.send(result.ops[0])
                }else{
                    res.send({message:"Something went wrong"})
                }
            })
        }) 
  
        // ============ [ For Showing All services ]==============
        app.get('/all-services',(req,res)=>{
            serviceCollection.find({})
          .sort({_id:-1})
          .toArray((err,documents)=>{
              res.send(documents)
          })
        })
    }
  });

app.listen( process.env.PORT || port)