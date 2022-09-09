const FLTemplates = require('../models/FLTemplates')
const Customers = require('../models/Customers')

module.exports = {
    getAddTemplate: async (req,res)=>{
        try{
            const flTemplates = await FLTemplates.find().sort({
                countyName: 1,
                tierName: 1
            })
            res.render('createTemplate.ejs', {flTemplates: flTemplates})
        }catch(err){
            console.log(err)
        }
    },
    createTemplate: async (req, res)=>{
        try{
            await FLTemplates.create({
                stateName: req.body.stateName, 
                countyName: req.body.countyName, 
                docText: req.body.docText, 
                tier: req.body.filingTier})
            console.log('Template added')
            res.redirect('/createTemplate')
        }catch(err){
            console.log(err)
        }
    },
    createCustomerContact: async (req, res)=>{
        try{
            await Customers.create({
                customerName: req.body.customerName, 
                nickname: req.body.customerNickname, 
                email: req.body.customerEmail
            })
            console.log('Customer contact added')
            res.redirect('/createTemplate')
        }catch(err){
            console.log(err)
        }
    }
}    