const cloudinary = require("../middleware/cloudinary");
const FLTemplates = require('../models/FLTemplates');
const TXTemplates = require('../models/TXTemplates');
const User = require("../models/User");

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
            console.log(flTemplates[6])
            console.log(await req.user.id)
            res.render('templateDashboard.ejs', {flTemplates: flTemplates, txTemplates: txTemplates, user: req.user});
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
            res.redirect('/templates/#flTemplatesSection');
        }catch(err){
            console.log(err);
        }
    },
    viewUpdateFlTemplate: async (req,res)=>{
        try{
            const template = await FLTemplates.findById({ _id: req.params.id });
            console.log(template)
            res.render('editFlTemplate.ejs', {flTemplate: template});
        }catch(err){
            console.log(err);
        }
    },
    updateFlTemplate: async (req, res)=>{
        try{
            const template = await FLTemplates.findById({ _id: req.params.id });
            await cloudinary.uploader.destroy(template.cloudinaryId);
            const result = await cloudinary.uploader.upload(req.file.path);
            await FLTemplates.findOneAndUpdate({_id: req.params.id},
                {
                templateType: req.body.templateName, 
                stateName: req.body.stateName,
                countyName: req.body.county,
                tier: req.body.tier,
                cloudinaryId: result.public_id, 
                file: result.secure_url,
                deleted: false,
                user: req.user.id,
                createdOn: new Date().toLocaleDateString()
            });
            console.log('FL template has been updated');
            res.redirect('/templates/#flTemplatesSection');
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
            res.redirect("/templates/#flTemplatesSection");
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
            res.redirect('/templates/#txTemplatesSection');
        }catch(err){
            console.log(err);
        }
    },
    viewUpdateTxTemplate: async (req,res)=>{
        try{
            const template = await TXTemplates.findById({ _id: req.params.id });
            console.log(template)
            res.render('editTxTemplate.ejs', {txTemplate: template});
        }catch(err){
            console.log(err);
        }
    },
    updateTxTemplate: async (req, res)=>{
        try{
            const template = await TXTemplates.findById({ _id: req.params.id });
            await cloudinary.uploader.destroy(template.cloudinaryId);
            const result = await cloudinary.uploader.upload(req.file.path);
            await TXTemplates.findOneAndUpdate({_id: req.params.id},
                {
                templateType: req.body.templateName, 
                stateName: req.body.stateName, 
                cloudinaryId: result.public_id, 
                file: result.secure_url,
                deleted: false,
                user: req.user.id,
                createdOn: new Date().toLocaleDateString()
            });
            console.log('TX template has been updated');
            res.redirect('/templates/#txTemplatesSection');
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
            res.redirect("/templates/#txTemplatesSection");
        } catch (err) {
            res.redirect("/templates");
        }
      }
}    