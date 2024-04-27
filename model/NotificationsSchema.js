const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationTemplateSchema = new mongoose.Schema({

  TemplateName :{
    type: String ,
    required: true
    
   } ,
   NotificationBody : {
    type : String,
    require: true
   } ,
   isDeleted: { type: Boolean, default: false }
});


module.exports = {
  NotificationTemplates: mongoose.model('NotificationTemplate', NotificationTemplateSchema),
};
