var request      = require('request'),
    cheerio      = require('cheerio'),
    _            = require('underscore'),
    queue_async  = require('queue-async');

/* Rate limiting */

// Rate limit ensures a function is never called more than every [rate]ms
// Unlike underscore's _.throttle function, function calls are queued so that
//   requests are never lost and simply deferred until some other time
//
// Parameters
// * func - function to rate limit
// * rate - minimum time to wait between function calls (ms)
// * async - if async is true, we won't wait (rate) for the function to complete before queueing the next request
//
// Example
// function showStatus(i) {
//   console.log(i);
// }
// var showStatusRateLimited = _.rateLimit(showStatus, 200);
// for (var i = 0; i < 10; i++) {
//   showStatusRateLimited(i);
// }
//
// Dependencies
// * underscore.js

var q = queue_async();

_.rateLimit = function(func, rate, async) {
  var queue_rl = [];
  var currentlyEmptyingQueue = false;
  
  var emptyQueue = function() {
    if (queue_rl.length) {
      currentlyEmptyingQueue = true;
      _.delay(function() {
        if (async) {
          _.defer(function() { queue_rl.shift().call(); });
        } else {
          queue_rl.shift().call();
        }
        emptyQueue();
      }, rate);
    } else {
      currentlyEmptyingQueue = false;
    }
  };
  return function() {
    var args = _.values(arguments); // get arguments into an array
    queue_rl.push( _.bind.apply(this, [func, this].concat(args)) ); // call apply so that we can pass in arguments as parameters as opposed to an array
    if (!currentlyEmptyingQueue) { emptyQueue(); }
  };
};

var extractorFn;
function threeSteps(url, extractor, opts){
  extractorFn = extractor;
  q.defer(scraper, url, opts)
}
threeSteps.awaitAll = q.awaitAll;

function scraper(url, opts, cb){
  request(url, function (err, response, body) {
    if (err) {throw err};
    // return the err, the html to be scraped
    extractorFn(err, cheerio.load(body), opts, cb)
  })

}

// Create a rateLimited scraper
threeSteps.rateLimit = function(rate){
  var fn = _.rateLimit(threeSteps, rate);
  fn.awaitAll = q.awaitAll
  return fn
}


module.exports = threeSteps;




