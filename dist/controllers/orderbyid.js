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
const singleOrder = async (req, res) => {
    const id = +req.params.id;
    try {
        const queryOrderInfoString = `
      SELECT
      SUM(OrdDet."UnitPrice" * OrdDet."Discount" * OrdDet."Quantity") AS Total_Products_Discount, 
      SUM(OrdDet."UnitPrice" * OrdDet."Quantity") AS Total_Products_Price, 
      SUM(OrdDet."Quantity") AS Total_Products_Items, 
      COUNT(OrdDet."OrderID") AS Total_Products, 
      Ord."CustomerID", 
      Ord."OrderID", 
      Ord."ShippedDate", 
      Ord."ShipName", 
      Ord."ShipCity", 
      Shp."CompanyName", 
      Ord."ShipCountry", 
      Ord."Freight",
      Ord."OrderDate", 
      Ord."RequiredDate",
      Ord."ShipRegion", 
      Ord."ShipPostalCode"
      FROM order_details OrdDet, Orders Ord, Shippers Shp
      WHERE OrdDet."OrderID" = Ord."OrderID" AND Ord."ShipVia" = Shp."ShipperID" AND Ord."OrderID" = ${id}
      group by Ord."OrderID", Shp."ShipperID"
    `;
        const queryProductsInOrderString = `
      SELECT
      OrdDet."ProductID",
      Prd."ProductName",
      OrdDet."Quantity",
      OrdDet."UnitPrice",
      (OrdDet."UnitPrice" * OrdDet."Quantity") AS Total_Products_Price,
      OrdDet."Discount"
      FROM order_details OrdDet, Products Prd
      WHERE OrdDet."ProductID" = Prd."ProductID" AND OrdDet."OrderID" = ${id}
    `;
        const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
        const startQueryOrderInfoTime = Date.now();
        const orderInfo = await db.execute((0, drizzle_orm_1.sql) `
      SELECT
      SUM(OrdDet."UnitPrice" * OrdDet."Discount" * OrdDet."Quantity") AS Total_Products_Discount, 
      SUM(OrdDet."UnitPrice" * OrdDet."Quantity") AS Total_Products_Price, 
      SUM(OrdDet."Quantity") AS Total_Products_Items, 
      COUNT(OrdDet."OrderID") AS Total_Products, 
      Ord."CustomerID", 
      Ord."OrderID", 
      Ord."ShippedDate", 
      Ord."ShipName", 
      Ord."ShipCity", 
      Shp."CompanyName", 
      Ord."ShipCountry", 
      Ord."Freight",
      Ord."OrderDate", 
      Ord."RequiredDate",
      Ord."ShipRegion", 
      Ord."ShipPostalCode"
      FROM order_details OrdDet, Orders Ord, Shippers Shp
      WHERE OrdDet."OrderID" = Ord."OrderID" AND Ord."ShipVia" = Shp."ShipperID" AND Ord."OrderID" = ${id}
      group by Ord."OrderID", Shp."ShipperID"
    `);
        const endQueryOrderInfoTime = Date.now();
        const queryOrderInfoTimeExecutionTime = `${endQueryOrderInfoTime - startQueryOrderInfoTime}ms`;
        const startQueryProductsInOrderTime = Date.now();
        const productsInOrder = await db.execute((0, drizzle_orm_1.sql) `
        SELECT
        OrdDet."ProductID",
        Prd."ProductName",
        OrdDet."Quantity",
        OrdDet."UnitPrice",
        (OrdDet."UnitPrice" * OrdDet."Quantity") AS Total_Products_Price,
        OrdDet."Discount"
        FROM order_details OrdDet, Products Prd
        WHERE OrdDet."ProductID" = Prd."ProductID" AND OrdDet."OrderID" = ${id}
      `);
        const endProductsInOrderTime = Date.now();
        const queryProductsInOrderTimeExecutionTime = `${endProductsInOrderTime - startQueryProductsInOrderTime}ms`;
        if (!orderInfo.rows.length) {
            return res.status(404).json({ message: "Not found." });
        }
        const response = {
            data: {
                orderInfo: orderInfo.rows,
                productsInOrder: productsInOrder.rows,
            },
            queryInfo: {
                orderInfo: {
                    queryString: queryOrderInfoString,
                    queryTS,
                    queryExecutionTime: queryOrderInfoTimeExecutionTime,
                    workerId: worker_1.default,
                },
                productsInOrder: {
                    queryString: queryProductsInOrderString,
                    queryTS,
                    queryExecutionTime: queryProductsInOrderTimeExecutionTime,
                    workerId: worker_1.default,
                },
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
exports.default = singleOrder;
