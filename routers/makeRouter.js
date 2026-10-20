// Import ----------------------------
import {Router} from 'express';

const makeRouter = (controller) => {
    // Router -----------------------
    const router = new Router();

    //Generic Endpoints -------------

    router.get('/', (req, res) => controller.get(req, res, null));
    router.get('/:id', (req, res, next) =>  {
        if (!Number.isInteger(Number(req.params.id))) return next ('route');
        controller.get(req, res, 'primary')});

    return router;
};

export default makeRouter;