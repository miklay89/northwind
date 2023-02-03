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
const { productsTable, customersTable } = db_1.default.Tables;
const searchController = async (req, res) => {
    const tableName = req.body.table;
    const searchString = req.body.search;
    if (!tableName.length || !searchString.length)
        return res.status(404).json({ message: "Search body required." });
    try {
        if (tableName === "customers") {
            const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
            const startQueryTime = Date.now();
            const query = await db
                .select(customersTable)
                .where((0, expressions_1.or)((0, expressions_1.ilike)(customersTable.companyName, `%${searchString}%`), (0, expressions_1.ilike)(customersTable.contactName, `%${searchString}%`), (0, expressions_1.ilike)(customersTable.contactTitle, `%${searchString}%`), (0, expressions_1.ilike)(customersTable.address, `%${searchString}%`)));
            const endQueryTime = Date.now();
            const queryExecutionTime = `${endQueryTime - startQueryTime}ms`;
            if (!query.length) {
                return res.status(404).json({ message: "Not found." });
            }
            const response = {
                data: query,
                queryInfo: {
                    queryString: db
                        .select(customersTable)
                        .where((0, expressions_1.or)((0, expressions_1.ilike)(customersTable.companyName, `%${searchString}%`), (0, expressions_1.ilike)(customersTable.contactName, `%${searchString}%`), (0, expressions_1.ilike)(customersTable.contactTitle, `%${searchString}%`), (0, expressions_1.ilike)(customersTable.address, `%${searchString}%`)))
                        .toSQL().sql,
                    queryTS,
                    queryExecutionTime,
                    workerId: worker_1.default,
                },
            };
            return res.json(response);
        }
        if (tableName === "products") {
            const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
            const startQueryTime = Date.now();
            const query = await db
                .select(productsTable)
                .where((0, expressions_1.ilike)(productsTable.productName, `%${searchString}%`));
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
                        .where((0, expressions_1.ilike)(productsTable.productName, `%${searchString}%`))
                        .toSQL().sql,
                    queryTS,
                    queryExecutionTime,
                    workerId: worker_1.default,
                },
            };
            return res.json(response);
        }
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
exports.default = searchController;
