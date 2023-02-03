"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const allproducts_1 = __importDefault(require("../controllers/allproducts"));
const productbyid_1 = __importDefault(require("../controllers/productbyid"));
const router = (0, express_1.default)();
router.get("/products", allproducts_1.default);
router.get("/products/:id", productbyid_1.default);
exports.default = router;
