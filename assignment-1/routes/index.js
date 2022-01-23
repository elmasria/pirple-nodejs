const handlers = require('./handlers');

const routers = {
  '': handlers.main,
  '/hello': handlers.main
}

module.exports = routers;
