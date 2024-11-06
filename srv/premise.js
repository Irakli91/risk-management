const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  this.on('callOnpremise', async (req) => {
    const onPremService = await cds.connect.to('ONPREM_EXPRESS_APP');
    try {
      const response = await onPremService.get('/');
      
      console.log("Response from on-premise service:", response);
      return response;
    } catch (error) {
      console.error("Error connecting to on-premise service:", error);
      return { error: { code: error.code, message: error.message } };
    }
  });
});