import Boom from "@hapi/boom";
import { RequestHandler } from "express";
import { Supplier } from "../data/schema";
import Info from "../entities/info";
import SuppliersRepositories from "../repositories/suppliers";
import { TypedResponse } from "../types/types";

export default class SuppliersController {
  static getSuppliers: RequestHandler = async (
    req,
    res: TypedResponse<{
      suppliers: { data: Supplier[]; info: Info };
      count: { data: number; info: Info };
    }>,
    next,
  ) => {
    const page = req.query.page as unknown as number;
    try {
      const count = await SuppliersRepositories.getCount();
      if (!count) throw Boom.notFound();

      const suppliers = await SuppliersRepositories.getIndexedSuppliers(page);
      if (!suppliers) throw Boom.notFound();

      res.json({ suppliers, count });
    } catch (err) {
      next(err);
    }
  };

  static getSupplierByID: RequestHandler = async (
    req,
    res: TypedResponse<{ supplier: { data: Supplier; info: Info } }>,
    next,
  ) => {
    const { id } = req.params;
    try {
      const supplier = await SuppliersRepositories.getSupplierByID(+id);
      if (!supplier) throw Boom.notFound();

      res.json({ supplier });
    } catch (err) {
      next(err);
    }
  };
}
