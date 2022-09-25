const FLTemplates = require('../models/FLTemplates')
const Customers = require('../models/Customers')

module.exports = {
    getFLTemplateCreator: async (req,res)=>{
        try {
            const flTemplates = await FLTemplates.find().sort({countyName: 1, tierName: 1})
            const customers = await Customers.find({userID: req.user.id}).sort({customerName: 1})
            const filteredTemplates = await flTemplates.reduce((acc, c) => {
                if (!acc[c.countyName]) {
                    acc[c.countyName] = 0
                }
                acc[c.countyName]++
                return acc
            }, {})
            res.render('createFlAlias.ejs', {templates: flTemplates, customerList: customers, filteredTemplates: filteredTemplates})
        } catch(err) {
            console.log(err)
        } 
    }
}