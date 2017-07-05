/**
 * Created by AMAR on 7/5/2017.
 */
const mongoose = require("mongoose");


var schema = mongoose.Schema({
    connId : {
        type : String,
        required : true,
        trim : true,
        unique : true,
    },
    timeout : {
        type: Number,
        required : true,
        trim : true
    },
    kill : {
        type : Boolean,
        default : false,
    }
})
var r = mongoose.model("request",schema);

module.exports = {r}