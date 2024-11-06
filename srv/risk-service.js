
// Import the cds facade object (https://cap.cloud.sap/docs/node.js/cds-facade)
const cds = require('@sap/cds')
const { getDestination } = require('@sap-cloud-sdk/connectivity')

// The service implementation with all service handlers
module.exports = cds.service.impl(async function() {

    // Define constants for the Risk and BusinessPartner entities from the risk-service.cds file
    const { Risks, BusinessPartners } = this.entities;

    // This handler will be executed directly AFTER a READ operation on RISKS
    // With this we can loop through the received data set and manipulate the single risk entries
    this.after("READ", (data) => {
        // Convert to array, if it's only a single risk, so that the code won't break here
        const risks = Array.isArray(data) ? data : [data];

        // Looping through the array of risks to set the virtual field 'criticality' that you defined in the schema
        risks.forEach((risk) => {
            if( risk.impact >= 100000) {
                risk.criticality = 1;
            } else {
                risk.criticality = 2;
            }

            // set criticality for priority
            switch (risk.prio_code) {
                case 'H':
                    risk.PrioCriticality = 1;
                    break;
                case 'M':
                    risk.PrioCriticality = 2;
                    break;
                case 'L':
                    risk.PrioCriticality = 3;
                    break;
                default:
                    break;
            }

        })
    })


    // Getting destination config
    // const destinationConfig =  await getDestination({destinationName: 'BUSINESS_PARTNER_API_SANDBOX'});
    // const apiKey = destinationConfig.headers['API-Key'];

     // connect to remote service
     const BPsrv = await cds.connect.to("API_BUSINESS_PARTNER");

    /**
     * Event-handler for read-events on the BusinessPartners entity.
     * Each request to the API Business Hub requires the apikey in the header.
     */
    this.on("READ", BusinessPartners, async (req) => {
        // The API Sandbox returns alot of business partners with empty names.
        // We don't want them in our application
        req.query.where("LastName <> '' and FirstName <> '' ");

        // "transaction" is deprecated, because of it i used "tx"
        const result=   await BPsrv.tx(req).send({
            query: req.query,
        });

        return result
    });


    // Risks?$expand=bp (Expand on BusinessPartner)
    this.on("READ", Risks, async (req, next) => {
        /*
         Check whether the request wants an "expand" of the business partner
         As this is not possible, the risk entity and the business partner entity are in different systems (SAP BTP and S/4 HANA Cloud), 
         if there is such an expand, remove it
       */
        if (!req.query.SELECT.columns) return next();

        // Find if the request wants to expand "bp" (Business Partner)
        const expandIndex = req.query.SELECT.columns.findIndex(
            ({ expand, ref }) => expand && ref[0] === "bp"
        );

        // If "bp" is not in the request, move to the next step
        if (expandIndex < 0) return next();

         // Remove the "bp" expand from the request
        req.query.SELECT.columns.splice(expandIndex, 1);

        // Check if "bp_BusinessPartner" is in the columns to return
        if (!req.query.SELECT.columns.find((column) =>
            column.ref.find((ref) => ref == "bp_BusinessPartner")
        )
        ) {
            // If not, add "bp_BusinessPartner" to the columns to return
            req.query.SELECT.columns.push({ ref: ["bp_BusinessPartner"] });
        }

        // Get the risks data from the next step
        const risks = await next();

        // Convert single risk to an array if needed
        const asArray = x => Array.isArray(x) ? x : [x];

        // Get IDs of Business Partners from the risks
        const bpIDs = asArray(risks).map(risk => risk.bp_BusinessPartner);

        // Fetch Business Partners using their IDs
        const busienssPartners = await BPsrv.tx(req).send({
            query: SELECT.from(this.entities.BusinessPartners).where({ BusinessPartner: bpIDs }),
            
        });        

        // Create a map to store Business Partners for easy access
        const bpMap = {};
        for (const businessPartner of busienssPartners)
            bpMap[businessPartner.BusinessPartner] = businessPartner;

        // Add the fetched Business Partners to the risks
        for (const note of asArray(risks)) {
            note.bp = bpMap[note.bp_BusinessPartner];
        }

        return risks;
    });
  });