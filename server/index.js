const express = require('express');
const path = require('path');
const fs = require('fs');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const appPath = path.join(BUILD_DIR, 'server-bundle');

const App = require(appPath).App.default;

const STATIC_DIR = path.join(BUILD_DIR, 'static');
const PORT = 4000;

const indexHtml = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf-8');

const expressApp = express();

expressApp.use('/static', express.static(STATIC_DIR));

app.get('*', (req, res) => {
  res.send(indexHtml);
});


expressApp.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
