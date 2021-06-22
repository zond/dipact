// Note, this is a temporary work-around while we transition towards full react setup
const HTMLReactParser = require('html-react-parser');
const MUI = require('@material-ui/core');
const React = require('react');

global.MaterialUI = MUI;
global.React = React;
global.window.HTMLReactParser = HTMLReactParser;