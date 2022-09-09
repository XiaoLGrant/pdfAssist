const express = require('express')
const router = express.Router()
const editTemplateController = require('../controllers/editTemplate')

router.get('/', editTemplateController.getEditTemplate)

router.put('/updateTemplate/:id', editTemplateController.updateTemplate)

router.put('/updateCustomer/:nickname', editTemplateController.updateCustomer)

router.delete('/deleteTemplate/:id', editTemplateController.deleteTemplate)

module.exports = router