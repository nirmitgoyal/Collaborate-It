// import 'amd-loader';
import angular from 'angular';
import 'angular-ui-router';
import 'angular-cookies';
import 'jquery';
import 'bootstrap';	
// import 'firebase';
// import 'ace-builds/src-noconflict';
// require('../../node_modules/codemirror/src/edit/CodeMirror.js');
// var cm = require('codemirror');
// import 'codemirror';
// import 'angular-ui-ace';

// import * as Firepad from 'firepad';
// import 'ace/build/lib';


// angular modules
import constants from './constants';
import onConfig from './on_config';
import onRun from './on_run';
import './templates';
import './filters';
import './controllers';
import './services';
import './directives';

// create and bootstrap application
const requires = [
    // 'ui.ace',
    // 'ui.codemirror',
    'ui.router',
    'templates',
    'app.filters',
    'app.controllers',
    'app.services',
    'app.directives',
    'ngCookies'
];

// mount on window for testing
window.app = angular.module('app', requires);

angular.module('app').constant('AppSettings', constants);

angular.module('app').config(onConfig);

angular.module('app').run(onRun);

angular.bootstrap(document, ['app'], {
    strictDi: false
});

// import 'fs';con
// import fs from 'file-system';
// var fs = require('file-system');
// import fs from 'fs';
// var fs=require("fs");
// console.log("fs imported");
// fs.copyFileSync('./on_run.js', './copy.js');
// require("./src-noconflict/ace.js");
// console.log("copied");
// __dirname="/node_modules";
// var normalizedPath = require("path").join(__dirname, "ace-builds/src-noconflict");
// console.log(__dirname);
// console.log(normalizedPath);	
// fs.readFile('./on_run.js', function (err, data) {
//   if (err) throw err;
//   console.log(data);
// });
// fs.readdirSync(normalizedPath).forEach(function(file) {	
// 	console
//   require("ace-builds/src-noconflict/" + file);
// });
// requireDir('./path/to/dir');
// requireDir('ace-builds/src-noconflict');
