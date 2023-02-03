"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const allorders_1 = __importDefault(require("../controllers/allorders"));
const orderbyid_1 = __importDefault(require("../controllers/orderbyid"));
const router = (0, express_1.default)();
router.get("/orders", allorders_1.default);
router.get("/orders/:id", orderbyid_1.default);
exports.default = router;
