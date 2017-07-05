/**Created by AMAR on 7/5/2017.**/

//required modules
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const _ = require("lodash")
const setTimer = require('set-timer');
const {r} = require("./db_schema")

//setting up PORT
var port = process.env.PORT|| 3000
var dbpath = process.env.MONGODB_URI || "mongodb://localhost:27017/formongoose" 
mongoose.Promise = global.Promise;

var app = express();


mongoose.connect(dbpath, {
    useMongoClient: true
})

//Midlleware
app.use(bodyParser.json());

// home route
app.get("/",(req,res)=>
{
    res.send("Hey Hi there")
    console.log("HI");
}
)
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
                      console.log(value.connId)
                      var val = value.connId
                      y[val]= ""+value.timeout+""     
                  })
                console.log(y)
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
        console.log(err);
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
            console.log("done successfully")
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

