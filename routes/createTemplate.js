const express = require('express')
const router = express.Router()
const addTemplateController = require('../controllers/createTemplate')

router.get('/', addTemplateController.getAddTemplate)

router.post('/createTemplate', addTemplateController.createTemplate)

router.put('/markComplete', addTemplateController.createCustomerContact)

module.exports = router