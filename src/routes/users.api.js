const express = require('express');
const router = express.Router();
const User = require('../models/users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

router.post('/register', async (req, res) => {
    console.log(req.body);

    const checkEmail = await User.findOne({email: req.body.email});
    if(checkEmail) return res.status(400).send('Email already taken');
    if(!req.body.password || req.body.password.length==0) return res.status(400).send('You must submit a password')
    if(req.body.password!=req.body.confirmPassword) return res.status(400).send('Passwords must match')

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        email: req.body.email,
        displayName: req.body.displayName,
        password: hashPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch(err) {
        res.status(400).send(err);
    }
});

//Login user, add auth-token to header
router.post('/login', async (req, res) => {
    
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send({message:'Email does not exists'});
    

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send({message:'Invalid password!'});

    //JWT
    const token = jwt.sign({_id: user._id, displayName: user.displayName}, 'secretkey');
    res.header('auth-token', token).send({token: token});
    console.log('User logged in!');
});

module.exports = router;