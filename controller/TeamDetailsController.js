


// controllers/dataController.js
const TeamDetails = require('../model/TeamDetailSchema');

exports.createTeamData = async (req, res) => {
    console.log(req.body)
  try {
    const newData = await TeamDetails.create(req.body);
    res.status(201).json({
        message:"sucesss",
        user:req.body

    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// controllers/teamController.js


exports.getTeamDetails = async (req, res) => {
  try {
    const teams = await TeamDetails.find();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
