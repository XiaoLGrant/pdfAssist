const express = require('express')
const router = express.Router()
const addTemplateController = require('../controllers/createTxAlias')

router.get('/', addTemplateController.getCreateTxAlias)

// router.post('/createTemplate', addTemplateController.createTemplate)

// router.put('/markComplete', addTemplateController.createCustomerContact)

module.exports = router