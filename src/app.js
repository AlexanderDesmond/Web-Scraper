const puppeteer = require("puppeteer");

(async () => {
  // Set up a headless Chrome instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = "http://books.toscrape.com/"; // Website to scrape data from
  await page.goto(url);
  await page.waitFor(1000);

  // Return an array of links to the books' cover images
  const coverImages = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".image_container img")).map(
      coverImage => coverImage.src
    )
  );
  //console.log(coverImages);

  // Return an array of the books' ratings
  const ratings = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".star-rating"))
      .map(rating => rating.className.split(" ")[1])
      .map(rating => {
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
      })
  );
  //console.log(ratings);

  // Return an array of the books' titles
  const titles = await page.evaluate(() =>
    Array.from(document.querySelectorAll("h3")).map(title => title.innerText)
  );
  //console.log(titles);

  // Return an array of the books' prices
  const prices = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".price_color")).map(
      price => price.innerText
    )
  );
  //console.log(prices);

  // Return an array of the books; availability
  const stock = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".instock")).map(price =>
      price.innerText.trim()
    )
  );
  //console.log(stock);

  // Create and return an array of Books
  function buildCatalogue() {
    const books = [];
    // Build each book object
    for (let i = 0; i < titles.length; i++) {
      let book = {
        cover: coverImages[i],
        rating: ratings[i],
        title: titles[i],
        price: prices[i],
        availability: stock[i]
      };
      books.push(book);
    }
    return books;
  }
  console.log(buildCatalogue());

  await browser.close();
})();
