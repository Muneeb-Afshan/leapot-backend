
// controllers/statusController.js
const Status = require('../../model/BlacklistedStatusSchema');
// Controller functions
exports.getAllStatuses = async (req, res) => {
    try {
        const statuses = await Status.find();
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createStatus = async (req, res) => {
    const status = new Status({
        name: req.body.name
    });

    try {
        const newStatus = await status.save();
        res.status(201).json(newStatus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};