const express = require('express')
const router = express.Router()
const upload = require("../middleware/multer");
const templateController = require('../controllers/createTemplate')

router.get('/add', templateController.getAddTemplate)

router.post('/add/tx', upload.single("file"), templateController.uploadTxTemplate)

module.exports = router