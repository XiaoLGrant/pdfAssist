const FLTemplates = require('../models/FLTemplates')

module.exports = {
    getCreateFLTemplate: async (req,res)=>{
        try {
            const flTemplates = await FLTemplates.find().sort({countyName: 1, tierName: 1})
            res.render('createFlAlias.ejs', {info: flTemplates})
        } catch(err) {
            console.log(err)
        } 
    }
}