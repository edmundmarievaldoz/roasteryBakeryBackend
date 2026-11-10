const model = {};

model.table = 'allergens';
model.fields = ['allergenID', 'allergenName']

model.buildReadQuery = (req, variant) => {
    let table = model.table;
    let fields = [
        'allergens.allergenID',
        'allergens.allergenName',
    ];

    // Resolving Foreign Keys -------------------

    // Build and return query -------------------

    let where = '';
    let distinct = '';

    switch (variant) {
        case 'primary':
            where = 'WHERE allergens.allergenID = :ID';
            break;
        case 'recipe':
            // Allergens in a recipe, worked out from its ingredients.
            // DISTINCT because several ingredients can share an allergen.
            table = `((${table} INNER JOIN ingredientallergens ON ingredientallergens.allergenID = allergens.allergenID)`
                + ` INNER JOIN recipeingredients ON recipeingredients.ingredientID = ingredientallergens.ingredientID)`;
            distinct = 'DISTINCT ';
            where = 'WHERE recipeingredients.recipeID = :ID';
            break;
    }
    return `SELECT ${distinct}${fields.join(', ')} FROM ${table} ${where}`;
}

export default model;