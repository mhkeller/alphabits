# Alphabits

A combination of the Cheerio and Request libraries to make a nodejs scraper that doesn't have the same memory leak issues as jsdom-based scrapers like node-scraper. Also allows for rate limiting and `.start(onDone)` will be called only all of your pages are scraped.

Can output `json` (default) or `csv` if json is properly formatted, i.e. one dimensional.

It generally assumes that you are scraping a series of webpages whose urls vary by a different parameter. 

See the example for an example setup. Better documentation to come.


TODO

Write documentation for showing how to use this for getting data from json endpoint.