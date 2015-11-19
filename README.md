Alphabits
===

Scrape a number of pages asynchronously and write out your data in one file when done. It generally assumes that you are scraping a series of webpages whose urls vary by a different parameter.

Can output `json` (default) or `csv` if json is properly formatted, i.e. one dimensional. It also supports rate-limiting calls and custom headers.

See the [example usage](https://github.com/mhkeller/alphabits/blob/master/examples/noms.js) and an explanation of different options.


## Genesis

I used to use [node-scraper](https://github.com/mape/node-scraper) but its dependency on jsdom made it heavy and had memory-leak issues on large jobs. Cheerio is a much lighter alternative.
