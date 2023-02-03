"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const customers_1 = __importDefault(require("./routes/customers"));
const employees_1 = __importDefault(require("./routes/employees"));
const orders_1 = __importDefault(require("./routes/orders"));
const products_1 = __importDefault(require("./routes/products"));
const search_1 = __importDefault(require("./routes/search"));
const suppliers_1 = __importDefault(require("./routes/suppliers"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/", customers_1.default);
app.use("/", employees_1.default);
app.use("/", orders_1.default);
app.use("/", products_1.default);
app.use("/", search_1.default);
app.use("/", suppliers_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server has been started on port ${PORT}...`);
});
