const puppeteer = require("puppeteer");

(async () => {
  try {
    // Set up a headless Chrome instance
    const browser = await puppeteer.launch({
      //headless: false
    });
    const page = await browser.newPage();
    const url = "http://books.toscrape.com/"; // Website to scrape data from
    await page.goto(url);
    await page.waitFor(".product_pod");

    // Handle the pagination and
    // return an array of all Book objects
    async function getBooks() {
      // Get number of books on the site
      const numBooks = await page.evaluate(
        () => document.querySelector(".form-horizontal > strong").innerText
      );

      // Get the books from the first page.
      let books = await buildBooks(page);

      // Get the books from the other pages.
      do {
        let nextBtn = await page.$(".next > a");
        if (nextBtn) {
          await nextBtn.click();
          await page.waitForNavigation({ waitUntil: "networkidle0" });
        } else {
          break;
        }

        // Get books from the current page
        let newBooks = await buildBooks(page);
        // Combine them with the books from previous pages
        books = [...books, ...newBooks];
      } while (books.length < numBooks);

      return books;
    }

    // Build and return an array of Book objects.
    async function buildBooks(pages) {
      // Build an array of Book objects from a given page.
      const makeBooks = await pages.evaluate(() => {
        Array.from(document.querySelectorAll(".product_pod")).map(compact => ({
          title: compact.querySelector("h3").innerText.trim(),
          cover: compact.querySelector(".thumbnail").src,
          price: compact.querySelector(".price_color").innerText,
          rating: compact.querySelector(".star-rating").className.split(" ")[1],
          availability: compact.querySelector(".instock").innerText.trim()
        }));
      });
      return makeBooks;
    }

    await getBooks();
    //console.log(await getBooks());

    // Helper function to convert ratings in text to numbers
    const ratingConverter = rating => {
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
        default:
          return 0;
      }
    };

    // Close the headless browser
    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
