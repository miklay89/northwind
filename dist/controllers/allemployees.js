"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../libs/db"));
const worker_1 = __importDefault(require("../libs/worker"));
dotenv_1.default.config();
const db = db_1.default.Connector;
const { employeesTable } = db_1.default.Tables;
const allEmployees = async (req, res) => {
    const { page } = req.body;
    const limit = +process.env.LIMIT;
    const offset = limit * (+page - 1);
    try {
        const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
        const startQueryTime = Date.now();
        const query = await db.select(employeesTable).limit(limit).offset(offset);
        const endQueryTime = Date.now();
        const queryExecutionTime = `${endQueryTime - startQueryTime}ms`;
        if (!query.length) {
            return res.status(404).json({ message: "Not found." });
        }
        const response = {
            data: query,
            queryInfo: {
                queryString: db
                    .select(employeesTable)
                    .limit(limit)
                    .offset(offset)
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
exports.default = allEmployees;
