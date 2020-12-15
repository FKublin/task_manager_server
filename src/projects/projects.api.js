const express = require('express');
const router = express.Router();
const project = require('./projects.model');
const user = require('../users/users.model')
const verify = require('../verifyToken');
const jwt_decode = require('jwt-decode')
var middleware = require('../middleware');

router.get('/',/*verify, */ async (req, res) => {
    try {
        const currentUserId = (jwt_decode(req.header('auth-token')))._id;
        const projects = await project.find({users: currentUserId});
        console.log(projects);
        res.json({projects: projects});        
    } catch(err) {
        res.status(400).json({message: err.message});
    }

});

router.post('/', /*verify, */async (req, res) => {
    console.log('Access attempt')
    console.log(req.header('auth-token'))
    try {
        const currentUserId = (jwt_decode(req.header('auth-token')))._id;
        console.log(currentUserId);
        const createProject = new project({
            projectName: req.body.projectName,
            admin: currentUserId,
            users: currentUserId
        });

        const saveProject = await createProject.save();

        const currrentUser = await user.findById(currentUserId);
        currrentUser.projects.push({_id: saveProject._id});
        await currrentUser.save();
        
        res.status(201).json(saveProject); 

    } catch(err) {
        res.status(400).json({message: err.message});
    }
});

module.exports = router;