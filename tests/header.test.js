const puppeteer = require('puppeteer');

test ('Adds two numbers', () => {
  const sum = 1+2;

  expect(sum).toEqual(3);
});

test ('We can launch a browser', async () => {
  const browser = await puppeteer.lauch({
    headless: false
  });
  const page =await browser.newPage();
  await page.goto('localhost:3000');

  const text = await page.$eval('a.brand-logo', el=> el.innerHTML);

  expect(text).toEqual('Blogster');

});
