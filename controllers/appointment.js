const Appointment = require('../models/Appointment');
const MassageBranch = require('../models/MassageBranch');
const Area = require('../models/Area');
const User = require('../models/User');

//Update customer rank by counting service times use
async function handleCustomerRank(customerId) {
    const apptService = await Appointment.find({
        userId: customerId,
        status: "completed"
    });

    let rank = "The Basic"

    if (apptService.length >= 3) {
        rank = "The Legacy"
    } else if (apptService.length >= 2) {
        rank = "The Elite"
    } else if (apptService.length >= 1) {
        rank = "The Super"
    }
    
    console.log(rank);

    await User.findByIdAndUpdate(
        customerId,
        {
            "customerRank": rank
        },
        {
            new: true,
            runValidators: true
        }
    );
}

// @desc    Get All appointments
// @route   GET /api/v1/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
    let query;

    if (req.user.role !== 'admin') {
        query = Appointment.find({ userId: req.user.id });
    } else {
        if (req.query.branchId) {
            console.log(req.query.branchId);
            query = Appointment.find({ branchId: req.query.branchId });
        }
        else {
            query = Appointment.find()
        }
    }

    query.populate({
        path: 'branchId areaId userId'
    });

    try {
        const appointments = await query;

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find Appointment" });
    }
};

// @desc    Get single appointment
// @route   GET /api/v1/appointment
// @access  Private
exports.getAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'branchId areaId userId'
        });

        if (req.user.role !== 'admin' && appointment.userId._id != req.user.id) {
            throw new Error("")
        }

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: `No appointment with the id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find Appointment" });
    }
};

// @desc    Add appointment
// @route   POST /api/v1/appointment/
// @access  Private
exports.addAppointment = async (req, res, next) => {
    try {
        // req.body.branchId = req.params.branchId;

        // const branch = await MassageBranch.findById(req.body.branchId);

        // if(!branch){
        //     return res.status(404).json({success: false, message:`No Massage Branch with the id of ${req.params.branchId}`});
        // }

        req.body.userId = req.user.id;

        const existedAppointments = await Appointment.find({ userId: req.user.id });
        console.log(existedAppointments);

        let upCommingCount = 0;
        existedAppointments.forEach((item) => {
            if (item.status == "pending" || item.status == "accepted") upCommingCount++;
        })

        if (upCommingCount >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({ success: false, message: `The user with ID ${req.user.id} has already made 3 appointments` })
        }

        const appointment = await Appointment.create(req.body);
        res.status(200).json({
            success: true,
            data: appointment
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot create Appointment" });
    }
}

// @desc    Update appointment
// @route   PUT /api/v1/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res, next) => {
    try {
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: `No appointment with the id of ${req.params.id}`
            });
        }

        //Make sure user is the appointment owner
        if (appointment.userId.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this appointment`
            })
        }

        if (req.user.role !== "admin") {
            req.body.status = "pending";
        }

        appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        await handleCustomerRank(appointment.userId);

        res.status(200).json({
            success: true,
            data: appointment
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot update Appointment"
        });
    }
};

// @desc    Delete appointment
// @route   DELETE /api/v1/appointment
// @access  Private
exports.cancelAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: `No appointment with the id of ${req.params.id}` });
        }

        if (appointment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to cancel this appointment` });
        }

        appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                status: "canceled"
            },
            {
                new: true,
                runValidators: true
            }
        );

        await handleCustomerRank(appointment.userId);

        res.status(200).json({
            success: true,
            data: {}
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot cancel Appointment" });
    }
};