import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import ProductsRepositories from "../repositories/products";
import { ProductWithSupplier, TypedResponse } from "../types/types";
import { Product } from "../data/schema";
import Info from "../entities/info";

export default class ProductsController {
  static getProducts: RequestHandler = async (
    req,
    res: TypedResponse<{
      products: {
        data: Product[];
        info: Info;
      };
      count: {
        data: number;
        info: Info;
      };
    }>,
    next,
  ) => {
    const page = req.query.page as unknown as number;
    try {
      const count = await ProductsRepositories.getCount();
      if (!count) throw Boom.notFound();

      const products = await ProductsRepositories.getIndexedProducts(page);
      if (!products) throw Boom.notFound();

      res.json({ products, count });
    } catch (err) {
      next(err);
    }
  };

  static getProductByID: RequestHandler = async (
    req,
    res: TypedResponse<{ product: { data: ProductWithSupplier; info: Info } }>,
    next,
  ) => {
    const { id } = req.params;
    try {
      const product = await ProductsRepositories.getProductByID(+id);
      if (!product) throw Boom.notFound();

      res.json({ product });
    } catch (err) {
      next(err);
    }
  };
}
