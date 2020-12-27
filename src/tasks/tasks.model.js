const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const taskSchema = new mongoose.Schema({
    taskName: {
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
    }
})

module.exports = mongoose.model('task', taskSchema);