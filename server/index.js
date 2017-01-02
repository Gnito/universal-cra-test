const express = require('express');
const path = require('path');
const fs = require('fs');

const React = require('react');
const { renderToString } = require('react-dom/server');
const { ServerRouter, createServerRenderContext } = require('react-router');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const appPath = path.join(BUILD_DIR, 'server-bundle');

const App = require(appPath).App.default;

const STATIC_DIR = path.join(BUILD_DIR, 'static');
const PORT = 4000;

const indexHtml = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf-8');

const expressApp = express();

expressApp.use('/static', express.static(STATIC_DIR));


expressApp.get('*', (req, res) => {

  // first create a context for <ServerRouter>, it's where we keep the
  // results of rendering for the second pass if necessary
  const context = createServerRenderContext();

  // render the first time
  let ReactApp = renderToString(React.createElement(
    ServerRouter,
    { location: req.url, context: context },
    React.createElement(App, {})
  ));

  // get the result
  const result = context.getResult();

  // the result will tell you if it redirected, if so, we ignore
  // the ReactApp and send a proper redirect.
  if (result.redirect) {
    res.writeHead(301, {
      Location: result.redirect.pathname
    });
    res.end();
  } else {

    // the result will tell you if there were any misses, if so
    // we can send a 404 and then do a second render pass with
    // the context to clue the <Miss> components into rendering
    // this time (on the client they know from componentDidMount)
    if (result.missed) {
      res.writeHead(404);
      ReactApp = renderToString(React.createElement(
        ServerRouter,
        { location: req.url, context: context },
        React.createElement(App, {})
      ));
    }

    // TODO quick test with replace flag
    const markup = indexHtml.replace('{{SSR}}', ReactApp);
    res.write(markup);
    res.end();
  }
});


expressApp.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
