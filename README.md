This is my capstone, project name Insider (actually not such a bad name for the app, is it?)
---

Insider intends to make the user's housing search easier and less of a hassle by doing a few things. 

1) It saves housing ads. This is useful for a few reasons, not the last of which is the fact that Craigslist ads are constantly disappearing. Being able to save the ads that are interesting means having more data -- more data on what you want, what the reasonable prices in your area are, etc.

2) It standardizes housing ads. For the moment this is going to be done manually. If I can figure out how to scrape craiglist or use Zillow's API, I'll automate it. But for now the user will be able to do two very important things: save an entire ad; fill out a boilerplate housing ad with the data from the ad they saved. This is helpful because housing ads aren't standardized. Comparing them can be a gigantic pain in the ass, and if the person posing the ad forgets to include crucial information that you need, it's on you to remember to ask for it. So by creating a kind of housing-ad template, Insider makes it much easier to see, at a glance, what someone is offering, for how much, etc.

3) The ability to compare directly the housing ads you've saved. You'll be able to see, at a glance, everything you're considering and how they stack up against one another. It'll also map, if the user has location data.

4) Automatic backup of everything to google drive or google spreadsheets.


Technologies

This is a boilerplate for projects that have react and webpack.
--
Usage

```
$ git clone https://github.com/voxelsdev/react-webpack-boilerplate.git
$ mv -a react-webpack-boilerplate/. whateveryouwantittobenamed/
$ rm -rf react-webpack-boilerplate/
$ cd whateveryouwantittobenamed/
$ npm i
```

Then just go into the src file, and add / edit components.

```
$ npm start
```

Go to localhost:3️⃣0️⃣0️⃣0️⃣/ for the app.

This project has css, image, and js loaders, which I would reccommend taking a look at those npm pages for more information.

Make sure you have the latest versions of everything, too. (node, pg, and whatnot).

## There are a few things that need to be done to personalize this, which are not crucial.

- Change development connection in knexfile.js
- Change project name / description in package.json
- Add a .env file

--
Make an app!
