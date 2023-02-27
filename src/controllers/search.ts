/* eslint-disable consistent-return */
import Boom from "@hapi/boom";
import { RequestHandler } from "express";
import { Customer, Product } from "../data/schema";
import Info from "../entities/info";
import SearchRepositories from "../repositories/search";
import { SearchRequest, TypedResponse } from "../types/types";

export default class SearchController {
  static search: RequestHandler = async (
    req: SearchRequest,
    res: TypedResponse<{ data: Customer[] | Product[]; info: Info }>,
    next,
  ) => {
    const { table, search } = req.body;
    try {
      if (table === "customers") {
        const customers = await SearchRepositories.searchCustomers(search);
        if (!customers) throw Boom.notFound();

        return res.json(customers);
      }
      if (table === "products") {
        const products = await SearchRepositories.searchProducts(search);
        if (!products) throw Boom.notFound();

        return res.json(products);
      }
      throw Boom.badRequest();
    } catch (err) {
      next(err);
    }
  };
}
