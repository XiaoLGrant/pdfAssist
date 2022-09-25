const express = require('express')
const router = express.Router()
const addTemplateController = require('../controllers/createFlAlias')

router.get('/', addTemplateController.getFLTemplateCreator)

// router.post('/createTemplate', addTemplateController.createTemplate)

// router.put('/markComplete', addTemplateController.createCustomerContact)

module.exports = router