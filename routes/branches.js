const express = require('express');

const areas = require("./areas");
const { getBranches, getBranch, createBranch, updateBranch, deleteBranch } = require('../controllers/massageBranch');

const router = express.Router();

const { needLogin, authorize } = require('../middleware/auth');

router.use("/:branchId/areas", areas);

router.route('/')
    .get(getBranches)
    .post(needLogin, authorize('admin'), createBranch);

router.route('/:id')
    .get(getBranch)
    .put(needLogin, authorize('admin'), updateBranch)
    .delete(needLogin, authorize('admin'), deleteBranch);

module.exports = router;