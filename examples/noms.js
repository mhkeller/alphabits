var fs        = require('fs'),
		Scraper   = require('../lib/scratch-n-sniff.js'),
		_         = require('underscore');
 
var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013];

var scrape = Scraper()
									.data(years)
									.url('http://www.imdb.com/event/ev0000003/', function(d) { return d })
									.extractor(parsePage, function(d) { return d } )
									.rateLimit(1000);

// When all done
scrape.done(function(results){
	console.log(results)
})

function parsePage($, year, cb){
	var info = {};
	info[year] = { imdbid: [], titles: []	};
	
	$('[class^=alt] strong').each(function(index, el){
		var id    = $(el).find('a').attr('href').split('/')[2].replace('tt',''),
				title = $(el).find('a').html().replace('&#xE9;', 'é').replace('&#x27;' , '\'').replace('&#x26;', '&');

		info[year].imdbid.push(id);
		info[year].titles.push(title);
	})

	info[year].imdbid = _.uniq(info[year].imdbid)
	info[year].titles = _.uniq(info[year].titles)
	cb(info)

}

