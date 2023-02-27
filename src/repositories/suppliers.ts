import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm/expressions";
import dbObject from "../data/db";
import { Supplier } from "../data/schema";
import Info from "../entities/info";
import { timestampFunc, calcExecutionTime } from "../libs/timer";
import workerId from "../libs/worker";

dotenv.config();

const { db } = dbObject;
const { suppliersTable } = dbObject.Tables;
const limit = process.env.LIMIT;

export default class SuppliersRepositories {
  static async getCount(): Promise<{ data: number; info: Info } | null> {
    const ts = timestampFunc();
    const startExec = Date.now();

    const count = await db
      .select({
        count: sql<number>`count(${suppliersTable.supplierID})`,
      })
      .from(suppliersTable);

    if (!count.length) return null;

    return {
      data: +count[0].count,
      info: new Info(
        db
          .select({
            count: sql<number>`count(${suppliersTable.supplierID})`,
          })
          .from(suppliersTable)
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }

  static async getIndexedSuppliers(
    page: number,
  ): Promise<{ data: Supplier[]; info: Info } | null> {
    const offset = limit * (page - 1);
    const ts = timestampFunc();
    const startExec = Date.now();

    const suppliers = await db
      .select()
      .from(suppliersTable)
      .limit(limit)
      .offset(offset);

    if (!suppliers.length) return null;

    return {
      data: suppliers,
      info: new Info(
        db
          .select()
          .from(suppliersTable)
          .limit(limit)
          .offset(offset)
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }

  static async getSupplierByID(
    id: number,
  ): Promise<{ data: Supplier; info: Info } | null> {
    const ts = timestampFunc();
    const startExec = Date.now();

    const supplier = await db
      .select()
      .from(suppliersTable)
      .where(eq(suppliersTable.supplierID, id));

    if (!supplier.length) return null;

    return {
      data: supplier[0],
      info: new Info(
        db
          .select()
          .from(suppliersTable)
          .where(eq(suppliersTable.supplierID, id))
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }
}
