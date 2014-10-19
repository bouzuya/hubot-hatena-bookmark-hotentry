# Description
#   A Hubot script that display the hateb hotentry
#
# Configuration:
#   None
#
# Commands:
#   hubot hatena-bookmark-hotentry - display the hateb hotentry
#
# Author:
#   bouzuya <m@bouzuya.net>
#
module.exports = (robot) ->
  request = require 'request'
  cheerio = require 'cheerio'

  robot.respond /hate(?:na-)?b(?:ookmark)?-hotentry$/i, (res) ->
    request
      url: 'http://b.hatena.ne.jp/hotentry?layout=headline'
    , (err, _, body) ->
      return res.send(err) if err?
      $ = cheerio.load body
      entryLinks = $ '#main .box_main .entrylist-unit' # .entry-link'
      entries = []
      entryLinks.each ->
        e = $ @
        link = e.find '.entry-link'
        users = e.find '.entry-data .users span'
        title = link.text()
        url = link.attr 'href'
        count = users.text()
        entries.push { title, url, users: count }
      w = entries.reduce(((w, entry) -> Math.max(w, entry.users.length)), 0)
      lpad = (s, l) -> [s.length...l].reduce(((s) -> ' ' + s), s)
      message = entries
        .filter (_, i) ->
          i < 10
        .map (entry) ->
          "#{lpad(entry.users, w)} users | #{entry.title} | #{entry.url}"
        .join '\n'
      res.send message
