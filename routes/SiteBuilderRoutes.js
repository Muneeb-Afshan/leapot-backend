const RouterSiteBuilder = require("express").Router();
const { getAllTemplates, addTemplate, addUserSavedTemplate, getUserSavedTemplates, deleteTemplate, getTemplateById, updateTemplateById } = require('../controller/SiteBuilder/SiteBuilderController')

const apicache = require('apicache');
const cache = apicache.middleware;

RouterSiteBuilder.get("/getTemplate",cache('5 minutes'), getAllTemplates);
RouterSiteBuilder.get("/getTemplateById/:id",cache('5 minutes'), getTemplateById);
RouterSiteBuilder.post("/addPages", addTemplate);
RouterSiteBuilder.post("/addUserSavedTemplate", addUserSavedTemplate);
RouterSiteBuilder.get("/getUserSavedTemplates",cache('5 minutes'), getUserSavedTemplates);
RouterSiteBuilder.delete("/deleteTemplate/:id", deleteTemplate);
RouterSiteBuilder.put("/updateTemplateById/:id", updateTemplateById);

module.exports = RouterSiteBuilder;