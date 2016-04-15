var http = require('http'); 
var url = require('url'); // this lets us maniuplate the url
var fs = require('fs'); // This lets us read and write to the index files
var ejs = require('ejs'); // Modules that lets use variables in the html
var qs = require('querystring'); // module that allows the access to query string
var locale = require("locale"); //module for negotiating HTTP locales for incoming browser requests
var post, lang, method, path;

var server = http.createServer( function(req, res) {
path = url.parse(req.url, true).pathname;
lang = req.headers["accept-language"];
// only work on the "/" local host and if there was a POST request
    if (req.method === 'POST' && path === '/') {
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
          post = qs.parse(body);
        // Check to see if there is a "postVar" if not return a 400 Error
        // The POST request has fully come in which mean all the params that were sent should be present
        // We check now for postVar becuase if it's there we will find it if not send the 400 Error
            if(post['postVar'] === undefined || post['postVar'] === null){
              // This is the respopnse header meaning The server cannot or will not process the request due to an apparent client error 
              res.end('400');
            }
        });
       
        method = req.method

        // this is the HTML that is populated with the information of the POST request
        var postHtml = '<!DOCTYPE html>' + '<html><body>' + '<p>' + '<br/>' + 'Your language is: ' + '<%= lang %>' + '<br/>' + 'You sent a ' + '<%= method %>' +' request' + 'Your POST variable value: ' + '<%= post %>' + '</p></body></html>'; 
        //This uses the EJS library to give the ability to share variables from the node file to the html file
        var renderedPostHtml = ejs.render(postHtml, {lang: lang, method: method, post: post, });
         // This is the respopnse header meaning the request has been fulfilled, resulting in the creation of a new resource

        // Reads the HTML file so we can write to it
        fs.readFile(__dirname + '/index.html', function(err, data){
          if(err) { // makes sure to handle an Error
            console.log(err);
            res.end(data);
          }
        res.writeHead(201, {'Content-Type': 'text/html'}); 
        // Write the rendered POST HTML to the index.html
        res.end(renderedPostHtml);
        });
       
    }
// only work on the "/" local host and if there was a GET request
    else if(req.method === 'GET' && path === '/') {
        method = req.method
         // this is the HTML that is populated with the information of the GET request
        var getHtml = '<!DOCTYPE html>'+ '<html><body>' + '<p>' + '<br/>'+ 'Your language is: ' + '<%= lang %>' + '<br/>'+ 'You sent a ' + '<%= method %>' + ' request' + '</p></body></html>';
        //This uses the EJS library to give the ability to share variables from the node file to the html file 
        var renderedGetHtml = ejs.render(getHtml, {lang: lang, method: method });
        console.log(renderedGetHtml);
        // Reads the HTML file so we can write to it
        fs.readFile(__dirname + '/index.html', function(err, data){
          if(err) { // makes sure to handle an Error
            console.log(err);
            res.end(data);
          }
        // This is the respopnse header for successful HTTP requests
        res.writeHead(200, {'Content-Type': 'text/html'}); 
        // Write the rendered GET HTML to the index.html
        res.end(renderedGetHtml);
        });
            
      }
    else {
// Return a 404 error for not being a POST/GET request or from origin "/"
      res.end('404');
    }
});

var port = 8000; // port in which the server will run
var ip = '127.0.0.1'; // the IP address for the wesite


server.listen(port, ip);
console.log('Listening at http://' + ip + ':' + port);  // running at 127.0.0.1:8000




