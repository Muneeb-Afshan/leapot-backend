const routerTeam = require("express").Router();
const {createTeamData ,getTeamDetails} = require('../controller/TeamDetailsController')


routerTeam.post("/insertTeamData",createTeamData);
routerTeam.get("/getTeamData",getTeamDetails);

module.exports = routerTeam;