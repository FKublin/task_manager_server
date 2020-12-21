const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const task = require('../tasks/tasks.model');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    admins: [{
        type: Schema.Types.ObjectId, 
        ref: 'user', 
        required: true
    }],
    users: [{
        type: Schema.Types.ObjectId, 
        ref: 'user'
    }],
    tasks: [task.schema]
})

module.exports = mongoose.model('project', projectSchema);