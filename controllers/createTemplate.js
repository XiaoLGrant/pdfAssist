const cloudinary = require("../middleware/cloudinary");
const FLTemplates = require('../models/FLTemplates')
const TXTemplates = require('../models/TXTemplates')
const Customers = require('../models/Customers')

module.exports = {
    getAddTemplate: async (req,res)=>{
        try{
            const flTemplates = await FLTemplates.find().sort({
                countyName: 1,
                tierName: 1
            })
            const txTemplates = await TXTemplates.find().sort({
                templateType: 1
            })
            res.render('createTemplate.ejs', {flTemplates: flTemplates, txTemplates: txTemplates})
        }catch(err){
            console.log(err)
        }
    },
    uploadTxTemplate: async (req, res)=>{
        try{
            const result = await cloudinary.uploader.upload(req.file.path)

            await TXTemplates.create({
                templateType: req.body.templateName, 
                stateName: req.body.state, 
                cloudinaryId: result.public_id, 
                file: result.secure_url,
                deleted: false,
                user: req.user.id,
                createdOn: new Date().toLocaleDateString()
            })
            console.log('Tx Template has been added')
            res.redirect('/templates/add')
        }catch(err){
            console.log(err)
        }
    }
}    