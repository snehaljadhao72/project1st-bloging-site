const mongoose = require('mongoose');
const moment = require('moment')
const ObjectId = mongoose.Schema.Types.ObjectId
const Date = moment().format('DD/MM/YYYY')
console.log(Date)
const blogSchema = new mongoose.Schema( {
    title: {
        type:String,
        required:[true,"title is requied"],
        unique:true,
        trim:true
    },
    body: {
        type:String,
        required:[true,"body is required"],
        trim:true
    }, 
    authorId: {
        type:ObjectId, 
        ref:"Author",
        required:[true, "authorId is required"],
    },
    tags:[{type:String, trim:true}],
    category: {
        type:String, 
        required:[true, "Category is required"],
        trim:true
    }, 
    subcategory: [{type:String, trim:true}], 
    
    publishedAt: {
        type:boolean,
        default: false
    }, 
    isPublished: {
        type:boolean,
        default: false
    },
    deletedAt:{
        type:Date,
        default:null
    } , 
    isDeleted: {
        type:boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);