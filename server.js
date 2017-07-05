/**
 * Created by AMAR on 7/5/2017.
 */
const express = require('express');
const mongoose = require("mongoose");
var app = express();
var port = process.env.PORT|| 3000
mongoose.connect("mongodb://manu:manu12345@ds149382.mlab.com:49382/project")

app.listen(port,()=>{
    console.log("Server is up")
})

