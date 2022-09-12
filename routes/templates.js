const express = require('express')
const router = express.Router()
const upload = require("../middleware/multer");
const templateController = require('../controllers/templates')

router.get('/', templateController.getTemplates)

router.post('/add/fl', upload.single("file"), templateController.uploadFlTemplate)
router.delete('/delete/fl/:id', templateController.deleteFlTemplate)

router.post('/add/tx', upload.single("file"), templateController.uploadTxTemplate)
router.delete('/delete/tx/:id', templateController.deleteTxTemplate)

module.exports = router