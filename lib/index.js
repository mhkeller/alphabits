var request      = require('request'),
    cheerio      = require('cheerio'),
    _            = require('underscore'),
    dsv          = require('dsv');

/* Rate limiting */

// Rate limit ensures a function is never called more than every [rate]ms
// Unlike underscore's _.throttle function, function calls are queued so that
//   requests are never lost and simply deferred until some other time
//
// Parameters
// * func - function to rate limit
// * rate - mdinimum time to wait between function calls (ms)
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
    if (!currentlyEmptyingQueue) emptyQueue();
  };
};

function scraper_fn(){
  var data_list,
      url_string,
      urlAccessor,
      extractorAccessor,
      extractorFn,
      request_numb = 0,
      request_total,
      result_arr = [],
      rl_rate = 0,
      scrapeTargetFormat = 'webpage',
      resultFormat = 'json';

  function scraper(){ }

  scraper.data = function(value){
    if (!arguments.length) return data_list;
    data_list = value;
    request_total  = data_list.length;
    return scraper;
  }

  scraper.url = function(value, accessor){
    if (!arguments.length) return url_string;
    url_string   = value;
    urlAccessor  = accessor;
    return scraper;
  }

  scraper.extractor = function(value){
    if (!arguments.length) return extractorFn;
    extractorFn        = value;
    return scraper;
  }

  scraper.rateLimit = function(rate){
    if (!arguments.length) return rl_rate;
    rl_rate = rate;
    return scraper;
  }

  scraper.resultFormat = function(value){
    if (!arguments.length) return resultFormat;
    resultFormat = value;
    return scraper;
  }

  scraper.scrapeTargetFormat = function(value){
    if (!arguments.length) return scrapeTargetFormat;
    scrapeTargetFormat = value;
    return scraper;
  }

  scraper.start = function(cb){
    var that = this,
        opts;

    scraper.processRated = _.rateLimit(scraper.process, rl_rate);

    cb = _.after(request_total, cb); // Only fire the callback after all the calls are done
    data_list.forEach(function(datum){
      opts = urlAccessor(datum);
      that.processRated(url_string + opts, datum, cb);
    })
  }

  scraper.process = function(url, datum, cb, async){
    var that = this;
    request(url, function (err, response, body) {
      if (err) throw err;
      var progress = 'Fetching ' + (request_numb + 1) + '/' + request_total;

      if (scrapeTargetFormat == 'webpage') {
        body = cheerio.load(body);
      } else if (scrapeTargetFormat == 'json') {
        body = JSON.parse(body);
      }
      extractorFn(body, datum, function(result){
        result_arr.push(result);
        request_numb++;
        if (resultFormat == 'csv') { cb(dsv.csv.format(_.flatten(result_arr))); return false; }
        cb(result_arr);
      }, progress);
    });      
  }

  return scraper;

}


// Create a rateLimited scraper
scraper_fn.rateLimit = function(rate){
  var fn = _.rateLimit(scraper_fn, rate);
  return fn
}


module.exports = scraper_fn;

