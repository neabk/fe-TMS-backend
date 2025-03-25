const Area = require("../models/Area");

// @desc    Get All areas
// @route   GET /api/v1/branches/{branchId}/areas
// @access  Private
exports.getAreas = async (req, res, next) => {
    try {
        const areas = await Area.find({branch: req.params.branchId}).populate({
            path: "appointments"
        });
        res.status(200).json({ success: true, count: areas.length, data: areas });
    } catch (e) {
        console.log(e);
        res.status(400).json({ success: false });
    }
}

// @desc    Get area
// @route   GET /api/v1/branches/{branchId}/areas/{id}
// @access  Private
exports.getArea = async (req, res, next) => {
    try {
        const area = await Area.findOne({_id: req.params.id, branch: req.params.branchId}).populate({
            path: 'appointments'
        });

        if (!area) {
            return res.status(404).json({
                success: false,
                message: `No area with the id of ${req.params.id} in branch id of ${req.params.branchId}`
            });
        }

        res.status(200).json({
            success: true,
            data: area
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find area" });
    }
}

// @desc    Create Area
// @route   POST /api/v1/branches/{branchId}/areas
// @access  Private
exports.createArea = async (req, res, next) => {
    //TODO: add later
    try {
        req.body.branch = req.params.branchId;

        const areas = await Area.create(req.body);
        res.status(200).json({
            success: true,
            data: areas
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot create Area" });
    }

};

// @desc    Update Area
// @route   PUT /api/v1/branches/{branchId}/areas/{id}
// @access  Private
exports.updateArea = async (req, res, next) => {
    //TODO: add later
    try {
        let area = await Area.findById(req.params.id);

        if (!area) {
            return res.status(404).json({ success: false, message: `No area with the id of ${req.params.id}` });
        }

        area = await Area.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: area
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot update Appointment" });
    }
};

// @desc    Delete Area
// @route   DELETE /api/v1/branches/{branchId}/areas/{id}
// @access  Private
exports.deleteArea = async (req, res, next) => {
    try {
        const area = await Area.findById(req.params.id);

        if (!area) {
            return res.status(404).json({ success: false, message: `No area with the id of ${req.params.id}` });
        }

        await area.deleteOne();
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannnot delete area" });
    }
};