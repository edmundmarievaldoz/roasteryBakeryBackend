const model = {};

model.table = "ingredientallergens";
model.fields = ["ingredientAllergenID", "ingredientID", "allergenID"];

model.buildReadQuery = (req, variant) => {
    let table = model.table;
    let fields = [
        "ingredientallergens.ingredientAllergenID",
        "ingredientallergens.ingredientID",
        "ingredientallergens.allergenID"
    ];

    // Resolving Foreign Keys -------------------
    table = `(${table} LEFT JOIN ingredients ON ingredientallergens.ingredientID = ingredients.ingredientID)`;
    fields = [...fields, "ingredientName AS ingredientName"];

    table = `(${table} LEFT JOIN allergens ON ingredientallergens.allergenID = allergens.allergenID)`;
    fields = [...fields, "allergenName AS allergenName"];

    // Build and return query -------------------

    let where = '';

    switch (variant) {
        case 'primary':
            where = 'WHERE ingredientallergens.ingredientAllergenID = :ID';
            break;
        case 'ingredient':
            where = 'WHERE ingredientallergens.ingredientID = :ID';
            break;
    }
    return `SELECT ${fields.join(', ')} FROM ${table} ${where}`;
}

export default model;