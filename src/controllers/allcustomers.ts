import { RequestHandler } from "express";
import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import orm from "../libs/db";
import workerId from "../libs/worker";

dotenv.config();

const db = orm.Connector;
const { customersTable } = orm.Tables;

// select all customers
const allCustomers: RequestHandler = async (req, res) => {
  const page = req.query.page as string;
  const limit = +(process.env.LIMIT as string);
  const offset = limit * (+page - 1);

  const stat: any[] = [];

  try {
    // timestamp for count query
    const countTS = new Date().toISOString().slice(0, 19).replace("T", " ");
    // count query
    const countStart = Date.now();
    const count = await db.execute(
      sql`select count(${customersTable.customerID}) from ${customersTable}`,
    );

    const countInfo = {
      queryString: `select count(1) from customers`,
      queryTS: countTS,
      queryExecutionTime: `${Date.now() - countStart}ms`,
    };

    stat.push(countInfo);

    // timestamp for query
    const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
    // query timer start
    const startQueryTime = Date.now();
    const query = await db.select(customersTable).limit(limit).offset(offset);

    const queryInfo = {
      queryString: db.select(customersTable).limit(limit).offset(offset).toSQL()
        .sql,
      queryTS,
      queryExecutionTime: `${Date.now() - startQueryTime}ms`,
    };
    stat.push(queryInfo);

    if (!query.length) {
      return res.status(404).json({ message: "Not found." });
    }
    // response object
    const response = {
      data: query,
      count: +count.rows[0].count,
      queryInfo: stat,
      workerId,
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

export default allCustomers;
