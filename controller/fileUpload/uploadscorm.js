const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const unzipper = require('unzipper');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const UtilityRoutes = require("express").Router();

const router = express.Router();

const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKETNAME;
const accessKeyId = process.env.AWS_ACCESSKEYID;
const secretAccessKey = process.env.AWS_SECRETACCESSKEY;

const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4"
});

exports.uploadscrom('/uploadscrom', async (req, res) => {
    const { fileName, fileType } = req.body;

    // Generate a UUID for the file name
    const uniqueId = uuidv4();
    const zipFileName = `${uniqueId}-${fileName}`;

    // Directory where we will extract the ZIP contents temporarily
    const tempExtractDir = path.join(__dirname, 'temp', uniqueId);

    // Ensure the temp directory exists
    fs.mkdirSync(tempExtractDir, { recursive: true });

    try {
        // Write the received ZIP file to the server's temp directory
        const zipFilePath = path.join(tempExtractDir, zipFileName);
        await fs.promises.writeFile(zipFilePath, req.body.fileData, 'binary');

        // Extract the contents of the ZIP file
        await fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: tempExtractDir }))
            .promise();

        // Upload extracted files to S3
        await uploadFilesFromDir(tempExtractDir);

        // Respond with success message or appropriate data
        res.json({ message: 'SCORM content uploaded successfully' });
    } catch (error) {
        console.error('Error processing and uploading SCORM content:', error);
        res.status(500).json({ error: 'Failed to process and upload SCORM content' });
    } finally {
        // Clean up: delete the temp directory and its contents
        await fs.promises.rmdir(tempExtractDir, { recursive: true });
    }
});

async function uploadFilesFromDir(directoryPath) {
    // Read all files recursively from the directory
    const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });

    // Upload each file to S3 while preserving the directory structure
    await Promise.all(files.map(async (file) => {
        const filePath = path.join(directoryPath, file.name);

        if (file.isDirectory()) {
            // Recursively upload files from subdirectories
            await uploadFilesFromDir(filePath);
        } else {
            // Calculate S3 key with the directory structure preserved
            const s3Path = path.relative(path.join(__dirname, 'temp'), filePath);

            // Upload file to S3
            await s3.upload({
                Bucket: bucketName,
                Key: `lms/course/scrom/${s3Path}`,
                Body: fs.createReadStream(filePath),
                ContentType: 'application/octet-stream' // Adjust content type as needed
            }).promise();
        }
    }));
}

