import fs from 'node:fs';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

// Declare websiteUrl variable
const websiteUrl = 'https://memegen-link-examples-upleveled.netlify.app/'; // Replace with the actual website URL

const directoryPath = 'memes';
// Check if the directory already exists
if (!fs.existsSync(directoryPath)) {
  // If it doesn't exist, create the directory
  fs.mkdirSync(directoryPath);
  console.log(`Directory '${directoryPath}' created successfully.`);
} else {
  console.log(`Directory '${directoryPath}' already exists.`);
}

fetch(websiteUrl)
  .then((response) => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error(`Failed to fetch the website: ${response.statusText}`);
    }
  })
  .then((html) => {
    // Parse the HTML content
    const root = parse(html);

    // select all <img> elements and extract their src attributes
    const imgElements = root.querySelectorAll('img');
    const imgSrcList = imgElements
      .map((img) => img.getAttribute('src'))
      .filter((src) => src);

    // limit the number of images to download
    const maxImagesToDownload = 10;

    // maxImagesToDownload Loop and Download (use filePath and imageUrl)
    for (
      let index = 0;
      index < imgSrcList.length && index < maxImagesToDownload;
      index++
    ) {
      const src = imgSrcList[index];

      //every number under 10 gets a 0 before its index+1. if 10 its just index+1
      const fileName = `${index + 1 < 10 ? `0${index + 1}` : index + 1}.jpg`;

      //Declare constants for downloading so the code looks neat. used for fs.writeFileSync
      const filePath = `./memes/${fileName}`; // where to save
      const imageUrl = new URL(src, websiteUrl); // create an absolute URL

      fetch(imageUrl.href)
        .then((response) => {
          if (response.ok) {
            return response.arrayBuffer(); // return the image data as ArrayBuffer
          } else {
            throw new Error(`Failed to download image: ${response.statusText}`);
          }
        })
        .then((imageBuffer) => {
          fs.writeFileSync(filePath, Buffer.from(imageBuffer)); // convert the ArrayBuffer to Buffer
          console.log(`Downloaded and saved ${fileName}`);
        })
        .catch((error) => {
          console.error(`Error downloading image: ${error.message}`);
        });
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
