const express = require('express');

const { getAppointments, getAppointment, addAppointment, updateAppointment, cancelAppointment } = require('../controllers/appointment');

const router = express.Router({ mergeParams: true });

const { needLogin, authorize } = require('../middleware/auth');

router.route('/')
    .get(needLogin, getAppointments)
    .post(needLogin, authorize('admin', 'customer'), addAppointment);

router.route('/:id')
    .get(needLogin, getAppointment)
    .put(needLogin, authorize('admin', 'customer'), updateAppointment)
    .delete(needLogin, authorize('admin', 'customer'), cancelAppointment);

module.exports = router;