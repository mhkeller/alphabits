Alphabits
===

Scrape a number of pages asynchronously and write out your data in one file when done. It generally assumes that you are scraping a series of webpages whose urls vary by a different parameter. 

Can output `json` (default) or `csv` if json is properly formatted, i.e. one dimensional.

See the example for an example setup. Better documentation to come.


## Genesis

I used to use [node-scraper](https://github.com/mape/node-scraper) but its dependency on jsdom made it heavy and had memory-leak issues on large jobs. Cheerio is a much lighter alternative.