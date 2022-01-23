const handlers = {
  main (data, callback) {
    callback(200, { message: 'Hello World' })
  }
}

module.exports = handlers;
