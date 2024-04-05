const routerBlog = require("express").Router();
const {createBlogData, getBlogDdata} = require ('../controller/BlogDataController')
const apicache  = require('apicache');
const cache = apicache.middleware;
routerBlog.post("/insertBlogData",createBlogData);
routerBlog.get("/getBlogData", cache('5 minutes'), getBlogDdata);

module.exports = routerBlog;


