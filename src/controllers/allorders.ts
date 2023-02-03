import { RequestHandler } from "express";
import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import orm from "../libs/db";
import { AllOrders } from "./types";
import workerId from "../libs/worker";

dotenv.config();

const db = orm.Connector;

const allOrders: RequestHandler = async (req, res) => {
  const { page } = req.body;
  const limit = +(process.env.LIMIT as string);
  const offset = limit * (+page - 1);
  try {
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
    // timestamp for query
    const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
    // timer start
    const startQueryTime = Date.now();
    const query = await db.execute<AllOrders[]>(
      sql`
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
      `,
    );
    // timer end
    const endQueryTime = Date.now();
    // execution time
    const queryExecutionTime = `${endQueryTime - startQueryTime}ms`;
    if (!query.rows.length) {
      return res.status(404).json({ message: "Not found." });
    }
    // response object
    const response = {
      data: query.rows,
      queryInfo: {
        queryString,
        queryTS,
        queryExecutionTime,
        workerId,
      },
    };
    res.json(response);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(400).json({
        error_msg: error.message,
      });
    }
  }
  return null;
};

export default allOrders;
