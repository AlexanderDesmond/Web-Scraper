const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = "www.google.com";
  await page.goto(url);
  await page.screenshot({ path: "screenshot.png" });

  await browser.close();
})();
