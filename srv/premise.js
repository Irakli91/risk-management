const cds = require('@sap/cds');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');


module.exports = cds.service.impl(async function () {
  this.on('callOnpremise', async (req) => {
    try {
          // Using executeHttpRequest to make a call to the on-premise destination
          const response = await executeHttpRequest({ destinationName: 'ONPREM_EXPRESS_APP' }, {
            method: 'GET',
             url: '/'  
          });

          // const vcapServices = JSON.parse(process.env.VCAP_SERVICES);

          // const destinationService = vcapServices['destination']?.[0];

          // console.log("destinationService", destinationService)

      
      console.log("Response from on-premise service:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error connecting to on-premise service:", error);
      return { error: { code: error.code, message: error.message } };
    }
  });
});