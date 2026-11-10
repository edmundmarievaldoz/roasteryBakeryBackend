// Imports---------------------------
import { Router } from 'express';
import Controller from '../Controller.js';
import model from '../models/recipe-model.js';
import database from '../database.js';
import makeRouter from './makeRouter.js';

// Controller ------------------------

const controller = new Controller(model, database);

// Router ----------------------------

const router = new Router();

// Bespoke Endpoints -----------------
// Registered before the generic routes, because makeRouter's GET / never calls next().

// GET /api/recipes?status=Pending|Approved|Rejected
router.get('/', (req, res, next) => {
    const { status } = req.query;
    if (status === undefined) return next(); // no filter: generic list
    if (!model.statuses.includes(status)) {
        return res.status(400).json({
            message: `Invalid status '${status}'. Allowed values: ${model.statuses.join(', ')}.`,
        });
    }
    controller.get(req, res, 'status');
});

// Generic Endpoints -----------------

router.use(makeRouter(controller));

export default router;
