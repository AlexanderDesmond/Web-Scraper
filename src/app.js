const puppeteer = require("puppeteer");

(async () => {
  // Set up a headless Chrome instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = "http://books.toscrape.com/"; // Website to scrape data from
  await page.goto(url);
  //await page.waitFor(1000);

  // Build an array of Book objects from books.toscrape.com
  try {
    const buildBooks = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".product_pod")).map(compact => ({
        title: compact.querySelector("h3").innerText.trim(),
        cover: compact.querySelector(".image_container img").src,
        price: compact.querySelector(".price_color").innerText,
        rating: compact.querySelector(".star-rating").className.split(" ")[1],
        availability: compact.querySelector(".instock").innerText.trim()
      }))
    );

    console.log(buildBooks);
  } catch (error) {
    console.log("Error message: " + error);
  }

  // Helper function to convert ratings in text to numbers
  function ratingConverter(rating) {
    switch (rating) {
      case "One":
        return 1;
        break;
      case "Two":
        return 2;
        break;
      case "Three":
        return 3;
        break;
      case "Four":
        return 4;
        break;
      case "Five":
        return 5;
        break;
    }
  }

  // Close the headless browser
  await browser.close();
})();
