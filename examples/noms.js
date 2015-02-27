var Scraper   = require('../lib/index.js'),
		_         = require('underscore');

var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013];

var scrape = Scraper()
							.data(years)
							.url('http://www.imdb.com/event/ev0000003/', function(d) { return d }) // The second argument is a function that takes the current node in your data and returns a value. If your data is an object then it would be `return d.year`.
							.extractor(parsePage)
							.rateLimit(1000) // Optional
							.scrapeTargetFormat('webpage') // Can be `webpage` or `json`
							.resultFormat('csv') // Optional, defaults to json if not called
							.headers({ 'user-agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11' }) // Optional, set user-agent headers
							.start(onDone);

function parsePage($, year, callback, status){
	console.log(status) // Print which page we're fetching

	var movies = {}; // This scraper is getting multiple objects per page. You could also give the callback an object and it will still produce a csv

	$('[class^=alt] strong').each(function(index, el){
		var movie = {};

		var id    = $(el).find('a').attr('href').split('/')[2].replace('tt',''),
				title = $(el).find('a').html().replace('&#xE9;', 'é').replace('&#x27;' , '\'').replace('&#x26;', '&');

		// Only include movies we haven't already encountered on this page
		if (!movie[id]){
			movie.year   = year;
			movie.imdbid = id;
			movie.title  = title;

			movies[id] = movie;
		}
	})

	callback(_.values(movies))
}


function onDone(results){
	console.log(results)
}
