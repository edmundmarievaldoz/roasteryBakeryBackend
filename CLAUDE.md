# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install`: install dependencies
- `npm start`: run the API with nodemon on port 5000 (override with the `PORT` env var)

There is no build step, linter, or test suite configured.

## Database

The app needs a local MySQL server with a `roasterybakery` database, reachable at `localhost:3306` as `root` with an empty password (hardcoded in `database.js`). If the connection fails, the process logs the error and exits.

The schema is not in this repo. Table and column names can only be inferred from the SQL in `models/`.

## Architecture

Express 5 REST API using ES modules. Each resource is a model, a router, and a mount point in `app.js`, all sharing one generic controller:

- **`models/*-model.js`**: plain objects that expose `buildReadQuery(req, variant)` and `buildCreateQuery(req)`, which return SQL strings. All resource-specific SQL lives here, including foreign key joins.
- **`Controller.js`**: generic `get` and `post` handlers that run whatever SQL the model builds. One class serves every resource.
- **`routers/makeRouter.js`**: creates the standard routes (`GET /`, `GET /:id`, `POST /`) for a controller.
- **`routers/*-router.js`**: wires a model to a `Controller` and `makeRouter`, then adds any bespoke routes under the `Bespoke Endpoints` comment.
- **`database.js`**: creates a single shared connection (not a pool) using top-level await.

### Read variants

`variant` selects the `WHERE` clause in `buildReadQuery`: `null` lists all rows, `'primary'` filters by primary key, and models can define others. For example, `'recipe'` in the recipeIngredient model backs `GET /api/recipeingredients/recipe/:id`. To add a filtered read, add a `case` to the model's switch and a bespoke route that calls `controller.get(req, res, '<variant>')`.

### Behavior to preserve when changing this code

- `Controller` copies the query builders off the model, so they run without `this`. Builders must refer to the `model` variable, not `this.table`.
- `database.js` enables `namedPlaceholders`. `post` passes `req.body` directly as the query parameters, so JSON body keys must match the `:placeholder` names in `buildCreateQuery`. A missing key causes a 500.
- After an insert, `post` calls `get` with a stub request containing only `params.id`, using the `'primary'` variant. Every model needs a `'primary'` case, and it must not read anything else from `req`.
- `get` binds the id as `:ID` for every variant, so the `WHERE` clause must use that name.
- `get` always responds with an array, including for single-record lookups and after `post`, and returns 404 when there are no rows, including for an empty list.
- The CORS middleware in `app.js` does not set `Access-Control-Allow-Methods`, so browser clients will fail preflight for `PUT` or `DELETE` until it does.

## Version Control

All Git operations are managed by the developer using GitHub Desktop.

- Do not create, switch or delete branches.
- Do not stage, commit, push, pull, merge or discard changes.
- Do not offer to perform Git operations at the end of a task.
- You may inspect Git status and diffs when necessary.
- After implementation and review, inform the developer that the changes
  are ready for review and committing in GitHub Desktop.
- The developer is responsible for all Git operations.

## Clarification Questions

When exploring or planning a proposed change:

- Identify ambiguities, design decisions and unresolved requirements.
- Before finalising a plan, ask the developer to resolve important questions.
- Present questions interactively, one at a time, using selectable options
  when available.
- Briefly explain why each decision matters and the implications of options.
- Recommend a preferred option where appropriate and explain why.
- Allow an alternative response using "Other".
- Wait for each answer before proceeding to the next question.
- After all questions are answered, resume planning without requiring
  another prompt where possible.
- Incorporate the answers and present the revised implementation plan
  for the developer to review.
- Do not implement changes before the plan is approved.
- Do not invent questions when no clarification is needed.

## Validation for Small Changes

- Do not run automated diagnostics, tests, exports or build commands by
  default for small changes.
- After completing approved edits, summarise the modifications and provide
  clear manual testing instructions.
- The developer will run the application and report the results.
- Do not claim that the feature works until the developer has verified it.
- Ask before running any additional validation or inspection command.