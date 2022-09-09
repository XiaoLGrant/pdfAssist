const FLTemplates = require('../models/FLTemplates')
const Customers = require('../models/Customers')

module.exports = {
    getEditTemplate: async (req,res)=>{
        try{
            const flTemplates = await FLTemplates.find().sort({
                countyName: 1,
                tierName: 1
            })
            const customers = await Customers.find().sort({customerName: 1})
            res.render('editTemplate.ejs', {templateInfo: flTemplates, customerInfo: customers})
        }catch(err){
            console.log(err)
        }
    },
    updateTemplate: async (req, res)=>{
        try{
            await FLTemplates.findOneAndUpdate({_id: new ObjectId(`${req.params.id}`)},{
                stateName: req.body.stateName,
                countyName: req.body.countyName,
                tier: req.body.filingTier,
                docText: req.body.docText
            })
            console.log('Template updated')
            //res.json('Marked Complete')
            res.redirect('/editTemplate')
        }catch(err){
            console.log(err)
        }
    },
    updateCustomer: async (req, res)=>{
        try{
            await Customers.findOneAndUpdate({nickname: req.body.customerNickname},{ //change input to be from dropdown
                customerName: req.body.customerName,
                nickname: req.body.customerNickname, //change name to indicate updated nickname
                email: req.body.customerEmail
            })
            console.log('Customer updated')
            //res.json('Marked Incomplete')
            res.redirect('/editTemplate')
        }catch(err){
            console.log(err)
        }
    },
    deleteTemplate: async (req, res)=>{
        //console.log(req.body.todoIdFromJSFile)
        try{
            await Todo.findOneAndDelete({_id: new ObjectId(`${req.params.id}`)})
            console.log('Deleted template')
            res.json('Deleted template')
        }catch(err){
            console.log(err)
        }
    }
}    