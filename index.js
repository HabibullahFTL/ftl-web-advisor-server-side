const port = 3005;
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors())


app.get("/",(req,res)=>{
    res.send({name:"Hkk"})
})

app.listen( process.env.PORT || port)