"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cors = require("cors");
exports.default = cors({
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200'],
});
