const TxTemplates = require('../models/TXTemplates')
const Customers = require('../models/Customers')
const Users = require('../models/User')

module.exports = {
    getCreateTxAlias: async (req,res)=>{
        try {
            const templateData = await TxTemplates.find().sort({templateType: 1})
            const customers = await Customers.find({userID: req.user.id}).sort({customerName: 1})
            const userData = await Users.find({_id: req.user.id})
            res.render('createTxAlias.ejs', {templates: templateData, customerList: customers, user: userData})
        } catch(err) {
            console.log(err)
        } 
    }
}