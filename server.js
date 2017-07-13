/**Created by AMAR on 7/5/2017.**/

//required modules
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const _ = require("lodash")
const setTimer = require('set-timer');
const hbs = require('hbs');
const {r} = require("./db_schema")

//setting up PORT
var port = process.env.PORT|| 3000
var dbpath = process.env.MONGODB_URI || "mongodb://localhost:27017/formongoose" 
mongoose.Promise = global.Promise;

var app = express();

console.log(`PATH: ${dbpath}`)

mongoose.connect(dbpath, {
    useMongoClient: true
})

app.static(__dirname + "/public/");

app.set('view-engine','hbs');
//Midlleware
app.use(bodyParser.json());

// home route
app.get("/",(req,res)=>
{
    res.render("index.hbs")
    console.log("HI");
}
)

//setting up the access control
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});


//Problem Solution Routes
app.get("/api/serverStatus",(req,res)=>
    {
        
        var y = {}
        var i=0;
        r.find({},'timeout connId',(err,docs)=>{
            if(!err)
            {
             
                var check = JSON.stringify(docs)
                  _.forEach(docs,(value)=>
                  {
                    
                      var val = value.connId
                      y[val]= ""+value.timeout+""     
                  })
             
                res.status(200).send(y)
            }
            else
                res.status(400).send("can't find docs")
        })
    }
)


app.get('/api/request',(req,res)=>
{
    var user = new r({
        connId : req.query.connId,
        timeout : req.query.timeout
    })
        user.save().then((user)=>{
    },(err)=>
    {
        res.status(400).send("some error occured");
    })
    var flag =1;
    var response = "OK"
    var timer = setTimer(function () {
    r.findByIdAndUpdate(user._id,{ $inc: { timeout : -1} },{new : true}).then((doc)=>
        {
            if(doc.timeout<=0)
            {
                if(doc.kill)
                    response = "KILLED"
                doc.timeout = 0;
                doc.save();
                flag =0;
                res.status(200).send({"Status":response})
                this.clear();
            }
          
        },(err)=>{
    res.status(400).send("Unknown error occured");})
}, {
    limit: parseInt(req.query.timeout),             
    interval: 1000,         
    onClear: function () {
        if(flag!=0)
            res.status(200).send({"Status":"OK"})
        
    }
});
})


app.post("/api/kill",(req,res)=>
{
    r.findOneAndUpdate({connId : req.body.connId},{$set :{timeout:0,kill :true}},{new:true}).then((doc)=>
    {
        if(!doc)
            res.status(400).send(`"status":"invalid connection Id : ${req.body.connId}`)
        else
            res.status(200).send({"status":"OK"})
    })
},(err)=>{
    res.status(400).send("Can't do it")
})


app.listen(port,()=>{
    console.log("Server is up")
})

