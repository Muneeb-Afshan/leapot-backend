



const TeamDetails = require('../model/TeamDetailSchema');


exports.createTeamData = async (req, res) => {
    console.log(req.body)
    const { name , designation , description , image } = req.body;
    if (!(name && designation && description &&  image )) {
      return res.json({
        message: "all input feild require",
      });
    }
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

exports.getTeamDetails = async (req, res) => {
  try {
    const teams = await TeamDetails.find();
    res.json(
      {teams:teams,
       statusCode:200,
       message: "data get "
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
