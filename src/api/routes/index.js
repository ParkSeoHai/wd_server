const express = require('express')
const routes = express.Router()

routes.use('/api/v1', require('../v1/routes'));
// routes.use('/api/v2', require('./v2/routes'));

module.exports = routes;