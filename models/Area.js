const mongoose = require('mongoose');

const facilitySchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please add a name"]
    },
    amount: {
        type: Number,
        reqire: [true, "Please add an amount"]
    }
})

const areaSchema = mongoose.Schema({
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MassageBranch',
        required: true
    },
    facility: {
        type: [facilitySchema],
    },
    status: {
        type: String,
        enum: ["available", "unavailable"],
        default: "available"
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

areaSchema.virtual("appointments", {
    ref: "Appointment",
    localField: "_id",
    foreignField: "areaId",
    justOne: false
})

module.exports = mongoose.model('Area', areaSchema);
