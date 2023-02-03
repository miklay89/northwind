import { RequestHandler } from "express";
import dotenv from "dotenv";
import { eq } from "drizzle-orm/expressions";
import orm from "../libs/db";
import workerId from "../libs/worker";

dotenv.config();

const db = orm.Connector;
const { customersTable } = orm.Tables;

// select single customer by id
const singleCustomer: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    // timestamp for query
    const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
    // timer start
    const startQueryTime = Date.now();
    const query = await db
      .select(customersTable)
      .where(eq(customersTable.customerID, id));
    // timer end
    const endQueryTime = Date.now();
    // execution time
    const queryExecutionTime = `${endQueryTime - startQueryTime}ms`;
    if (!query.length) {
      return res.status(404).json({ message: "Not found." });
    }
    // response object
    const response = {
      data: query,
      queryInfo: {
        queryString: db
          .select(customersTable)
          .where(eq(customersTable.customerID, id))
          .toSQL().sql,
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

export default singleCustomer;
