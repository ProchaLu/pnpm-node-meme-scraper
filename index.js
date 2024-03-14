import fs from 'node:fs';
import client from 'node:https';

const memeUrl = 'https://memegen-link-examples-upleveled.netlify.app/';
const folderPath = './memes';

// fetch function for HTML & possibly more (the images)
// translating response into text and saving it in responseText
const response = await fetch(memeUrl);
const responseText = await response.text();

// defining function declaration for filtering the responseText for image urls by using regex
function filterImageUrls(data) {
  const regEx = /src="https:\/\/api.*\.jpg\?width=300/g;
  let match;
  const results = [];
  let i = 0;
  while ((match = regEx.exec(data)) !== null && i < 10) {
    // console.log(match[0].slice(5));
    results.push(match[0].slice(5));
    i++;
  }
  return results;
}

// defining function declaration for downloading images

function saveImage(urls, filepath) {
  client.get(urls, (res) => {
    res.pipe(fs.createWriteStream(filepath));
  });
}

// creating a folder called meme
if (!fs.existsSync(folderPath)) {
  // check if folder already exists
  fs.mkdirSync(folderPath);
}

// saving filtered image urls to an array
const filteredUrls = await filterImageUrls(responseText);

// looping through images and assigning download location and
let counter = 1;
const dec = 0;

for (let i = 0; i < filteredUrls.length; i++) {
  counter = i + 1;

  if (i < 9) {
    saveImage(filteredUrls[i], folderPath + `/${dec}${counter}.jpg`);
  } else {
    saveImage(filteredUrls[i], folderPath + `/${counter}.jpg`);
  }
}
