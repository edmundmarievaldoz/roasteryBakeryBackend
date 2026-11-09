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

    switch (variant) {
        case 'primary':
            where = 'WHERE allergens.allergenID = :ID';
            break;
    }
    return `SELECT ${fields.join(', ')} FROM ${table} ${where}`;
}

export default model;