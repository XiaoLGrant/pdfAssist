const express = require('express')
const router = express.Router()
const txTemplateController = require('../controllers/createTxAlias')

router.get('/', txTemplateController.getCreateTxAlias)

//router.post('/createTemplate', txTemplateController.createTxAlias)

// router.put('/markComplete', addTemplateController.createCustomerContact)

module.exports = router