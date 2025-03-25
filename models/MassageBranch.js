const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please add a name"]
    },
    rate: {
        type: Number,
        reqire: [true, "Please add rate"]
    }
})

const MassageBranchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
    },
    telephone: [
        {
            type: String,
            required: [true, "Please add a telephone"],
        }
    ],
    address: {
        type: String,
        required: [true, "Please add an address"],
    },
    openTime: {
        type: String,
        required: [true, "Please add a Open time"],
    },
    closeTime: {
        type: String,
        required: [true, "Please add a Close time"],
    },
    latitude: {
        type: Number,
        required: [true, "Please add a Latitude"],
    },
    longitude: {
        type: Number,
        required: [true, "Please add a Longitude"],
    },
    service: [serviceSchema]
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//Reserce populate with virtuals
MassageBranchSchema.virtual("appointments", {
    ref: "Appointment",
    localField: "_id",
    foreignField: "branchId",
    justOne: false
})

//Reserce populate with virtuals
MassageBranchSchema.virtual("areas", {
    ref: "Area",
    localField: "_id",
    foreignField: "branch",
    justOne: false
})


module.exports = mongoose.model('MassageBranch', MassageBranchSchema);
