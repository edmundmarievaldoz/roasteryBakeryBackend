// Imports---------------------------
import Controller from '../Controller.js';
import model from '../models/recipe-model.js';
import database from '../database.js';
import makeRouter from './makeRouter.js';

// Controller ------------------------

const controller = new Controller(model, database);

// Router ----------------------------

const router = makeRouter(controller);

// Bespoke Endpoints -----------------

export default router;