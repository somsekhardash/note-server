const { Router } = require('express')
const routesHandler = Router()

routesHandler.get('/', (req, res) => {
    const status = 200
    res.status(status).end()
})

routesHandler.get('/ping', function (req, res) {
    res.send('pong')
})

module.exports = routesHandler
