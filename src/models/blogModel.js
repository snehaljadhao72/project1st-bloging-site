const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is requied"],
        unique: true,
        trim: true
    },
    body: {
        type: String,
        required: [true, "body is required"],
        trim: true
    },
    authorId: {
        type: ObjectId, 
        ref: "Author",
        required: [true, "authorId is required"],
    },
    tags: [{ type: String, trim: true }],
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },
    subcategory: [{ type: String, trim: true }],


    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);