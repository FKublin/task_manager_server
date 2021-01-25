const project = require('../models/projects.model');

module.exports = {
    getProject:async function (req, res, next) {
        try {
            oneProject = await project.findById(req.params.id);
            if(oneProject == null) {
                return res.status(400).json({message: "Cannot find that project"});
    
            }
        } catch(err) {
            return res.status(500).json({message: err.message});
        }
    
        res.project = oneProject;
        next();
    },
    getTask:async function (req, res, next) {
        try {
            oneProject = await project.findById(req.params.id);
            oneTask = oneProject.tasks.id(req.params.taskId);
            
        } catch(err) {
            return res.status(500).json({message: err.message});
        }
        res.task = oneTask;
        res.project = oneProject;
        next();
    }
    
  };