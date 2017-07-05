/**
 * Created by AMAR on 7/5/2017.
 */
const express = require('express');

var app = express();

app.listen(process.env.PORT,()=>{
    console.log("Server is up")
})

