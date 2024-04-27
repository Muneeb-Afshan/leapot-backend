const routerJob = require("express").Router();
const {createJobData, getJobData, getJobDataById} = require ('../controller/JobDataController')
const {JobApplication} = require('../controller/JobApplicationDataController')


const apicache = require('apicache');
const cache = apicache.middleware;
routerJob.post("/insertJobData", createJobData);
routerJob.get("/getJobData", cache('5 min'), getJobData);
routerJob.get("/getJobData/:id", cache('5 min'), getJobDataById);
routerJob.post("/addJobApplication", JobApplication);   

module.exports = routerJob;