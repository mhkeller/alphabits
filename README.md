Alphabits
===

Scrape a number of pages asynchronously and write out your data in one file when done. It generally assumes that you are scraping a series of webpages whose urls vary by a different parameter although that's not a strict requirement. It uses [Cheerio](https://github.com/cheeriojs/cheerio) so you can extract information from you page with jQuery-like syntax.

Can output `json` (default) or `csv` if json is properly formatted, i.e. one dimensional. It also supports rate-limiting calls and custom headers.

See the [example usage](https://github.com/mhkeller/alphabits/blob/master/examples/noms.js) and an explanation of different options.

## Installation

```
npm install alphabits
```

The above will create a `node_modules` folder if it doesn't already exist and add the package to that folder. A better way is to run `npm init` to create a `package.json` and then use `npm install alphabits --save`. This will do everything as the above command but will also add `alphabits` to your `package.json` file so in the future you know what version you were using, among other benefits.
