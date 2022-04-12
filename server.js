//Install express server
var express = require('express');  // eslint-disable-line no-console
var path = require('path');

var app = express();

// Serve only the static files form the dist directory
app.use(express.static('./dist/angular-app-heroku'));
// eslint-disable-next-line no-console
app.get('/*', function (_req, res) {
  return res.sendFile('index.html', { root: 'dist/bubbler/' })
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
