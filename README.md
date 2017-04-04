Insider is my capstone project in Galvanize's web-development immersive class. The idea, in a nutshell, is to drag craigslist, kicking and screaming, into the new millenium. Insider tries to improve on the craigslist user experience. It remains in development, but I have implemented several of the most important features:

1. Webscraping: A webscraper that pulls ads from the sublets section of the craigslist Seattle website.

2. Searching by keyword, filtering by parameter and weighted preferences. Weighted preferences allow the user to indicate what's most important in their housing search. Insider then assigns each listing a score and filters and sorts listings so that those that best fit the user's preferences appear first.

3. Mapping: all listings are visible on a map and can be clicked to reveal that listing's details.

4. Save and compare listings. Users can save listings to their accounts and then browse and compare listings without ever reloading the page.

Technologies used: JavaScript, Node, Express, ReactJS, React Bootstrap, React Google Maps, Webpack, Cheerio, CerealScraper, server-side jQuery, Knex, PostgreSQL