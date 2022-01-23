const http = require('http');
const url = require('url');

const StringDecoder = require('string_decoder').StringDecoder;

const config = require('./config');
const routers = require('./routes/index');

const httpServer = http.createServer((req, res) => {
    // get the url and do parse it
    const parsedUrl = url.parse(req.url, true);

    // get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get the query string object
    const queryStringObject = parsedUrl.query;

    // get the http method
    const method = req.method.toLowerCase();

    // get headers queryStringObject
    const headers = req.headers;

    // get payload
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (data) => {
      buffer += decoder.write(data);
    });

    req.on('end', () => {
      buffer += decoder.end();

      const targetHandler = typeof(routers[trimmedPath]) !== 'undefined' ? routers[trimmedPath] : routers[''];

      const data = {
        trimmedPath,
        queryStringObject,
        method,
        headers,
        payload: buffer
      };
            
      targetHandler(data, (statusCode, payload) => {
        statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
        payload = typeof(payload) === 'object' ? payload : {};

        const payloadString = JSON.stringify(payload);

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
      });
    });
});

httpServer.listen(config.PORT, () => {
  console.log(`The server is listening on port ${config.PORT}`);
});
