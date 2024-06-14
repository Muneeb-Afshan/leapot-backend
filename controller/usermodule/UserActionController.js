const UserAction = require("../../model/UserActionSchema");
const User = require("../../model/UserSchema");
const UserDetails = require("../../model/UserDetailsSchema");

// Function to log an action
exports.logAction = async (req, res) => {
  const { userid, action, remarks } = req.body;

  // Validate input
  if (!userid || !action) {
    return res.status(400).json({
      message: "User ID and action are required",
      success: false,
    });
  }

  try {
    // Check if user exists
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Create a new action
    const newAction = new UserAction({
      userid,
      action,
      remarks,
    });

    // Save the action
    await newAction.save();

    return res.status(201).json({
      message: "Action logged successfully",
      success: true,
      action: newAction,
    });
  } catch (error) {
    console.error("Error logging action:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Function to get all actions for a user
exports.getUserActions = async (req, res) => {
  const { userid } = req.params;

  try {
    // Check if user exists
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Fetch all actions for the user
    const actions = await UserAction.find({ userid }).sort({ actionTime: -1 });

    return res.status(200).json({
      message: "User actions fetched successfully",
      success: true,
      actions,
    });
  } catch (error) {
    console.error("Error fetching user actions:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
