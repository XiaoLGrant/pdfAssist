const FLTemplates = require('../models/FLTemplates')
const Customers = require('../models/Customers')

module.exports = {
    getCreateFLTemplate: async (req,res)=>{
        try {
            const flTemplates = await FLTemplates.find().sort({countyName: 1, tierName: 1})
            const customers = await Customers.find({userID: req.user.id}).sort({customerName: 1})
            res.render('createFlAlias.ejs', {templates: flTemplates, customerList: customers})
        } catch(err) {
            console.log(err)
        } 
    }
}