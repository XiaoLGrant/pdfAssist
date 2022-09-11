const TxTemplates = require('../models/TXTemplates')
const Customers = require('../models/Customers')

module.exports = {
    getCreateTxAlias: async (req,res)=>{
        try {
            const templateData = await TxTemplates.find().sort({templateType: 1})
            const customers = await Customers.find({userID: req.user.id}).sort({customerName: 1})
            res.render('createTxAlias.ejs', {templates: templateData, customerList: customers})
        } catch(err) {
            console.log(err)
        } 
    }
}