import fs from 'node:fs';
import { get } from 'node:https';
import cliProgress from 'cli-progress';
import { parse } from 'node-html-parser';

const memeUrl = 'https://memegen-link-examples-upleveled.netlify.app/';
const memeFolder = './memes/';

// Create memes directory if necessary
if (!fs.existsSync(memeFolder)) {
  fs.mkdirSync(memeFolder);
}

// Wrapping https get request in promise that resolves once all data has been received
function asyncHttpsGet(url, encoding) {
  return new Promise((resolve, reject) => {
    let dataBuffer = '';

    get(url, (res) => {
      // Set encoding
      res.setEncoding(encoding);

      // Bundle incoming data stream
      res.on('data', (data) => {
        dataBuffer = dataBuffer + data;
      });

      // Resolve when all data has been received
      res.on('end', () => {
        resolve(dataBuffer);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Setup progress bar
const progressBar = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic,
);
console.log('\n Downloading images ...\n');
progressBar.start(10, 0);

// Make https get request to meme url and wait until all html data is received
const htmlPageAsString = await asyncHttpsGet(memeUrl, 'utf-8');
// Parse the html string data into an htmlElement object (library: node-html-parser)
const htmlRoot = parse(htmlPageAsString);

// Extract source url of all images
const imgSection = htmlRoot.getElementById('images');
const allImages = imgSection.getElementsByTagName('img');
const allImagesSrc = allImages.map((imgHtmlElement) => {
  return imgHtmlElement.getAttribute('src');
});

// Load the first 10 images and save to memes folder in local file system
for (let i = 0; i < 10; i++) {
  fs.writeFileSync(
    memeFolder + (i + 1).toString().padStart(2, '0') + '.jpg',
    await asyncHttpsGet(allImagesSrc[i], 'base64'),
    'base64',
  );

  progressBar.increment();
}

// Stop progress bar
progressBar.stop();
console.log('\n Done.');
