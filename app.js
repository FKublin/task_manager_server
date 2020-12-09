const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const users = require('./src/users/users.api')
const accessTokenSecret = 'verysecretkey';

mongoose.connect('mongodb://localhost:27017/task_manager', {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log('Successfully connected with MongoDB');
})

app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.get('/api/', (req, res) => {
    console.log('api called');
    res.send('Whatcha looking for here?');
});
app.use('/api/users', users);


app.listen(3000, () => {
    console.log('Authentication service started on port 3000');
});