const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    projects: [{type: Schema.Types.ObjectId, ref: 'project'}]
})

module.exports = mongoose.model('user', userSchema);