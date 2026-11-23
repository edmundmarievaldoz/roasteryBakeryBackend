// Imports---------------------------
import Controller from '../Controller.js';
import model from '../models/recipeIngredient-model.js';
import database from '../database.js';
import makeRouter from './makeRouter.js';
import validateID from '../middleware/validateID.js';

// Controller ------------------------

const controller = new Controller(model, database);

// Router ----------------------------

const router = makeRouter(controller);

// Bespoke Endpoints -----------------
router.get('/recipe/:id', validateID, (req, res) => controller.get(req, res, 'recipe'));

export default router;
