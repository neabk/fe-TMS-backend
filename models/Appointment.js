const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MassageBranch',
        required: true
    },

    areaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
        required: true
    },

    service: {
        type: String,
        required: true
    },

    timeStart: {
        type: Date,
        required: true
    },

    timeEnd: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'canceled', 'accepted', 'completed'],
        default: 'pending'
    }
});

module.exports = mongoose.model('Appointment', Schema);
