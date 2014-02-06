# Scratch'n Sniff

A mostly useless scraping library.

Scratch'n Sniif is a combination of the Cheerio and Request libraries to make a nodejs scraper that doesn't have the same memory leak issues as jsdom-based scrapers like node-scraper. Also allows for rate limiting and a `.done()` method when all of your pages are scraped.

Can output `json` (default) or `csv` if json is properly formatted