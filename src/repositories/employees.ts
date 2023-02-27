import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm/expressions";
import dbObject from "../data/db";
import { Employee } from "../data/schema";
import Info from "../entities/info";
import { timestampFunc, calcExecutionTime } from "../libs/timer";
import workerId from "../libs/worker";
import { FullEmployeeData } from "../types/types";

dotenv.config();

const { db } = dbObject;
const { employeesTable } = dbObject.Tables;
const reportsToTable = alias(employeesTable, "reportsTo");
const limit = process.env.LIMIT;

export default class EmployeesRepositories {
  static async getCount(): Promise<{ data: number; info: Info } | null> {
    const ts = timestampFunc();
    const startExec = Date.now();

    const count = await db
      .select({
        count: sql<number>`count(${employeesTable.employeeID})`,
      })
      .from(employeesTable);

    if (!count.length) return null;

    return {
      data: +count[0].count,
      info: new Info(
        db
          .select({
            count: sql<number>`count(${employeesTable.employeeID})`,
          })
          .from(employeesTable)
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }

  static async getIndexedEmployees(
    page: number,
  ): Promise<{ data: Employee[]; info: Info } | null> {
    const offset = limit * (page - 1);
    const ts = timestampFunc();
    const startExec = Date.now();

    const employees = await db
      .select()
      .from(employeesTable)
      .limit(limit)
      .offset(offset);

    if (!employees.length) return null;

    return {
      data: employees,
      info: new Info(
        db
          .select()
          .from(employeesTable)
          .limit(limit)
          .offset(offset)
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }

  static async getEmployeeByID(
    id: number,
  ): Promise<{ data: FullEmployeeData; info: Info } | null> {
    const ts = timestampFunc();
    const startExec = Date.now();

    const employee = await db
      .select()
      .from(employeesTable)
      .leftJoin(
        reportsToTable,
        eq(employeesTable.reportsTo, reportsToTable.employeeID),
      )
      .where(eq(employeesTable.employeeID, id));

    if (!employee.length) return null;

    return {
      data: employee[0],
      info: new Info(
        db
          .select()
          .from(employeesTable)
          .leftJoin(
            reportsToTable,
            eq(employeesTable.reportsTo, reportsToTable.employeeID),
          )
          .where(eq(employeesTable.employeeID, id))
          .toSQL().sql,
        ts,
        calcExecutionTime(startExec, Date.now()),
        workerId,
      ),
    };
  }
}
