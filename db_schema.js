/**
 * Created by AMAR on 7/5/2017.
 */
const mongoose = require("mongoose");


var schema = new mongoose.Schema({
    id :{
        type : 'String',
        trim : true,
        unique : true,
        validate : {
            validator : value => validator.isEmail(value),
            message : 'Please enter a valid email id'
        },
        required : true
    },
    password :
    {
        type : 'String',
        trim : true,
        minlength : 8,
        maxlength : 16,
        required : true
    },
    name :
    {
        type : 'String',
        trim : true,
        required : true
    },
    address:
    {
        type : 'String',
    },
    Mobile_Number :
    {
        type : "String",
        validate : {
            validator : value => validator.isMobilePhone(value,"any"),
            message : 'Please enter a valid Mobile Number'
        },
    }
});
var r = mongoose.model("request",schema);

module.exports = {r}