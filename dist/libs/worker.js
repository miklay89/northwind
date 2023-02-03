"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const workerId = `primary-${(0, uuid_1.v4)()}.render.db`;
exports.default = workerId;
