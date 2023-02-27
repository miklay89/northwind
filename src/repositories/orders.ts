import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm/expressions";
import dbObject from "../data/db";
import Info from "../entities/info";
import { timestampFunc, calcExecutionTime } from "../libs/timer";
import workerId from "../libs/worker";
import { CustomOrder, CustomOrderByID } from "../types/types";

dotenv.config();

const { db } = dbObject;
const { ordersTable, orderDetailsTable, shippersTable } = dbObject.Tables;
const limit = process.env.LIMIT;

export default class OrdersRepositories {
  static async getCount(): Promise<{ data: number; info: Info } | null> {
    const ts = timestampFunc();
    const startExec = Date.now();

    const count = await db
      .select({
        count: sql<number>`count(${ordersTable.orderID})`,
      })
      .from(ordersTable);

    if (!count.length) return null;

    return {
      data: +count[0].count,
      info: new Info(
        db
          .select({
            count: sql<number>`count(${ordersTable.orderID})`,
          })
          .from(ordersTable)
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }

  static async getIndexedOrders(
    page: number,
  ): Promise<{ data: CustomOrder[]; info: Info } | null> {
    const offset = limit * (page - 1);
    const ts = timestampFunc();
    const startExec = Date.now();

    const orders = await db
      .select({
        orderID: ordersTable.orderID,
        totalProductPrice: sql<string>`sum(${orderDetailsTable.unitPrice} * ${orderDetailsTable.quantity})`,
        totalProductsItems: sql<string>`sum(${orderDetailsTable.quantity})`,
        totalProductsQuantity: sql<string>`count(${orderDetailsTable.orderID})`,
        shippedDate: ordersTable.shippedDate,
        shipName: ordersTable.shipName,
        shipCity: ordersTable.shipCity,
        shipCountry: ordersTable.shipCountry,
      })
      .from(ordersTable)
      .leftJoin(
        orderDetailsTable,
        eq(ordersTable.orderID, orderDetailsTable.orderID),
      )
      .limit(limit)
      .offset(offset)
      .groupBy(ordersTable.orderID);

    if (!orders.length) return null;

    return {
      data: orders,
      info: new Info(
        db
          .select({
            orderID: ordersTable.orderID,
            totalProductPrice: sql<string>`sum(${orderDetailsTable.unitPrice} * ${orderDetailsTable.quantity})`,
            totalProductsItems: sql<string>`sum(${orderDetailsTable.quantity})`,
            totalProductsQuantity: sql<string>`count(${orderDetailsTable.orderID})`,
            shippedDate: ordersTable.shippedDate,
            shipName: ordersTable.shipName,
            shipCity: ordersTable.shipCity,
            shipCountry: ordersTable.shipCountry,
          })
          .from(ordersTable)
          .leftJoin(
            orderDetailsTable,
            eq(ordersTable.orderID, orderDetailsTable.orderID),
          )
          .limit(limit)
          .offset(offset)
          .groupBy(ordersTable.orderID)
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }

  static async getOrderByID(
    id: number,
  ): Promise<{ data: CustomOrderByID; info: Info } | null> {
    const ts = timestampFunc();
    const startExec = Date.now();

    const order = await db
      .select({
        orderID: ordersTable.orderID,
        totalProductDiscount: sql<string>`sum(${orderDetailsTable.unitPrice} * ${orderDetailsTable.discount} * ${orderDetailsTable.quantity})`,
        totalProductPrice: sql<string>`sum(${orderDetailsTable.unitPrice} * ${orderDetailsTable.quantity})`,
        totalProductsItems: sql<string>`sum(${orderDetailsTable.quantity})`,
        totalProductsQuantity: sql<string>`count(${orderDetailsTable.orderID})`,
        customerID: ordersTable.customerID,
        shippedDate: ordersTable.shippedDate,
        shipName: ordersTable.shipName,
        shipCity: ordersTable.shipCity,
        shipCountry: ordersTable.shipCountry,
        companyName: shippersTable.companyName,
        freight: ordersTable.freight,
        orderDate: ordersTable.orderDate,
        requiredDate: ordersTable.requiredDate,
        shipRegion: ordersTable.shipRegion,
        shipPostalCode: ordersTable.shipPostalCode,
      })
      .from(ordersTable)
      .leftJoin(
        orderDetailsTable,
        eq(ordersTable.orderID, orderDetailsTable.orderID),
      )
      .leftJoin(shippersTable, eq(shippersTable.shipperID, ordersTable.shipVia))
      .where(eq(orderDetailsTable.orderID, id))
      .groupBy(ordersTable.orderID, shippersTable.shipperID);

    if (!order.length) return null;

    return {
      data: order[0],
      info: new Info(
        db
          .select({
            orderID: ordersTable.orderID,
            totalProductDiscount: sql<string>`sum(${orderDetailsTable.unitPrice} * ${orderDetailsTable.discount} * ${orderDetailsTable.quantity})`,
            totalProductPrice: sql<string>`sum(${orderDetailsTable.unitPrice} * ${orderDetailsTable.quantity})`,
            totalProductsItems: sql<string>`sum(${orderDetailsTable.quantity})`,
            totalProductsQuantity: sql<string>`count(${orderDetailsTable.orderID})`,
            customerID: ordersTable.customerID,
            shippedDate: ordersTable.shippedDate,
            shipName: ordersTable.shipName,
            shipCity: ordersTable.shipCity,
            shipCountry: ordersTable.shipCountry,
            companyName: shippersTable.companyName,
            freight: ordersTable.freight,
            orderDate: ordersTable.orderDate,
            requiredDate: ordersTable.requiredDate,
            shipRegion: ordersTable.shipRegion,
            shipPostalCode: ordersTable.shipPostalCode,
          })
          .from(ordersTable)
          .leftJoin(
            orderDetailsTable,
            eq(ordersTable.orderID, orderDetailsTable.orderID),
          )
          .leftJoin(
            shippersTable,
            eq(shippersTable.shipperID, ordersTable.shipVia),
          )
          .where(eq(orderDetailsTable.orderID, id))
          .groupBy(ordersTable.orderID, shippersTable.shipperID)
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }
}
