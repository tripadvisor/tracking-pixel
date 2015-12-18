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
,   query = require('querystring')
,   Promise = require('promise')
,   server = http.createServer(handleRequest)
;

function processPost(req, res) {

  return new Promise(function(accept, reject) {
    var queryData = '';

    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'text/plain' }).end();
      reject();
      return;
    }

    req.on('data', function(data) {
      queryData += data;
      if (queryData.length > 1e6) {
        queryData = '';
        res.writeHead(413, {'Content-Type': 'text/plain'}).end();
        req.connection.destroy();
        reject();
      }
    });

    req.on('end', function() {
      accept(query.parse(queryData));
    });
  });
}

function handleRequest(req, res) {

  if (req.method === 'POST') {
    processPost(req, res).then(function (data) {
      res.writeHead(200, {
        'Content-Type': 'text/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'
      });
      res.write(JSON.stringify(data));
      res.end();
    });
  } else {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'
    });
    res.end();
  }
}

server.listen(PORT, function() { console.log('server listening on port ' + PORT); });
