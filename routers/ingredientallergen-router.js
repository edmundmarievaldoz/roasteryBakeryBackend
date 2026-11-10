// Imports---------------------------
import Controller from '../Controller.js';
import model from '../models/ingredientallergen-model.js';
import database from '../database.js';
import makeRouter from './makeRouter.js';

// Controller ------------------------

const controller = new Controller(model, database);

// Router ----------------------------

const router = makeRouter(controller);

// Bespoke Endpoints -----------------
router.get('/ingredient/:id', (req, res) => controller.get(req, res, 'ingredient'));

export default router;