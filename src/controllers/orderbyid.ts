import { RequestHandler } from "express";
import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import orm from "../libs/db";
import { OrderInfo, ProductsInOrder } from "./types";
import workerId from "../libs/worker";

dotenv.config();

const db = orm.Connector;

// select single order by id and products in order information
const singleOrder: RequestHandler = async (req, res) => {
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

    // timestamp for queries
    const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
    // timer start
    const startQueryOrderInfoTime = Date.now();

    const orderInfo = await db.execute<OrderInfo[]>(sql`
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
    // timer end
    const endQueryOrderInfoTime = Date.now();
    // execution time
    const queryOrderInfoTimeExecutionTime = `${
      endQueryOrderInfoTime - startQueryOrderInfoTime
    }ms`;

    // timer start
    const startQueryProductsInOrderTime = Date.now();

    const productsInOrder = await db.execute<ProductsInOrder[]>(
      sql`
        SELECT
        OrdDet."ProductID",
        Prd."ProductName",
        OrdDet."Quantity",
        OrdDet."UnitPrice",
        (OrdDet."UnitPrice" * OrdDet."Quantity") AS Total_Products_Price,
        OrdDet."Discount"
        FROM order_details OrdDet, Products Prd
        WHERE OrdDet."ProductID" = Prd."ProductID" AND OrdDet."OrderID" = ${id}
      `,
    );
    // timer end
    const endProductsInOrderTime = Date.now();
    // execution time
    const queryProductsInOrderTimeExecutionTime = `${
      endProductsInOrderTime - startQueryProductsInOrderTime
    }ms`;

    if (!orderInfo.rows.length) {
      return res.status(404).json({ message: "Not found." });
    }

    // response object
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
          workerId,
        },
        productsInOrder: {
          queryString: queryProductsInOrderString,
          queryTS,
          queryExecutionTime: queryProductsInOrderTimeExecutionTime,
          workerId,
        },
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

export default singleOrder;
