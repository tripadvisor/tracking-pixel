/**
 * Dummy Server
 *
 * Acts like the TA Pixel servlet for rapid testing
 *
 * @author mtownsend
 * @since Dec 2015
 **/

'use strict';

var PORT = 80;

var http = require('http')
,   url = require('url')
,   query = require('querystring')
,   server = http.createServer(handleRequest)
;

function handleRequest(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'
  });
  res.write(JSON.stringify(url.parse(req.url, true).query));
  res.end();
}

server.listen(PORT, function() { console.log('server listening on port ' + PORT); });
