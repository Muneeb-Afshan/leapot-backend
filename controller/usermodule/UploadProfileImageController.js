const express = require("express");
const AWS = require("aws-sdk");

const { v4: uuidv4 } = require("uuid"); // Import UUID generator

exports.uploadImages =
  ("/upload",
  async (req, res) => {
    console.log("hello");
    const region = process.env.AWS_REGION;
    const bucketName = process.env.AWS_BUCKETNAME;
    const accessKeyId = process.env.AWS_ACCESSKEYID;
    const secretAccessKey = process.env.AWS_SECRETACCESSKEY;

    const s3 = new AWS.S3({
      region,
      accessKeyId,
      secretAccessKey,
      signatureVersion: "v4",
    });

    // Generate a UUID for the file name
    const fileName = `${uuidv4()}-${req.body.fileName}`;
    // const fileName = req.body.fileName;
    const fileType = req.body.fileType; // Assuming fileType is sent from frontend
    const params = {
      Bucket: bucketName,
      Key: `website/teams/${fileName}`,
      ContentType: fileType,
      Expires: 600,
    };
    try {
      const preSignedUrl = await s3.getSignedUrlPromise("putObject", params);
      res.json({ url: preSignedUrl });
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      res.status(500).json({ error: "Failed to generate pre-signed URL" });
    }
  });

exports.addProfileImage =
  ("/usermodule/addprofilepicture",
  async (req, res) => {
    console.log("hello");
    const region = process.env.AWS_REGION;
    const bucketName = process.env.AWS_BUCKETNAME;
    const accessKeyId = process.env.AWS_ACCESSKEYID;
    const secretAccessKey = process.env.AWS_SECRETACCESSKEY;

    const s3 = new AWS.S3({
      region,
      accessKeyId,
      secretAccessKey,
      signatureVersion: "v4",
    });

    // Generate a UUID for the file name
    const fileName = `${uuidv4()}-${req.body.fileName}`;
    // const fileName = req.body.fileName;
    const fileType = req.body.fileType; // Assuming fileType is sent from frontend
    const params = {
      Bucket: bucketName,
      Key: `website/resume/${fileName}`,
      ContentType: fileType,
      Expires: 600,
    };
    try {
      const preSignedUrl = await s3.getSignedUrlPromise("putObject", params);
      // Save the URL to the user's profile in the database
      const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/website/profiles/${fileName}`;
      await User.findByIdAndUpdate(userId, { picture: imageUrl });
      res.json({ url: preSignedUrl });
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      res.status(500).json({ error: "Failed to generate pre-signed URL" });
    }
  });
