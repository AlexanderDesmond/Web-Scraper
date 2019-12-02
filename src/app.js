const puppeteer = require("puppeteer");

(async () => {
  try {
    // Set up a headless Chrome instance
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    const url = "http://books.toscrape.com/"; // Website to scrape data from
    await page.goto(url);
    await page.waitFor(".product_pod");

    // Handle the pagination and return an array of all Book objects
    async function getBooks() {
      let books = await buildBooks(page);

      do {
        let nextBtn = await page.$(".next > a");
        if (nextBtn) {
          await nextBtn.click();
          await page.waitForNavigation({ waitUntil: "networkidle0" });
          console.log(page.url());
        } else {
          break;
        }

        let newBooks = await buildBooks(page);

        books = [...books, ...newBooks];
      } while (books.length < 50);

      return books;
    }

    // Build and return an array of Book objects.
    async function buildBooks(pages) {
      // Build an array of Book objects from a given page.
      const makeBooks = await pages.evaluate(() =>
        Array.from(document.querySelectorAll(".product_pod")).map(compact => ({
          title: compact.querySelector("h3").innerText.trim(),
          cover: compact.querySelector(".thumbnail").src,
          price: compact.querySelector(".price_color").innerText,
          rating: compact.querySelector(".star-rating").className.split(" ")[1],
          availability: compact.querySelector(".instock").innerText.trim()
        }))
      );
      return makeBooks;
    }

    // Build an array of Book objects from books.toscrape.com
    /*
    const buildBooks = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".product_pod")).map(compact => ({
        title: compact.querySelector("h3").innerText.trim(),
        cover: compact.querySelector(".thumbnail").src,
        price: compact.querySelector(".price_color").innerText,
        rating: compact.querySelector(".star-rating").className.split(" ")[1],
        availability: compact.querySelector(".instock").innerText.trim()
      }))
    );
    */

    //await getBooks();
    console.log(await getBooks());

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
  } catch (error) {
    console.log(error);
  }
})();
