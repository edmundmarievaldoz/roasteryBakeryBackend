// Imports---------------------------
import { Router } from 'express';
import Controller from '../Controller.js';
import model from '../models/recipe-model.js';
import allergenModel from '../models/allergen-model.js';
import database from '../database.js';
import makeRouter from './makeRouter.js';

// Controller ------------------------

const controller = new Controller(model, database);
const allergenController = new Controller(allergenModel, database);

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

// GET /api/recipes/:id/allergens
router.get('/:id/allergens', (req, res) => {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
        return res.status(400).json({
            message: `Invalid recipe id '${req.params.id}'. Must be a positive integer.`,
        });
    }
    allergenController.get(req, res, 'recipe');
});

// Generic Endpoints -----------------

router.use(makeRouter(controller));

export default router;
