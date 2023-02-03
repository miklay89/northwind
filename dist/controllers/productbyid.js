"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const expressions_1 = require("drizzle-orm/expressions");
const db_1 = __importDefault(require("../libs/db"));
const worker_1 = __importDefault(require("../libs/worker"));
dotenv_1.default.config();
const db = db_1.default.Connector;
const { productsTable, suppliersTable } = db_1.default.Tables;
const singleProduct = async (req, res) => {
    const id = +req.params.id;
    try {
        const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
        const startQueryTime = Date.now();
        const query = await db
            .select(productsTable)
            .leftJoin(suppliersTable, (0, expressions_1.eq)(productsTable.supplierID, suppliersTable.supplierID))
            .where((0, expressions_1.eq)(productsTable.productID, id));
        const endQueryTime = Date.now();
        const queryExecutionTime = `${endQueryTime - startQueryTime}ms`;
        if (!query.length) {
            return res.status(404).json({ message: "Not found." });
        }
        const response = {
            data: query,
            queryInfo: {
                queryString: db
                    .select(productsTable)
                    .leftJoin(suppliersTable, (0, expressions_1.eq)(productsTable.supplierID, suppliersTable.supplierID))
                    .where((0, expressions_1.eq)(productsTable.productID, id))
                    .toSQL().sql,
                queryTS,
                queryExecutionTime,
                workerId: worker_1.default,
            },
        };
        res.json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return res.status(400).json({
                error_msg: error.message,
            });
        }
    }
    return null;
};
exports.default = singleProduct;
