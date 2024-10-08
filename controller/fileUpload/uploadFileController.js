const express = require("express");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// exports.uploadImages =
//   ("/upload",
//   async (req, res) => {
//     console.log("hello");
//     const region = process.env.AWS_REGION;
//     const bucketName = process.env.AWS_BUCKETNAME;
//     const accessKeyId = process.env.AWS_ACCESSKEYID;
//     const secretAccessKey = process.env.AWS_SECRETACCESSKEY;

//     const s3 = new AWS.S3({
//       region,
//       accessKeyId,
//       secretAccessKey,
//       signatureVersion: "v4",
//       Bucket: process.env.AWS_BUCKETNAME,
//     });

//     // Generate a UUID for the file name
//     const fileName = `${uuidv4()}-${req.body.fileName}`;
//     // const fileName = req.body.fileName;
//     const fileType = req.body.fileType; // Assuming fileType is sent from frontend
//     const params = {
//       Bucket: bucketName,
//       Key: `website/teams/${fileName}`,
//       ContentType: fileType,
//       Expires: 600,
//     };
//     try {
//       const preSignedUrl = await s3.getSignedUrlPromise("putObject", params);
//       res.json({ url: preSignedUrl });
//     } catch (error) {
//       console.error("Error generating pre-signed URL:", error);
//       res.status(500).json({ error: "Failed to generate pre-signed URL" });
//     }
//   });

exports.uploadEventImage =
  ("/generate-presigned-url",
  async (req, res) => {
    console.log("hello from createImage");
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

    const fileName = `${uuidv4()}-${req.body.fileName}`;

    const fileType = req.body.fileType;
    const params = {
      Bucket: bucketName,
      Key: `course/bannerImage/${fileName}`,

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

exports.getPresignedUrl = (req, res) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    region: process.env.AWS_REGION,
    Bucket: process.env.AWS_BUCKETNAME,
  });
  const { fileName, fileType } = req.query;

  if (!fileName || !fileType) {
    return res
      .status(400)
      .json({ error: "FileName and FileType are required" });
  }

  const params = {
    Bucket: process.AWS_BUCKETNAME,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
  };

  s3.getSignedUrl("putObject", params, (err, url) => {
    if (err) {
      console.error("Error generating pre-signed URL:", err);
      return res.status(500).json({ error: "Error generating pre-signed URL" });
    }
    res.json({ url });
  });
};

exports.uploadResume =
  ("/uploadResume",
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
      res.json({ url: preSignedUrl });
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      res.status(500).json({ error: "Failed to generate pre-signed URL" });
    }
  });

exports.bannerImage =
  ("/course/bannerImage",
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
      Key: `course/bannerImage/${fileName}`,
      // Key: `lms/users/${fileName}`,
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

exports.uploadVideo =
  ("/course/uploadVideo",
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
      Key: `course/videos/${fileName}`,
      // Key: `lms/users/${fileName}`,
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

exports.uploadUserImages =
  ("/uploadUserImages",
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
      // Key: `course/videos/${fileName}`,
      Key: `lms/users/${fileName}`,
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

exports.uploadAttachments =
  ("/uploadAttachments",
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
      Key: `coursediscussion/attachments/${fileName}`,
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

exports.uploadscrom =
  ("/uploadscrom",
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

    const fileName = req.body.fileName;
    const fileType = req.body.fileType;

    const folderPath = "lms/course/scorm/";
    const filePath = `${folderPath}${fileName}`;

    const params = {
      Bucket: bucketName,
      // Key: `lms/course/scorm/${fileName}`,
      Key: filePath,
      ContentType: fileType,
      Expires: 600,
    };

    try {
      const preSignedUrl = await s3.getSignedUrlPromise("putObject", params);
      res.json({ url: preSignedUrl, path: folderPath });
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      res.status(500).json({ error: "Failed to generate pre-signed URL" });
    }
  });
