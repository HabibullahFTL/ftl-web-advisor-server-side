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

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// Present Date & Time
const now = moment().format("YYYY-MM-DD HH:mm:ss");

// Main Part Started here
app.get("/", (req, res) => {
    res.send({ message: "Welcome to FTL Web Advisor API" })
})

// Started integration with mongodb
client.connect(err => {
    const serviceCollection = client.db("ftl_web_advisor").collection("services");
    const orderCollection = client.db("ftl_web_advisor").collection("orders");
    const adminCollection = client.db("ftl_web_advisor").collection("admins");

    if (err) {
        console.log("there is an error");
    } else {
        // ============ [ For Creating new service ]==============
        app.post('/create-service', (req, res) => {
            const service = req.body;
            service.createdAt = now;
            serviceCollection.insertOne(service).then(result => {
                if (result.insertedCount > 0) {
                    res.send(result.ops[0])
                } else {
                    res.send({ message: "Something went wrong" })
                }
            })
        })

        // ============ [ For Showing All services ]==============
        app.get('/all-services', (req, res) => {
            serviceCollection.find({})
                .sort({ _id: -1 })
                .toArray((err, documents) => {
                    res.send(documents)
                })
        })

        // ============ [ For Showing Single services ]==============
        app.get('/service', (req, res) => {
            const { service_id } = req.query;
            serviceCollection.find({_id: ObjectID(service_id)})
                .sort({ _id: -1 })
                .toArray((err, documents) => {
                    res.send(documents[0])
                })
        })

        // ============ [ For updating Service ]==============
        app.patch('/update-service', (req, res) => {
            const { service_id } = req.query;
            const data = req.body;
            serviceCollection.updateOne(
                { _id: ObjectID(service_id) },
                { $set: data }
            )
                .then(result => {
                    res.send(result.modifiedCount > 0) 
                })
                .catch(err => {
                    res.send(false)
                })
        })

        // ============ [ For deleting service ]==============
        app.put('/delete-service', (req, res) => {
            const { service_id } = req.query;
            serviceCollection.deleteOne({ _id: ObjectID(service_id) })
                .then(result => {
                    res.send(result.deletedCount > 0)
                })
                .catch(err => {
                    res.send(false)
                })
        })

        // ============ [ For placing new order ]==============
        app.post('/place-order', (req, res) => {
            orderCollection.insertOne(req.body).then(result => {
                if (result.insertedCount > 0) {
                    res.send(true)
                } else {
                    res.send({ message: "Something went wrong" })
                }
            })
        })

        // ============ [ For Showing All orders ]==============
        app.get('/all-orders', (req, res) => {
            orderCollection.find({})
                .sort({ _id: -1 })
                .toArray((err, documents) => {
                    res.send(documents)
                })
        })

        // ============ [ For updating order ]==============
        app.patch('/update-order', (req, res) => {
            const { order_id } = req.query;
            const data = req.body;
            orderCollection.updateOne(
                { _id: ObjectID(order_id) },
                { $set: data }
            )
                .then(result => {
                    console.log(result);
                    res.send(result.modifiedCount > 0)
                })
                .catch(err => {
                    res.send(false)
                })
        })

        // ============ [ For deleting order ]==============
        app.put('/delete-order', (req, res) => {
            const { order_id } = req.query;
            orderCollection.deleteOne({ _id: ObjectID(order_id) })
                .then(result => {
                    res.send(result.deletedCount > 0)
                })
                .catch(err => {
                    res.send(false)
                })
        })

    }
});

app.listen(process.env.PORT || port)