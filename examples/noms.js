var fs        = require('fs'),
		Scraper   = require('../lib/scratch-n-sniff.js'),
		_         = require('underscore');

var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013];

// TODO find a balance between chained method calls and feeding params to a single function
var scrape = Scraper()
									.data(years)
									.url('http://www.imdb.com/event/ev0000003/', function(d) { return d })
									.extractor(parsePage, function(d) { return d } )
									.rateLimit(1000)
									.format('csv') // Defaults to json
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
