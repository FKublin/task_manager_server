const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const comment = require('./comment.model')


const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    userStory: {
        type: String,
        required: true
    },
    startDate:
    {
        type: Date,
        required: true,
        default: Date.now()
    },
    endDate: Date,
    taskHolder: {
        type: Schema.Types.ObjectId, 
        ref: 'user'
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    comments: [comment.schema]
})

module.exports = mongoose.model('task', taskSchema);