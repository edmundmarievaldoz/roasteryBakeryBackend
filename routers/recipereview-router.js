// Imports---------------------------
import { Router } from 'express';
import Controller from '../Controller.js';
import model from '../models/recipereview-model.js';
import database from '../database.js';
import makeRouter from './makeRouter.js';

// Controller ------------------------

const controller = new Controller(model, database);

// Router ----------------------------

const router = new Router();

// Bespoke Endpoints -----------------
// Registered before the generic routes, because makeRouter's POST / never calls next().

// GET /api/recipereviews/recipe/:id (review history, newest first)
router.get('/recipe/:id', (req, res) => {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
        return res.status(400).json({
            message: `Invalid recipe id '${req.params.id}'. Must be a positive integer.`,
        });
    }
    controller.get(req, res, 'recipe');
});

// POST /api/recipereviews (approve or reject a Pending recipe)
// Body: { recipeID, reviewerID, reviewStatus: 'Approved'|'Rejected', reviewComment? }
router.post('/', async (req, res) => {
    // Validate body format ----------
    const body = req.body;
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({ message: 'Request body must be a JSON object.' });
    }

    const { recipeID, reviewerID, reviewStatus, reviewComment } = body;
    const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

    if (!isPositiveInteger(recipeID)) {
        return res.status(400).json({ message: 'recipeID must be a positive integer.' });
    }
    if (!isPositiveInteger(reviewerID)) {
        return res.status(400).json({ message: 'reviewerID must be a positive integer.' });
    }
    if (!model.reviewStatuses.includes(reviewStatus)) {
        return res.status(400).json({
            message: `Invalid reviewStatus '${reviewStatus}'. Allowed values: ${model.reviewStatuses.join(', ')}.`,
        });
    }
    if (reviewComment !== undefined && reviewComment !== null && typeof reviewComment !== 'string') {
        return res.status(400).json({ message: 'reviewComment must be a string.' });
    }
    const comment = typeof reviewComment === 'string' ? reviewComment.trim() : '';
    if (reviewStatus === 'Rejected' && comment === '') {
        return res.status(400).json({ message: 'A rejection must include a non-empty reviewComment.' });
    }

    // Validate reviewer -------------
    try {
        const [reviewers] = await database.query(model.buildReviewerQuery(), { reviewerID });
        if (reviewers.length === 0) {
            return res.status(400).json({ message: `Reviewer ${reviewerID} does not exist.` });
        }
        if (reviewers[0].roleName !== 'Compliance Lead') {
            return res.status(400).json({ message: `User ${reviewerID} is not a Compliance Lead.` });
        }
    } catch (error) {
        console.log('SQL ERROR:', error);
        return res.status(500).json({ message: `Failed to check reviewer: ${error.message}` });
    }

    // Save review and recipe status together (transaction) --
    let insertId;
    let connection;
    try {
        connection = await database.getConnection();
        await connection.beginTransaction();

        const [recipes] = await connection.query(model.buildRecipeLockQuery(), { recipeID });
        if (recipes.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: `Recipe ${recipeID} does not exist.` });
        }
        if (recipes[0].recipeStatus !== 'Pending') {
            await connection.rollback();
            return res.status(409).json({
                message: `Recipe ${recipeID} has already been reviewed (status: ${recipes[0].recipeStatus}). Only Pending recipes can be reviewed.`,
            });
        }

        const [insertResult] = await connection.query(model.buildCreateQuery(), {
            recipeID,
            reviewerID,
            reviewStatus,
            reviewComment: comment || null,
        });
        insertId = insertResult.insertId;

        await connection.query(model.buildRecipeStatusUpdateQuery(), { recipeID, reviewStatus });

        await connection.commit();
    } catch (error) {
        console.log('SQL ERROR:', error);
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.log('ROLLBACK ERROR:', rollbackError);
            }
        }
        return res.status(500).json({ message: `Failed to save review: ${error.message}` });
    } finally {
        if (connection) connection.release();
    }

    // Return the new review (same shape as GET /:id) --
    try {
        const [rows] = await database.query(model.buildReadQuery(null, 'primary'), { ID: insertId });
        res.status(201).json(rows);
    } catch (error) {
        console.log('SQL ERROR:', error);
        res.status(500).json({
            message: `Review ${insertId} was saved but could not be loaded: ${error.message}`,
        });
    }
});

// Generic Endpoints -----------------

router.use(makeRouter(controller));

export default router;
