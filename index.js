import { promises as fs } from 'node:fs';
import fetch from 'node-fetch';
import parser from 'node-html-parser';

fs.mkdir('./memes', { recursive: true }, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('New directory successfully created.');
  }
});

const response = await fetch(
  'https://memegen-link-examples-upleveled.netlify.app/',
);
const data = await response.text();
const body = await parser.parse(data).querySelectorAll('img');

function formatNumber(n) {
  return n > 9 ? '' + n : '0' + n;
}

const downloadImage = async (url, path) => {
  const response1 = await fetch(url);
  const blob = await response1.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(path, buffer);
};

for (let i = 0; i <= 9; i++) {
  const imageLink = body[i].getAttribute('src');

  await downloadImage(imageLink, `./memes/${formatNumber(i + 1)}.jpg`);
}
