// Route middleware: rejects a non-numeric or non-positive :id with 400.
// On success it calls next(), so Express runs the next handler for the route.
const validateID = (req, res, next) => {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
        return res.status(400).json({
            message: `Invalid id '${req.params.id}'. Must be a positive integer.`,
        });
    }
    next();
};

export default validateID;
