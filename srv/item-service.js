const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    // Function to filter items by quantity
    this.on('filterItemsByQuantity', async (req) => {
        const { quantity } = req.data;

        const Items = await cds.run(SELECT.from('riskmanagement.Items').where({ quantity }));

        return Items;
    });

    // Before hook for validating item creation
    this.before('createNewItem', (req) => {
        const { quantity } = req.data;
    
        if (quantity > 100) {
             req.error(400, 'Quantity cannot exceed 100.');
        }
    });
    
    // Action to create a new item
    this.on('createNewItem', async (req) => {
        console.log('on')

        const { title, quantity } = req.data;

        const result = await cds.run(
            INSERT.into('riskmanagement.Items').entries({
                title,
                quantity,
            })
        );
        
        return result;
    });
});