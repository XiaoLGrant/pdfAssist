const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 
const homeController = require('../controllers/home')
const { ensureAuth } = require('../middleware/auth')

router.get('/', homeController.getIndex)
router.get('/summons/:county&:tier', homeController.getSummonsJson)
router.get('/dashboard', ensureAuth, homeController.getDashboard)
router.post('/dashboard/addCustomer', ensureAuth, homeController.addCustomer)
router.get('/user/:id', homeController.getEditUser)
router.put('/user/:id', homeController.updateUserAddress)
router.get('/customer/:id', homeController.getCustomer)
router.put('/customer/:id', homeController.updateCustomer)
router.delete('/customer/delete', homeController.deleteCustomer)

router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/logout', authController.logout)
router.get('/signup', authController.getSignup)
router.post('/signup', authController.postSignup)

module.exports = router