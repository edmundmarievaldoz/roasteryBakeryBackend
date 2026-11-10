// Imports---------------------------
import Controller from '../Controller.js';
import model from '../models/recipereview-model.js';
import database from '../database.js';
import makeRouter from './makeRouter.js';

// Controller ------------------------

const controller = new Controller(model, database);

// Router ----------------------------

const router = makeRouter(controller);

// Bespoke Endpoints -----------------

// GET /api/recipereviews/recipe/:id (review history, newest first)
router.get('/recipe/:id', (req, res) => {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
        return res.status(400).json({
            message: `Invalid recipe id '${req.params.id}'. Must be a positive integer.`,
        });
    }
    controller.get(req, res, 'recipe');
});

export default router;
