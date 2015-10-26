
module.exports = createJSONMiddleware

function createJSONMiddleware() {
  return jsonMiddleware
}

function jsonMiddleware(req, res, next) {
  res.json = function(obj) {
    if (req.query.callback) {
      res.setHeader('Content-Type', 'text/javascript')
      res.end(req.query.callback + '(' + JSON.stringify(obj) + ')')
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(obj, null, 2))
    }
  }
  next()
}
