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
,   path = require('path')
,   fs = require('fs')
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

function serveFile(req, res) {
  var filePath = '.' + req.url
  ,   ext
  ,   type
  ;

  if (filePath === './') { filePath = './test.html' }
  ext = path.extname(filePath);
  if (ext === '.js') {
    type = 'text/javascript';
  }
  type = ext === '.js' ? 'text/javascript' : 'text/html';
  fs.readFile(filePath, function(error, content) {
    if (error) {
      res.writeHead(404, { 'Content-Type': type });
      res.end();
    }
    else {
      res.writeHead(200, {
        'Content-Type': type,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'
      });
      res.end(content, 'utf-8');
    }
  });

}

function handleRequest(req, res) {

  if (req.method === 'POST') {
    processPost(req, res).then(function (data) {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'
      });
      res.write(JSON.stringify(data));
      res.end();
    });
  } else {
    serveFile(req, res);
  }
}

server.listen(PORT, function() { console.log('server listening on port ' + PORT); });
