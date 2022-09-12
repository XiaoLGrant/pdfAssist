const cloudinary = require("../middleware/cloudinary");
const FLTemplates = require('../models/FLTemplates');
const TXTemplates = require('../models/TXTemplates');
const Customers = require('../models/Customers');

module.exports = {
    getTemplates: async (req,res)=>{
        try{
            const flTemplates = await FLTemplates.find().sort({
                countyName: 1,
                tierName: 1
            });
            const txTemplates = await TXTemplates.find().sort({
                templateType: 1
            });
            res.render('templateDashboard.ejs', {flTemplates: flTemplates, txTemplates: txTemplates});
        }catch(err){
            console.log(err);
        }
    },

    //Fl Templates
    uploadFlTemplate:async (req, res)=>{
        try{
            const result = await cloudinary.uploader.upload(req.file.path);

            await FLTemplates.create({
                templateType: req.body.templateType, 
                stateName: req.body.state,
                countyName: req.body.county,
                tier: req.body.tier,
                cloudinaryId: result.public_id, 
                file: result.secure_url,
                deleted: false,
                user: req.user.id,
                createdOn: new Date().toLocaleDateString()
            });
            console.log('FL template has been added');
            res.redirect('/templates');
        }catch(err){
            console.log(err);
        }
    },
    deleteFlTemplate: async (req, res) => {
        try {
            const template = await FLTemplates.findById({ _id: req.params.id });
            await cloudinary.uploader.destroy(template.cloudinaryId);
            await FLTemplates.remove({ _id: req.params.id });
            console.log("Deleted template");
            res.redirect("/templates");
        } catch (err) {
            res.redirect("/templates");
        }
    },

    //Tx Templates
    uploadTxTemplate: async (req, res)=>{
        try{
            const result = await cloudinary.uploader.upload(req.file.path);

            await TXTemplates.create({
                templateType: req.body.templateName, 
                stateName: req.body.state, 
                cloudinaryId: result.public_id, 
                file: result.secure_url,
                deleted: false,
                user: req.user.id,
                createdOn: new Date().toLocaleDateString()
            });
            console.log('Tx Template has been added');
            res.redirect('/templates');
        }catch(err){
            console.log(err);
        }
    },
    deleteTxTemplate: async (req, res) => {
        try {
            const template = await TXTemplates.findById({ _id: req.params.id });
            await cloudinary.uploader.destroy(template.cloudinaryId);
            await TXTemplates.remove({ _id: req.params.id });
            console.log("Deleted template");
            res.redirect("/templates");
        } catch (err) {
            res.redirect("/templates");
        }
      }
}    