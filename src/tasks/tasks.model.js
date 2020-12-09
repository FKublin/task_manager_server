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
        required: true
    },
    endDate: Date
})

module.exports = mongoose.model('task', taskSchema);