'use strict';

const { tryParse, handleError } = require('serverless-helpers/responses');

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const scorekeeper = require('scorekeeper');

module.exports.uploadFile = (event, context, callback) => {
  // Using a serverless helper library I built to ease testing with JSON files.
  const { fileName, fileData, fileType } = tryParse(event.body);

  // Create buffer from base64 data.
  const base64Data = fileData.split(';base64,').pop();
  const buf = new Buffer(base64Data, 'base64');

  // Generate unique key in the case that this function is invoked from multiple requests.
  const bucketKey = `Rankings-${uuidv1()}`;

  // Temporary file that will be cleaned up at end of function.
  const tempFile = `/tmp/${bucketKey}`;

  // Write to Lambda's /tmp file to follow scorekeeper convention.
  fs.writeFileSync(tempFile, buf, 'utf8');

  // Process file with the scorekeeper app
  let rankings = [];

  try {
    rankings = scorekeeper({ fileName: tempFile });
  } catch (err) {
    // Send error in callback and exit process.
    callback(null, handleError(err));

    // TODO: Put this process.exit() in my serverless-helpers lib.
    process.exit(0);
  }

  // Map over the Array that scorekeeper returns to generate data suitable for file writing.
  const text = rankings
    .map(({ name, points, rank }) => `${rank}. ${name} ${points}`)
    .join('\n');

  const payload = {
    Bucket: process.env.SCOREKEEPER_BUCKET,
    Key: bucketKey,
    Body: text,
    ContentEncoding: 'utf-8',
    ContentType: fileType,
    ContentDisposition: `filename=${bucketKey}`,
  };

  S3.putObject(payload, (err, data) => {
    if (err) {
      console.log('Error uploading data: ', err);
    }

    // Standard Lambda response.
    const response = {
      statusCode: err ? 500 : 200,
      body: JSON.stringify({
        bucketKey,
        fileName,
        err,
        rankings,
      }),
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };

    callback(null, response);

    // Cleanup /tmp file storage.
    fs.unlink(tempFile, (err) => {
      if (err) {
        console.log('err', err);
      }
    });
  })
};