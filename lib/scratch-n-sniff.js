var request      = require('request'),
    cheerio      = require('cheerio'),
    _            = require('underscore');

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

var queue = [];

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

function scraper_fn(){
  var data_obj,
      url_string,
      urlAccessor,
      extractorAccessor,
      extractorFn,
      done,
      request_numb = 0,
      request_total,
      result_arr = [],
      rl_rate = 0;

  function scraper(){ }

  scraper.data = function(value){
    if (!arguments.length) return data_obj;
    data_obj = value;
    request_total  = _.size(data_obj)
    return scraper;
  }

  scraper.url = function(value, accessor){
    if (!arguments.length) return url_string;
    url_string   = value;
    urlAccessor  = accessor;
    return scraper;
  }

  scraper.extractor = function(value, accessor){
    if (!arguments.length) return extractorFn;
    extractorFn        = value;
    extractorAccessor  = accessor;
    return scraper;
  }

  scraper.rateLimit = function(rate){
    if (!arguments.length) return rl_rate;
    rl_rate = rate
    return scraper
  }

  scraper.done = function(cb){
    var that = this,
        opts;

    scraper.processRated = _.rateLimit(scraper.process, rl_rate)

    data_obj.forEach(function(datum){
      opts = urlAccessor(datum)
      that.processRated(url_string + opts, datum, cb)
    })
  }

  scraper.process = function(url, datum, cb){
    var that = this;
    request(url, function (err, response, body) {
      if (err) {throw err};
      var opts = extractorAccessor(datum);
      extractorFn(cheerio.load(body), opts, function(result){
        result_arr.push(result);
        request_numb++
        if (request_numb == request_total){
          cb(result_arr)
        }

      })
    })        
  }

  return scraper

}


// Create a rateLimited scraper
scraper_fn.rateLimit = function(rate){
  var fn = _.rateLimit(scraper_fn, rate);
  return fn
}


module.exports = scraper_fn;


// function chart() {
//   var width = 720, // default width
//       height = 80; // default height

//   function my() {
//     // generate chart here, using `width` and `height`
//   }

//   my.width = function(value) {
//     if (!arguments.length) return width;
//     width = value;
//     return my;
//   };

//   my.height = function(value) {
//     if (!arguments.length) return height;
//     height = value;
//     return my;
//   };

//   return my;
// }



