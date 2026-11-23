// Imports---------------------------
import { Router } from 'express';
import Controller from '../Controller.js';
import model from '../models/recipe-model.js';
import allergenModel from '../models/allergen-model.js';
import database from '../database.js';
import makeRouter from './makeRouter.js';
import validateID from '../middleware/validateID.js';

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
router.get('/:id/allergens', validateID, (req, res) => allergenController.get(req, res, 'recipe'));

// POST /api/recipes (validation only)
// Body: { recipeName, recipeCreatedBy }
// On success it calls next(), so makeRouter's generic POST / inserts the recipe.
router.post('/', async (req, res, next) => {
    // Validate body format ----------
    const body = req.body;
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({ message: 'Request body must be a JSON object.' });
    }

    const { recipeName, recipeCreatedBy } = body;

    if (typeof recipeName !== 'string' || recipeName.trim() === '') {
        return res.status(400).json({ message: 'recipeName must be a non-empty string.' });
    }
    body.recipeName = recipeName.trim();

    if (!Number.isInteger(recipeCreatedBy) || recipeCreatedBy <= 0) {
        return res.status(400).json({ message: 'recipeCreatedBy must be a positive integer.' });
    }

    // Validate creator exists -------
    try {
        const [users] = await database.query(model.buildUserExistsQuery(), { recipeCreatedBy });
        if (users.length === 0) {
            return res.status(400).json({ message: `User ${recipeCreatedBy} does not exist.` });
        }
    } catch (error) {
        console.log('SQL ERROR:', error);
        return res.status(500).json({ message: `Failed to check user: ${error.message}` });
    }

    next();
});

// Generic Endpoints -----------------

router.use(makeRouter(controller));

export default router;
