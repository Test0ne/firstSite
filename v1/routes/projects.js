const express = require('express')
const router = express.Router()
const { project } = require('../data')

router.get('/', (req, res) => {
    req.json(projects)
})

router.get('/:projectID', setProject, ((req, res) => {
    req.json(req.project)
}))

function setProject (req, res, next) {
    const projectId = parseInt(req.params.projectId)
    req.project = projects.find(project => project.id === projectId)

    if (req.project == null) {
        res.status(404)
        return res.send('Project not found')
    }
    next()
    
}

module.exports = router