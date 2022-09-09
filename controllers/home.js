const FLTemplates = require('../models/FLTemplates')
const Customers = require('../models/Customers')
const User = require('../models/User')

module.exports = {
    getIndex: async (req,res)=>{
        try {
            const templates = await FLTemplates.find()/*.sort({countyName: 1, tierName: 1})*/
            console.log(templates)
            res.render('index.ejs', {flTemplates: templates})
        } catch(err) {
            console.log(err)
        } 
    },
    getDashboard: async (req,res)=>{
        try {
            const templates = await FLTemplates.find().sort({countyName: 1, tierName: 1})
            const customers = await Customers.find({userID: req.user.id}).sort({customerName: 1})
            const user = await User.find({userID: req.user.id})
            console.log(templates)
            res.render('dashboard.ejs', {flTemplates: templates, customerList: customers, userInfo: user})
        } catch(err) {
            console.log(err)
        } 
    },
    getSummonsJson: async (req, res) => {
        const county = req.params.county.toLowerCase()
        const tier = req.params.tier.toLowerCase()
        try {
            const template = await FLTemplates.find({countyName: county, tier: tier})
            console.log(template)
            res.json(template)
        } catch(err) {
            console.log(err)
        }
    },
    addCustomer: async (req, res) => {
        try {
            await Customers.create({customerName: req.body.customerName, nickname: req.body.customerNickname, email: req.body.customerEmail, userID: req.user.id})
            console.log('Customer has been added.')
            res.redirect('/dashboard')
        } catch(err) {
            console.log(err)
        }
    }
}