"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const allemployees_1 = __importDefault(require("../controllers/allemployees"));
const employeebyid_1 = __importDefault(require("../controllers/employeebyid"));
const router = (0, express_1.default)();
router.get("/employees", allemployees_1.default);
router.get("/employees/:id", employeebyid_1.default);
exports.default = router;
