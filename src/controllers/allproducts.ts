import { RequestHandler } from "express";
import dotenv from "dotenv";
import orm from "../libs/db";
import workerId from "../libs/worker";

dotenv.config();

const db = orm.Connector;
const { productsTable } = orm.Tables;
// select all products
const allProducts: RequestHandler = async (req, res) => {
  const { page } = req.body;
  const limit = +(process.env.LIMIT as string);
  const offset = limit * (+page - 1);
  try {
    // timestamp for query
    const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
    // timer start
    const startQueryTime = Date.now();
    const query = await db.select(productsTable).limit(limit).offset(offset);
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
          .select(productsTable)
          .limit(limit)
          .offset(offset)
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

export default allProducts;
