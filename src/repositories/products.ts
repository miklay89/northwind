import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm/expressions";
import dbObject from "../data/db";
import { Product } from "../data/schema";
import Info from "../entities/info";
import { timestampFunc, calcExecutionTime } from "../libs/timer";
import workerId from "../libs/worker";
import { ProductInOrder, ProductWithSupplier } from "../types/types";

dotenv.config();

const { db } = dbObject;
const { productsTable, orderDetailsTable, suppliersTable } = dbObject.Tables;
const limit = process.env.LIMIT;

export default class ProductsRepositories {
  static async getCount(): Promise<{ data: number; info: Info } | null> {
    const ts = timestampFunc();
    const startExec = Date.now();

    const count = await db
      .select({
        count: sql<number>`count(${productsTable.productID})`,
      })
      .from(productsTable);

    if (!count.length) return null;

    return {
      data: +count[0].count,
      info: new Info(
        db
          .select({
            count: sql<number>`count(${productsTable.productID})`,
          })
          .from(productsTable)
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }

  static async getProductsInOrderByOrderID(
    id: number,
  ): Promise<{ data: ProductInOrder[]; info: Info }> {
    const ts = timestampFunc();
    const startExec = Date.now();

    const products = await db
      .select({
        productID: orderDetailsTable.productID,
        productName: productsTable.productName,
        quantity: orderDetailsTable.quantity,
        unitPrice: orderDetailsTable.unitPrice,
        totalProductPrice: sql<string>`(${orderDetailsTable.unitPrice} * ${orderDetailsTable.quantity})`,
        discount: orderDetailsTable.discount,
      })
      .from(orderDetailsTable)
      .leftJoin(
        productsTable,
        eq(productsTable.productID, orderDetailsTable.productID),
      )
      .where(eq(orderDetailsTable.orderID, id));

    return {
      data: products,
      info: new Info(
        db
          .select({
            productID: orderDetailsTable.productID,
            productName: productsTable.productName,
            quantity: orderDetailsTable.quantity,
            unitPrice: orderDetailsTable.unitPrice,
            totalProductPrice: sql<string>`(${orderDetailsTable.unitPrice} * ${orderDetailsTable.quantity})`,
            discount: orderDetailsTable.discount,
          })
          .from(orderDetailsTable)
          .leftJoin(
            productsTable,
            eq(productsTable.productID, orderDetailsTable.productID),
          )
          .where(eq(orderDetailsTable.orderID, id))
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }

  static async getIndexedProducts(
    page: number,
  ): Promise<{ data: Product[]; info: Info } | null> {
    const offset = limit * (page - 1);
    const ts = timestampFunc();
    const startExec = Date.now();

    const products = await db
      .select()
      .from(productsTable)
      .limit(limit)
      .offset(offset);

    if (!products.length) return null;

    return {
      data: products,
      info: new Info(
        db.select().from(productsTable).limit(limit).offset(offset).toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }

  static async getProductByID(
    id: number,
  ): Promise<{ data: ProductWithSupplier; info: Info } | null> {
    const ts = timestampFunc();
    const startExec = Date.now();

    const product = await db
      .select()
      .from(productsTable)
      .leftJoin(
        suppliersTable,
        eq(suppliersTable.supplierID, productsTable.supplierID),
      )
      .where(eq(productsTable.productID, id));

    if (!product.length) return null;

    return {
      data: product[0],
      info: new Info(
        db
          .select()
          .from(productsTable)
          .leftJoin(
            suppliersTable,
            eq(suppliersTable.supplierID, productsTable.supplierID),
          )
          .where(eq(productsTable.productID, id))
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }
}
