const Appointment = require('../models/Appointment');
const MassageBranch = require('../models/MassageBranch');

exports.getBranches = async (req, res, next) => {
    let query;
    const reqQuery = { ...req.query };

    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = MassageBranch.find(JSON.parse(queryStr)) // .populate("areas");
    if (req.user?.role == "admin") {
        query.populate('appointments');
    }

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        const total = await MassageBranch.countDocuments();
        query = query.skip(startIndex).limit(limit);
        const massageShops = await query;
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }
        console.log(req.query);
        res.status(200).json({ success: true, count: massageShops.length, pagination, data: massageShops });
    } catch (e) {
        console.log(e);
        res.status(400).json({ success: false });
    }
};

exports.getBranch = async (req, res, next) => {
    try {
        const massageShop = await MassageBranch.findById(req.params.id);
        if (!massageShop) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: massageShop });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

exports.createBranch = async (req, res, next) => {
    const massageShop = await MassageBranch.create(req.body);
    res.status(201).json({ success: true, data: massageShop });
}

exports.updateBranch = async (req, res, next) => {
    try {
        const massageBranch = await MassageBranch.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!massageBranch) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: massageBranch });
    } catch (e) {
        res.status(400).json({ success: false });
    }
};

exports.deleteBranch = async (req, res, next) => {
    try {
        const massageBranch = await massageBranch.findById(req.params.id);

        if (!massageBranch) {
            return res.status(400).json({ success: false, message: `MassageBranch not found with id of ${req.params.id}` });
        }
        await Appointment.deleteMany({ massageBranch: req.params.id });
        await MassageBranch.deleteOne({ _id: req.params.id });
        res.status(200).json({ success: true, data: {} });
    }
    catch (err) {
        res.status(400).json({ success: false });
    }
};