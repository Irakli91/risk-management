const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const db = await cds.connect.to('db'); 

    const Risks = db.entities['Risks'];

    const Items = db.entities['Items'];


    this.on('GetRisksByPriority', async (req) => {
        const { priority } = req.data; 
        console.log('Priority:', priority);
        
        const risks = await db.run(SELECT.from(Risks).where({ prio_code: priority }));
        
        return risks; 
    });

    this.on('CreateRisk', async (req) => {
        const newRisk = req.data; 

        const createdRisk = await db.run(INSERT.into(Risks).entries(newRisk));
        
        return createdRisk;
    });

     this.on('GetAllItems', async () => {
        const items = await db.run(SELECT.from(Items));
        return items; 
    });
});