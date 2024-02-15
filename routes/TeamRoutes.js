const routerTeam = require("express").Router();
const {createTeamData ,getTeamDetails} = require('../controller/TeamDetailsController')


routerTeam.post("/inserteamdata",createTeamData);
routerTeam.get("/getteamdata",getTeamDetails);

module.exports = routerTeam;