const {CertificateSetting} = require('../../model/CertificateSchema');

//Function to generate a random value
function generateRandomValue() {
    // Generate a random number between 100,000 (1 lakh) and 1,000,000 (10 lakhs)
    const randomValue = Math.floor(100000 + Math.random() * 900000);
    return randomValue.toString(); // Convert the number to string
}

// Controller function to save a new certificate setting
exports.createCertificateSetting = async (req, res) => {
    console.log(req.body)

  try {
    let certificateSettingData = req.body;

    // Construct serialNumberType object based on the provided data
    let serialNumberType;
    if (certificateSettingData.serialNumberType.type === 'Random') {
      serialNumberType = {
        type: 'Random',
        randomValue: generateRandomValue() // Define a function to generate a random value
      };
    } else if (certificateSettingData.serialNumberType.type === 'Incremental') {
      // Check if serialNumberType is 'Incremental' and required fields are provided
      if (!certificateSettingData.prefix || !certificateSettingData.nextNumber) {
        return res.status(400).json({ message: "Both 'prefix' and 'nextNumber' are required for Incremental serialNumberType." });
      }
      serialNumberType = {
        type: 'Incremental',
        prefix: certificateSettingData.prefix,
        nextNumber: certificateSettingData.nextNumber
      };
    } else {
      return res.status(400).json({ message: "Invalid serialNumberType. Allowed values are 'Random' and 'Incremental'." });
    }

    // Assign constructed serialNumberType object to certificateSettingData
    certificateSettingData.serialNumberType = serialNumberType;

    // Create a new certificate setting document
    const certificateSetting = new CertificateSetting(certificateSettingData);
    
    // Save the document to the database
    await certificateSetting.save();
    // Send the saved document as response
    res.status(201).send({certificateSetting: certificateSetting , success : true , message : "Certificate Setting Save Successfully " , statusCode : 200});
  } catch (error) {
    // Handle errors
    res.status(400).send(error);
  }
};
