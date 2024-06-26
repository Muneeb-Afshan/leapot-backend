const UserHistory = require("../../model/UserHistorySchema");
const User = require("../../model/UserSchema");

// exports.getUserHistory = async (req, res) => {
//   try {
//     const userHistory = await UserHistory.find().sort({ TimeofAction: -1 });

//     if (!userHistory.length) {
//       return res.status(404).json({ message: "No users history found" });
//     }

//     res.status(200).json(userHistory);
//   } catch (error) {
//     console.error("Error fetching user history:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.getUserHistory = async (req, res) => {
  try {
    const userHistory = await UserHistory.find({}).sort({ SrNo: -1 });
    res.json(userHistory);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user history" });
  }
};

exports.createImportHistory = async (req, res) => {
  const { userid, SuccessfulRecords, FailedRecords } = req.body;

  try {
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const lastHistory = await UserHistory.findOne().sort({ SrNo: -1 });
    const SrNo = lastHistory ? lastHistory.SrNo + 1 : 1;

    const newImportHistory = new UserHistory({
      SrNo,
      userid: user._id,
      SuccessfulRecords,
      FailedRecords,
    });

    await newImportHistory.save();
    res.status(201).json(newImportHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
