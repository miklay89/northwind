import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm/expressions";
import dbObject from "../data/db";
import { Customer } from "../data/schema";
import Info from "../entities/info";
import { timestampFunc, calcExecutionTime } from "../libs/timer";
import workerId from "../libs/worker";

dotenv.config();

const { db } = dbObject;
const { customersTable } = dbObject.Tables;
const limit = process.env.LIMIT;

export default class CustomersRepositories {
  static async getCount(): Promise<{ data: number; info: Info } | null> {
    const ts = timestampFunc();
    const startExec = Date.now();

    const count = await db
      .select({
        count: sql<number>`count(${customersTable.customerID})`,
      })
      .from(customersTable);

    if (!count.length) return null;

    return {
      data: +count[0].count,
      info: new Info(
        db
          .select({
            count: sql<number>`count(${customersTable.customerID})`,
          })
          .from(customersTable)
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }

  static async getIndexedCustomers(
    page: number,
  ): Promise<{ data: Customer[]; info: Info } | null> {
    const offset = limit * (page - 1);
    const ts = timestampFunc();
    const startExec = Date.now();

    const customers = await db
      .select()
      .from(customersTable)
      .limit(limit)
      .offset(offset);

    if (!customers.length) return null;

    return {
      data: customers,
      info: new Info(
        db
          .select()
          .from(customersTable)
          .limit(limit)
          .offset(offset)
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }

  static async getCustomerByID(
    id: string,
  ): Promise<{ data: Customer; info: Info } | null> {
    const ts = timestampFunc();
    const startExec = Date.now();

    const customer = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.customerID, id));

    if (!customer.length) return null;

    return {
      data: customer[0],
      info: new Info(
        db
          .select()
          .from(customersTable)
          .where(eq(customersTable.customerID, id))
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }
}
