import AWS from "aws-sdk";
import fs from "fs";
import { simpleParser } from "mailparser";
import zlib from "zlib";
import { parse } from 'node-html-parser';

export function initAws() {
  AWS.config.update({
    accessKeyId: process.env.RUA_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.RUA_S3_SECRET_ACCESS_KEY,
    region: process.env.RUA_S3_REGION,
  });
}

export async function getFileStream(s3_key) {
  initAws();
  const s3 = new AWS.S3();

  const bucketName = process.env.RUA_S3_EMAIL_STORAGE_BUCKET;

  const s3Payload = {
    Bucket: bucketName,
    Key: s3_key,
  };

  const stream = await s3.getObject(s3Payload).createReadStream();

  return stream;
}

export const emailFileToString = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(`./tmp/${file}`, "utf-8", function (err, data) {
      if (err) reject(err);

      resolve(data && data.toString());
    });
  });
};

export async function streamS3FileToLocalFile(stream, file_name) {
  return new Promise((resolve, reject) => {
    const fileWriteStream = fs.createWriteStream(`./tmp/${file_name}`);
    const unzip = zlib.createGunzip();
    stream
      .pipe(unzip)
      .pipe(fileWriteStream)
      .on("finish", () => {
        resolve({ message: "Complete!" });
      })
      .on("error", (err) => {
        reject({ message: `Something went wrong ${err.message}` });
      });
  });
}

export async function streamToFile(s3_key, file_name) {
  const s3ReadStream = await getFileStream(s3_key);

  const response = await streamS3FileToLocalFile(s3ReadStream, file_name);

  return response;
}

export async function parseEmailFromFile(file_name) {
  const email_string = await emailFileToString(file_name);

  const parsed = await simpleParser(email_string);

  return parsed;
}

export async function tmpCleanUp(file_name) {
  return new Promise((resolve, reject) => {
    fs.unlink(`./tmp/${file_name}`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          message: "File deleted",
        });
      }
    });
  });
}

export async function s3CleanUp(s3_key) {
  initAws();

  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.RUA_S3_EMAIL_STORAGE_BUCKET,
    Key: s3_key,
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

export async function s3Reupload(folder, stored_file_name) {
  const s3_key = stored_file_name.split(".")[0];

  let parsed = await parseEmailFromFile(stored_file_name);

  const headers = parsed.headers;

  const newHeaders = {
    "mime-version": headers.get("mime-version"),
    from: {
      value: headers.get("from").value,
      html: headers.get("from").html,
      text: headers.get("from").text,
    },
    date: headers.get("date").toString(),
    subject: headers.get("subject"),
    to: {
      value: headers.get("to").value,
      html: headers.get("to").html,
      text: headers.get("to").text,
    },
    "content-type": {
      value: headers.get("content-type").value,
      params: headers.get("content-type").params,
    },
  };

  let newHeaderLines = parsed.headerLines.filter(
    (item) =>
      item.key !== "received" &&
      item.key !== "x-gm-message-state" &&
      item.key !== "x-google-dkim-signature" &&
      item.key !== "dkim-signature" &&
      item.key !== "x-received" &&
      item.key !== "x-google-smtp-source"
  );

  let parsedHeaderLines = {};

  // convert array of objects with key and value to object with key and value
  newHeaderLines.forEach((item) => {
    parsedHeaderLines[item.key] = item.line;
  });

  const newHTML = parse(parsed.html).toString();
  // const newText = parsed.text.replace(/(?:\r\n|\r|\n)/g, " ");

  const newParsed = {
    ...parsed,
    headers: newHeaders,
    headerLines: parsedHeaderLines,
    date: parsed.date.toString(),
    html: newHTML,
  };

  const params = {
    Bucket: process.env.RUA_S3_EMAIL_STORAGE_BUCKET,
    Key: `${folder}/${s3_key}.json`,
    Body: JSON.stringify(newParsed),
    ContentType: "application/json",
    ACL: "public-read",
  };

  initAws();

  const s3 = new AWS.S3();

  const uploadResult = await s3.upload(params).promise();

  return {
    s3_data: uploadResult,
    parsed_email: newParsed,
  };
}
