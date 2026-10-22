const model = {};

model.table = 'ingredients';
model.fields = ['ingredientID', 'ingredientName', 'ingredientUnit']

model.buildReadQuery = (req, variant) => {
    let table = model.table;
    let fields = [
        'ingredients.ingredientID',
        'ingredients.ingredientName',
        'ingredients.ingredientUnit',
    ];

    // Resolving Foreign Keys -------------------

    // Build and return query -------------------

    let where = '';

    switch (variant) {
        case 'primary':
            where = 'WHERE ingredients.ingredientID = :ID';
            break;
    }
    return `SELECT ${fields.join(', ')} FROM ${table} ${where}`;
}

export default model;