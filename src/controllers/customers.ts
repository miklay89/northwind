import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import CustomersRepositories from "../repositories/customers";
import { TypedResponse } from "../types/types";
import { Customer } from "../data/schema";
import Info from "../entities/info";

export default class CustomersController {
  static getCustomers: RequestHandler = async (
    req,
    res: TypedResponse<{
      count: {
        data: number;
        info: Info;
      };
      customers: {
        data: Customer[];
        info: Info;
      };
    }>,
    next,
  ) => {
    const page = req.query.page as unknown as number;
    try {
      const count = await CustomersRepositories.getCount();
      if (!count) throw Boom.notFound();

      const customers = await CustomersRepositories.getIndexedCustomers(page);
      if (!customers) throw Boom.notFound();

      res.json({ count, customers });
    } catch (err) {
      next(err);
    }
  };

  static getCustomerByID: RequestHandler = async (
    req,
    res: TypedResponse<{
      customer: {
        data: Customer;
        info: Info;
      };
    }>,
    next,
  ) => {
    const { id } = req.params;
    try {
      const customer = await CustomersRepositories.getCustomerByID(id);
      if (!customer) throw Boom.notFound();

      res.json({ customer });
    } catch (err) {
      next(err);
    }
  };
}
