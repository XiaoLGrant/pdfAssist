const express = require('express')
const router = express.Router()
const upload = require("../middleware/multer");
const templateController = require('../controllers/templates')

router.get('/', templateController.getTemplates)

router.post('/add/fl', upload.single("file"), templateController.uploadFlTemplate)
router.get('/update/fl/:id', templateController.viewUpdateFlTemplate)
router.put('/update/fl/:id', upload.single("file"), templateController.updateFlTemplate)
router.delete('/delete/fl/:id', templateController.deleteFlTemplate)

router.post('/add/tx', upload.single("file"), templateController.uploadTxTemplate)
router.get('/update/tx/:id', templateController.viewUpdateTxTemplate)
router.put('/update/tx/:id', upload.single("file"), templateController.updateTxTemplate)
router.delete('/delete/tx/:id', templateController.deleteTxTemplate)

module.exports = router