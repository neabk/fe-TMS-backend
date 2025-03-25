const express = require('express');

const { getAreas, getArea, createArea, updateArea, deleteArea } = require('../controllers/area');

const router = express.Router({ mergeParams: true });

const { needLogin, authorize } = require('../middleware/auth');

router.route('/')
    .get(needLogin, authorize('admin'), getAreas)
    .post(needLogin, authorize('admin'), createArea);

router.route('/:id')
    .get(needLogin, authorize('admin'), getArea)
    .put(needLogin, authorize('admin'), updateArea)
    .delete(needLogin, authorize('admin'), deleteArea);

module.exports = router;