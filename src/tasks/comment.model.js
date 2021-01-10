const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new mongoose.Schema({
    commentText: {
        type: String,
        required: true
    },
    addedDate:
    {
        type: Date,
        required: true,
        default: Date.now()
    },
    commenter: {
        type: Schema.Types.ObjectId, 
        ref: 'user'
    }
})

module.exports = mongoose.model('comment', commentSchema);