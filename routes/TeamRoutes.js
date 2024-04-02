const routerTeam = require("express").Router();
const {createTeamData ,getTeamDetails} = require('../controller/TeamDetailsController')
const apicache = require('apicache');
const cache = apicache.middleware;
routerTeam.post("/insertTeamData",createTeamData);
routerTeam.get("/getTeamData",cache('5 minutes'),getTeamDetails);

module.exports = routerTeam;