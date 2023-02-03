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
const { ordersTable } = db_1.default.Tables;
const allOrders = async (req, res) => {
    const { page } = req.body;
    const limit = +process.env.LIMIT;
    const offset = limit * (+page - 1);
    const stat = [];
    try {
        const countTS = new Date().toISOString().slice(0, 19).replace("T", " ");
        const countStart = Date.now();
        const count = await db.execute((0, drizzle_orm_1.sql) `select count(${ordersTable.orderID}) from ${ordersTable}`);
        const countInfo = {
            queryString: `select count(1) from orders`,
            queryTS: countTS,
            queryExecutionTime: `${Date.now() - countStart}ms`,
        };
        stat.push(countInfo);
        const queryString = `
      SELECT 
      Ord."OrderID", 
      SUM(OrdDet."UnitPrice" * OrdDet."Quantity") AS Total_Products_Price, 
      SUM(OrdDet."Quantity") AS Total_Products_Items, 
      COUNT(OrdDet."OrderID") AS Total_Products_Quantity, 
      Ord."ShippedDate", 
      Ord."ShipName", 
      Ord."ShipCity", 
      Ord."ShipCountry"
      FROM order_details OrdDet, orders Ord 
      WHERE OrdDet."OrderID" = Ord."OrderID" 
      GROUP BY Ord."OrderID" 
      ORDER BY "OrderID"
      LIMIT ${limit} OFFSET ${offset}
    `;
        const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
        const startQueryTime = Date.now();
        const query = await db.execute((0, drizzle_orm_1.sql) `
        SELECT 
        Ord."OrderID", 
        SUM(OrdDet."UnitPrice" * OrdDet."Quantity") AS Total_Products_Price, 
        SUM(OrdDet."Quantity") AS Total_Products_Items, 
        COUNT(OrdDet."OrderID") AS Total_Products_Quantity, 
        Ord."ShippedDate", 
        Ord."ShipName", 
        Ord."ShipCity", 
        Ord."ShipCountry"
        FROM order_details OrdDet, orders Ord 
        WHERE OrdDet."OrderID" = Ord."OrderID" 
        GROUP BY Ord."OrderID" 
        ORDER BY "OrderID"
        LIMIT ${limit} OFFSET ${offset}
      `);
        const queryInfo = {
            queryString,
            queryTS,
            queryExecutionTime: `${Date.now() - startQueryTime}ms`,
        };
        stat.push(queryInfo);
        if (!query.rows.length) {
            return res.status(404).json({ message: "Not found." });
        }
        const response = {
            data: query.rows,
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
exports.default = allOrders;
