// Import ----------------------------
import {Router} from 'express';
import validateID from '../middleware/validateID.js';

const makeRouter = (controller) => {
    // Router -----------------------
    const router = new Router();

    //Generic Endpoints -------------

    router.get('/', (req, res) => controller.get(req, res, null));
    router.get('/:id', validateID, (req, res) => controller.get(req, res, 'primary'));
    router.post('/', controller.post);

    return router;
};

export default makeRouter;
