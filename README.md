# Scratch'n Sniff

A combination of the Cheerio and Request libraries to make a nodejs scraper that doesn't have the same memory leak issues as jsdom-based scrapers like node-scraper. Also allows for rate limiting. Units are in milliseconds.

### Normal 
````
var snf = require('scratch-n-sniff');

snf('http://america.aljazeera.com', function(err, $){
  var headline = $('h1.topStories-headline a').html();
  console.log(headline);
})

````

### Rate limited
````
var snf = require('scratch-n-sniff');

for (var i = 0; i < 5; i++){
	snf('http://america.aljazeera.com', function(err, $){
	  var headline = $('h1.topStories-headline a').html();
	  console.log(headline);
	})
}
