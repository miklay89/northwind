import dotenv from "dotenv";
import { ilike, or } from "drizzle-orm/expressions";
import dbObject from "../data/db";
import { Customer, Product } from "../data/schema";
import Info from "../entities/info";
import { timestampFunc, calcExecutionTime } from "../libs/timer";
import workerId from "../libs/worker";

dotenv.config();

const { db } = dbObject;
const { customersTable, productsTable } = dbObject.Tables;

export default class SearchRepositories {
  static async searchCustomers(query: string): Promise<{
    data: Customer[];
    info: Info;
  } | null> {
    const ts = timestampFunc();
    const startExec = Date.now();

    const customers = await db
      .select()
      .from(customersTable)
      .where(
        or(
          ilike(customersTable.companyName, `%${query}%`),
          ilike(customersTable.contactName, `%${query}%`),
          ilike(customersTable.contactTitle, `%${query}%`),
          ilike(customersTable.address, `%${query}%`),
        ),
      );

    if (!customers.length) return null;

    return {
      data: customers,
      info: new Info(
        db
          .select()
          .from(customersTable)
          .where(
            or(
              ilike(customersTable.companyName, `%${query}%`),
              ilike(customersTable.contactName, `%${query}%`),
              ilike(customersTable.contactTitle, `%${query}%`),
              ilike(customersTable.address, `%${query}%`),
            ),
          )
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }

  static async searchProducts(query: string): Promise<{
    data: Product[];
    info: Info;
  } | null> {
    const ts = timestampFunc();
    const startExec = Date.now();

    const products = await db
      .select()
      .from(productsTable)
      .where(ilike(productsTable.productName, `%${query}%`));

    if (!products.length) return null;

    return {
      data: products,
      info: new Info(
        db
          .select()
          .from(productsTable)
          .where(ilike(productsTable.productName, `%${query}%`))
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }
}
