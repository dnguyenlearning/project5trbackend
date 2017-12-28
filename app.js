const express=require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config=require('./config/config');
const path=require('path');
const app=express();

const users=require('./routes/users');
const loaisanpham=require('./routes/loaisanpham');
const posts=require('./routes/posts');


mongoose.connect(config.database.path,(err)=>{
    console.log("connect to database");
});


app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.use(express.static(path.join(__dirname,'src')));

//body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/users', users);
app.use('/api/loaisanpham', loaisanpham);
app.use('/api/posts', posts);

app.get('/',(req,res)=>{
    res.send('invalid endpoint');
})

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'./src/index.html'));
})

app.listen(config.port, (err)=>{
    if(err) throw err;
    console.log('listenning on port ' + config.port);
})