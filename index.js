// import node modules and npm packages
import fs from 'node:fs';
import cheerio from 'cheerio';
import cliProgress from 'cli-progress';
import fetch from 'node-fetch';

const memeWebsite = 'https://memegen-link-examples-upleveled.netlify.app/';
const memeArray = [];

// create folder
fs.mkdir('./memes', { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});
// create progress bar
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

// Fetch HTML from the Website
const getMemes = async () => {
  const response = await fetch(memeWebsite);
  const body = await response.text();
  const $ = cheerio.load(body);
  // put the first 10 images in an array
  $('img').each((i, img) => {
    if (i < 10) {
      memeArray.push(img.attribs.src);
      // attribs cheerio function, help from https://npmdoc.github.io/node-npmdoc-cheerio/build/apidoc.html
    }
  });
  // fetch the 10 images and put it in the memes folder
  // start progress bar
  function format(n) {
    return (n < 10 ? '0' : '') + n;
  }

  bar.start(10, 0);
  for (let i = 0; i < memeArray.length; i++) {
    const getImages = async () => {
      const imageResponse = await fetch(memeArray[i]);
      const content = await imageResponse.buffer();
      fs.writeFile(`./memes/${format(i + 1)}.jpg`, content, () => {
        console.log(`
        Picture ${i + 1} download complete`);
      });
    };
    await getImages(); // run the async await function until i = 9
    bar.increment(1); // increment progress bar by 1
  }
  bar.stop(); // porgress bar stop
};

// create your own meme if the user input is there
if (process.argv[2] && process.argv[3] && process.argv[4]) {
  const memeName = process.argv[4];
  const memeUpText = process.argv[2];
  const memeDownText = process.argv[3];
  // create custom meme folder
  fs.mkdir('./custom-memes', { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
  });
  // fetch your own meme
  const getOwnMeme = async () => {
    const ownImageResponse = await fetch(
      `https://api.memegen.link/images/${memeName}/${memeUpText}/${memeDownText}.jpg`,
    );
    const ownMeme = await ownImageResponse.buffer();
    // write own meme into folder
    fs.writeFile(
      `./custom-memes/${memeName}${memeUpText}${memeDownText}.jpg`,
      ownMeme,
      () => {
        console.log(`Custom ${memeName}meme download complete`);
      },
    );
  };
  await getOwnMeme();
} else {
  await getMemes();
}
