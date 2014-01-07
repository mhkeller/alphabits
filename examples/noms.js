var fs        = require('fs'),
		Scraper   = require('../lib/scratch-n-sniff.js'),
		_         = require('underscore');
 
var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013];

var scrape = Scraper()
									.data(years)
									.url('http://www.imdb.com/event/ev0000003/', function(d) { return d })
									.extractor(parsePage, function(d) { return d } )
									.rateLimit(1000)
									.format('csv'); // Defaults to json

function parsePage($, year, callback, status){
	console.log(status) // Print which page we're fetching

	var movies   = []; // This scraper is getting multiple objects per page. You could also give the callback an object and it will still produce a csv
	
	$('[class^=alt] strong').each(function(index, el){
		var movie = {};

		var id    = $(el).find('a').attr('href').split('/')[2].replace('tt',''),
				title = $(el).find('a').html().replace('&#xE9;', 'é').replace('&#x27;' , '\'').replace('&#x26;', '&');

		// Only include movies we haven't already encountered on this page
		if (_.chain(movies).map(function(m){ return _.values(m)}).flatten().value().indexOf(id) == -1){
			movie.year   = year;
			movie.imdbid = id;
			movie.title  = title;
			movies.push(movie);
		}
	})

	callback(movies)
}


// When all done
// scrape.done(function(results){
// 	console.log(results)
// })

// Or on every incremental page
scrape.each(function(results){
	console.log(results)
})
