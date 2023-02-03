"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../libs/db"));
const worker_1 = __importDefault(require("../libs/worker"));
dotenv_1.default.config();
const db = db_1.default.Connector;
const { productsTable } = db_1.default.Tables;
const allProducts = async (req, res) => {
    const { page } = req.body;
    const limit = +process.env.LIMIT;
    const offset = limit * (+page - 1);
    const stat = [];
    try {
        const countTS = new Date().toISOString().slice(0, 19).replace("T", " ");
        const countStart = Date.now();
        const count = await db.execute((0, drizzle_orm_1.sql) `select count(${productsTable.productID}) from ${productsTable}`);
        const countInfo = {
            queryString: `select count(1) from products`,
            queryTS: countTS,
            queryExecutionTime: `${Date.now() - countStart}ms`,
        };
        stat.push(countInfo);
        const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
        const startQueryTime = Date.now();
        const query = await db.select(productsTable).limit(limit).offset(offset);
        const queryInfo = {
            queryString: db.select(productsTable).limit(limit).offset(offset).toSQL()
                .sql,
            queryTS,
            queryExecutionTime: `${Date.now() - startQueryTime}ms`,
        };
        stat.push(queryInfo);
        if (!query.length) {
            return res.status(404).json({ message: "Not found." });
        }
        const response = {
            data: query,
            count: +count.rows[0].count,
            queryInfo: stat,
            workerId: worker_1.default,
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
exports.default = allProducts;
