const FLTemplates = require('../models/FLTemplates')
const TXTemplates = require('../models/TXTemplates')
const Customers = require('../models/Customers')
const User = require('../models/User')

module.exports = {
    getIndex: async (req,res)=>{
        try {
            const flTemplates = await FLTemplates.find().sort({countyName: 1, tierName: 1})
            const filteredFlTemplates = await flTemplates.reduce((acc, c) => {
                if (c.private === false) {
                    if (!acc[c.countyName]) {
                        acc[c.countyName] = 0
                    }
                    acc[c.countyName]++ 
                }
                return acc
            }, {})

            const txTemplates = await TXTemplates.find().sort({templateType: 1})
            const publicTxTemplates = txTemplates.filter(template => template.private === false)
            
            res.render('index.ejs', {flTemplates: filteredFlTemplates, txTemplates: publicTxTemplates})
        } catch(err) {
            console.log(err)
        } 
    },
    getDashboard: async (req,res)=>{
        try {
            const customers = await Customers.find({userID: req.user.id}).sort({customerName: 1})
            const user = await User.find({_id: req.user.id})
            res.render('dashboard.ejs', {customerList: customers, userInfo: user})
        } catch(err) {
            console.log(err)
        } 
    },
    getEditUser: async (req, res) => {
        try {
            const userId = req.params.id
            const user = await User.find({_id: userId})
            res.render('editUser.ejs', {userInfo: user})
        } catch(err) {
            console.log(err)
        }
    },
    updateUserAddress: async (req, res) => {
        try {
            await User.findOneAndUpdate({_id: req.params.id}, {
                businessName: req.body.businessName,
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip,
                letterHeading: req.body.letterHeading
            })
            console.log('User return address updated')
            res.redirect('/dashboard')
        } catch(err) {
            console.log(err)
        }
    },
    getUserInfo: async (req, res) => {
        try {
            const user = await User.find({_id: req.params.id})
            res.json(user)
        } catch(err) {
            console.log(err)
        }
    },
    getSummonsJson: async (req, res) => {
        try {
            const county = req.params.county.toLowerCase()
            const tier = req.params.tier.toLowerCase()
            const template = await FLTemplates.find({countyName: county, tier: tier})
            console.log(template)
            res.json(template)
        } catch(err) {
            console.log(err)
        }
    },
    getCustomer: async (req, res) => {
        try {
            const customer = await Customers.find({_id: req.params.id})
            res.render('editCustomer.ejs', {customerInfo: customer})
        } catch(err) {
            console.log(err)
        }
    },
    updateCustomer: async (req, res) => {
        try {
            await Customers.findOneAndUpdate({_id: req.params.id}, {
                customerName: req.body.customerName, 
                email: req.body.customerEmail, 
                address1: req.body.address1, 
                address2: req.body.address2, 
                city: req.body.city, 
                state: req.body.state, 
                zip: req.body.zip, 
                userID: req.user.id
            })
            console.log('Customer updated')
            res.redirect('/dashboard')
        } catch(err) {
            console.log(err)
        }
    },
    deleteCustomer: async (req, res) => {
        try {
            await Customers.remove({_id: req.params.id})
            console.log('Customer deleted')
            res.redirect('/dashboard')
        } catch(err) {
            console.log(err)
        }
    },
    addCustomer: async (req, res) => {
        try {
            await Customers.create({
                customerName: req.body.customerName, 
                email: req.body.customerEmail, 
                address1: req.body.address1, 
                address2: req.body.address2, 
                city: req.body.city, 
                state: req.body.state, 
                zip: req.body.zip, 
                userID: req.user.id})
            console.log('Customer has been added.')
            res.redirect('/dashboard/#customersSection')
        } catch(err) {
            console.log(err)
        }
    },
    getCustomerEmail: async (req, res) => {
        try {
            const customer = await Customers.find({_id: req.params.id})
            res.json(customer)
        } catch(err) {
            console.log(err)
        }
    }
}