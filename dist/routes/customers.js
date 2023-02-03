"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const allcustomers_1 = __importDefault(require("../controllers/allcustomers"));
const customerbyid_1 = __importDefault(require("../controllers/customerbyid"));
const router = (0, express_1.default)();
router.get("/customers", allcustomers_1.default);
router.get("/customers/:id", customerbyid_1.default);
exports.default = router;
