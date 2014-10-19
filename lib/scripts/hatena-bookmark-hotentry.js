// Description
//   A Hubot script that display the hateb hotentry
//
// Configuration:
//   None
//
// Commands:
//   hubot hatena-bookmark-hotentry - display the hateb hotentry
//
// Author:
//   bouzuya <m@bouzuya.net>
//
module.exports = function(robot) {
  var cheerio, request;
  request = require('request');
  cheerio = require('cheerio');
  return robot.respond(/hate(?:na-)?b(?:ookmark)?-hotentry$/i, function(res) {
    return request({
      url: 'http://b.hatena.ne.jp/hotentry?layout=headline'
    }, function(err, _, body) {
      var $, entries, entryLinks, lpad, message, w;
      if (err != null) {
        return res.send(err);
      }
      $ = cheerio.load(body);
      entryLinks = $('#main .box_main .entrylist-unit');
      entries = [];
      entryLinks.each(function() {
        var count, e, link, title, url, users;
        e = $(this);
        link = e.find('.entry-link');
        users = e.find('.entry-data .users span');
        title = link.text();
        url = link.attr('href');
        count = users.text();
        return entries.push({
          title: title,
          url: url,
          users: count
        });
      });
      w = entries.reduce((function(w, entry) {
        return Math.max(w, entry.users.length);
      }), 0);
      lpad = function(s, l) {
        var _i, _ref, _results;
        return (function() {
          _results = [];
          for (var _i = _ref = s.length; _ref <= l ? _i < l : _i > l; _ref <= l ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).reduce((function(s) {
          return ' ' + s;
        }), s);
      };
      message = entries.filter(function(_, i) {
        return i < 10;
      }).map(function(entry) {
        return "" + (lpad(entry.users, w)) + " users | " + entry.title + " | " + entry.url;
      }).join('\n');
      return res.send(message);
    });
  });
};
