const express = require('express');
const router = express.Router();
const project = require('./projects.model');
const user = require('../users/users.model');
const task = require('../tasks/tasks.model');
const verify = require('../verifyToken');
const jwt_decode = require('jwt-decode')
var middleware = require('../middleware');

router.get('/', verify, async (req, res) => {
    try {
        const currentUserId = (jwt_decode(req.header('auth-token')))._id;
        const projects = await project.find({users: currentUserId});
        console.log(projects);
        res.json({projects: projects});        
    } catch(err) {
        res.status(400).json({message: err.message});
    }

});

router.get('/:id/tasks', verify, middleware.getProject, async (req, res) => {
    const currentUserId = (jwt_decode(req.header('auth-token')))._id
    const projectParent = res.project;
    console.log(projectParent)
    const usersFound = await user.find({_id: projectParent.users});
    var isAdmin = false
    if(projectParent.admins.find(userId => userId==currentUserId))
        isAdmin = true
    console.log(isAdmin);

    var users = [];
    usersFound.forEach((user) => {
        users.push({id: user._id, userName: user.displayName})
    })
    res.json({data: res.project.tasks, users, isAdmin});
    console.log(res.json);
    console.log('Project tasks fetched');

})

router.post('/', verify, async (req, res) => {
    console.log('Access attempt')
    console.log(req.header('auth-token'))
    try {
        const currentUserId = (jwt_decode(req.header('auth-token')))._id;
        console.log(currentUserId);
        const createProject = new project({
            projectName: req.body.projectName,
            admins: currentUserId,
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

router.post('/:id/tasks', verify, middleware.getProject, async (req,res) => {
    console.log('Add attempt');
    console.log(req.body);
    const newTask = new task({
        taskName: req.body.taskName,
        endDate: new Date(req.body.endDate),
        taskHolder: req.body.taskHolder

    });
    const projectParent = res.project;
    
    try {
        projectParent.tasks.push(newTask);
        await projectParent.save();
        res.json({message: 'Task has been added to the project'});
    } catch(err) {
        res.status(500).send({message: err.message});
    }
});

router.delete('/:id/tasks/:taskId', verify, middleware.getTask, async (req, res) => {
    var task = res.task;
    console.log('trying to remove');
    //console.log(product);
    try{
        await project.updateOne({_id: req.params.id}, {$pullAll: {tasks:[task]}});
    } catch(err) {
        console.log(err.message);
    }
    
});

router.delete('/:id/users/:userId', verify, middleware.getProject, async (req, res) => {
    console.log('Trying to delete a user')
    var oneProject = res.project;
    if(oneProject.tasks.filter(task => task.taskHolder === req.params.userId).length > 0){
        return res.status(400).send({message:'That user still holds tasks and cannot be deleted from this project'});
    }
    try{
        await project.update({_id: req.params.id}, {$pull: {users: req.params.userId}})
        res.json({message: 'User has been deleted from this project'})
    }
    catch(err) {}
});

router.post('/:id/users', verify, middleware.getProject, async (req, res) => {
    const project = res.project;
    console.log(req.body);
    const addedUser = await user.findOne({email: req.body.email})
    if(!addedUser) return res.status(400).send({message:'That user does not exists'});


        project.users.push({_id: addedUser._id});
        await project.save();
        console.log('Added ' + addedUser.displayName)

})

module.exports = router;