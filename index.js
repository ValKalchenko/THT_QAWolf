// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
// Edit the `index.js` file in this project to go to [Hacker News](https://news.ycombinator.com/) 
// and save the title and URL of the top 10 articles to a CSV file. You can run your script with the `node index.js` command.
const { chromium } = require("playwright");
const fs = require('fs');
const path = require('path');

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  // extract data (titles and URLs)
  const articles = await page.evaluate(() => {
    // using class athing and class titleline found in inpect elements, select all articles (athing) and filter top 10 using 
    // (titleline)
    const articleElements = Array.from(document.querySelectorAll('.athing'));
    return articleElements.slice(0, 10).map(article => ({
      title: article.querySelector('.titleline > a').innerText,
      url: article.querySelector('.titleline > a').href
    }));
  });

  // Convert articles data to CSV format
  // replacing quotation marks
  const csvData = articles.map(article => `"${article.title.replace(/"/g, '""')}","${article.url}"`).join('\n');
  // create header to specify data
  const csvHeader = `"Title","URL"\n`;
  const csvContent = csvHeader + csvData;

  // Save CSV to file path
  const filePath = path.join(__dirname, 'top10_articles.csv');
  fs.writeFileSync(filePath, csvContent);

  // Close browser
  await browser.close();

  // console.log(`Data saved to ${filePath}`);
}

(async () => {
  await saveHackerNewsArticles();
})();