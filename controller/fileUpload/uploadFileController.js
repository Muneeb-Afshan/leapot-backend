const express = require('express');
const AWS = require('aws-sdk');

const { v4: uuidv4 } = require('uuid'); // Import UUID generator


exports.uploadImages = ('/upload', async (req, res) => {
    console.log("hello")
    const region = process.env.AWS_REGION;
    const bucketName = process.env.AWS_BUCKETNAME;
    const accessKeyId = process.env.AWS_ACCESSKEYID;
    const secretAccessKey = process.env.AWS_SECRETACCESSKEY;
    
    const s3 = new AWS.S3({
        region,
        accessKeyId,
        secretAccessKey,
        signatureVersion: "v4"
    })

  // Generate a UUID for the file name
  const fileName = `${uuidv4()}-${req.body.fileName}`;
  // const fileName = req.body.fileName;
  const fileType = req.body.fileType; // Assuming fileType is sent from frontend
  const params = {
    Bucket: bucketName,
    Key: `website/teams/${fileName}`,
    ContentType: fileType,
    Expires: 600
  };
  try {
    const preSignedUrl = await s3.getSignedUrlPromise('putObject', params);
    res.json({ url: preSignedUrl });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    res.status(500).json({ error: 'Failed to generate pre-signed URL' });
  }
});




exports.uploadResume = ('/uploadResume', async (req, res) => {
  console.log("hello")
  const region = process.env.AWS_REGION;
  const bucketName = process.env.AWS_BUCKETNAME;
  const accessKeyId = process.env.AWS_ACCESSKEYID;
  const secretAccessKey = process.env.AWS_SECRETACCESSKEY;
  
  const s3 = new AWS.S3({
      region,
      accessKeyId,
      secretAccessKey,
      signatureVersion: "v4"
  })

// Generate a UUID for the file name
  const fileName = `${uuidv4()}-${req.body.fileName}`;
// const fileName = req.body.fileName;
const fileType = req.body.fileType; // Assuming fileType is sent from frontend
const params = {
  Bucket: bucketName,
  Key: `website/resume/${fileName}`,
  ContentType: fileType,
  Expires: 600
};
try {
  const preSignedUrl = await s3.getSignedUrlPromise('putObject', params);
  res.json({ url: preSignedUrl });
} catch (error) {
  console.error('Error generating pre-signed URL:', error);
  res.status(500).json({ error: 'Failed to generate pre-signed URL' });
}
});

exports.uploadAttachments = ('/uploadAttachments', async (req, res) => {
  console.log("hello")
  const region = process.env.AWS_REGION;
  const bucketName = process.env.AWS_BUCKETNAME;
  const accessKeyId = process.env.AWS_ACCESSKEYID;
  const secretAccessKey = process.env.AWS_SECRETACCESSKEY;
  
  const s3 = new AWS.S3({
      region,
      accessKeyId,
      secretAccessKey,
      signatureVersion: "v4"
  })

// Generate a UUID for the file name
  const fileName = `${uuidv4()}-${req.body.fileName}`;
// const fileName = req.body.fileName;
const fileType = req.body.fileType; // Assuming fileType is sent from frontend
const params = {
  Bucket: bucketName,
  Key: `coursediscussion/attachments/${fileName}`,
  ContentType: fileType,
  Expires: 600
};
try {
  const preSignedUrl = await s3.getSignedUrlPromise('putObject', params);
  res.json({ url: preSignedUrl });
} catch (error) {
  console.error('Error generating pre-signed URL:', error);
  res.status(500).json({ error: 'Failed to generate pre-signed URL' });
}
});
