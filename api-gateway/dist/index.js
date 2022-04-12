"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var express = require("express");
var cors = require("cors");
var expressProxy = require("express-http-proxy");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var helmet_1 = require("helmet");
var app = express();
app.use(cors());
var userServiceProxy = expressProxy('http://localhost:8000');
app.get('/api/users', function (req, res, next) {
    userServiceProxy(req, res, next);
});
app.use(logger('dev'));
app.use((0, helmet_1.default)());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
var server = http.createServer(app);
server.listen(3000, function () {
    console.log('Server is running on port 3000');
});
