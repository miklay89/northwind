import { RequestHandler } from "express";
import dotenv from "dotenv";
import { ilike, or } from "drizzle-orm/expressions";
import orm from "../libs/db";
import workerId from "../libs/worker";

dotenv.config();

const db = orm.Connector;
const { productsTable, customersTable } = orm.Tables;

// search logic
const searchController: RequestHandler = async (req, res) => {
  const tableName = req.body.table as string;
  const searchString = req.body.search as string;

  if (!tableName.length || !searchString.length)
    return res.status(404).json({ message: "Search body required." });

  try {
    // search in customer table
    if (tableName === "customers") {
      // timestamp for query
      const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
      // timer start
      const startQueryTime = Date.now();
      const query = await db
        .select(customersTable)
        .where(
          or(
            ilike(customersTable.companyName, `%${searchString}%`),
            ilike(customersTable.contactName, `%${searchString}%`),
            ilike(customersTable.contactTitle, `%${searchString}%`),
            ilike(customersTable.address, `%${searchString}%`),
          ),
        );
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
            .where(
              or(
                ilike(customersTable.companyName, `%${searchString}%`),
                ilike(customersTable.contactName, `%${searchString}%`),
                ilike(customersTable.contactTitle, `%${searchString}%`),
                ilike(customersTable.address, `%${searchString}%`),
              ),
            )
            .toSQL().sql,
          queryTS,
          queryExecutionTime,
          workerId,
        },
      };
      return res.json(response);
    }

    // search in products table
    if (tableName === "products") {
      // timestamp for query
      const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
      // timer start
      const startQueryTime = Date.now();
      const query = await db
        .select(productsTable)
        .where(ilike(productsTable.productName, `%${searchString}%`));
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
            .where(ilike(productsTable.productName, `%${searchString}%`))
            .toSQL().sql,
          queryTS,
          queryExecutionTime,
          workerId,
        },
      };
      return res.json(response);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(400).json({
        error_msg: error.message,
      });
    }
  }

  return null;

  // try {
  //   let queryString;
  //   if (tableName === "products") {
  //     queryString = `SELECT * FROM Products WHERE ProductName LIKE '%${searchString}%'`;
  //   } else {
  //     queryString = `SELECT * FROM Customers WHERE CompanyName LIKE '%${searchString}%' OR ContactName LIKE '%${searchString}%' OR ContactTitle LIKE '%${searchString}%' OR Address LIKE '%${searchString}%'`;
  //   }
  //   const connection = await mysql.createConnection(dataBaseUrl);
  //   const queryTS = new Date().toISOString().slice(0, 19).replace("T", " ");
  //   const startQueryTime = Date.now();
  //   const searchResult = await connection.query(queryString);
  //   const endQueryTime = Date.now();
  //   connection.end();
  //   if (Array.isArray(searchResult[0]) && searchResult[0].length > 0) {
  //     return res.json({
  //       queryInfo: {
  //         queryString,
  //         queryTS,
  //         queryExecutionTime: `${endQueryTime - startQueryTime}ms`,
  //       },
  //       data: searchResult[0],
  //     });
  //   }
  //   return res.json({
  //     queryInfo: {
  //       queryString,
  //       queryTS,
  //       queryExecutionTime: `${endQueryTime - startQueryTime}ms`,
  //     },
  //     data: "No such in search results.",
  //   });
  // } catch (error) {
  //   console.log(error);
  //   return res.json({
  //     error,
  //   });
  // }
};

export default searchController;
