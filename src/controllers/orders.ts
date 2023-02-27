import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import OrdersRepositories from "../repositories/orders";
import {
  CustomOrder,
  CustomOrderByID,
  ProductInOrder,
  TypedResponse,
} from "../types/types";
import Info from "../entities/info";
import ProductsRepositories from "../repositories/products";

export default class OrdersController {
  static getOrders: RequestHandler = async (
    req,
    res: TypedResponse<{
      count: {
        data: number;
        info: Info;
      };
      orders: {
        data: CustomOrder[];
        info: Info;
      };
    }>,
    next,
  ) => {
    const page = req.query.page as unknown as number;
    try {
      const count = await OrdersRepositories.getCount();
      if (!count) throw Boom.notFound();

      const orders = await OrdersRepositories.getIndexedOrders(page);
      if (!orders) throw Boom.notFound();

      res.json({ count, orders });
    } catch (err) {
      next(err);
    }
  };

  static getOrderByID: RequestHandler = async (
    req,
    res: TypedResponse<{
      order: {
        data: CustomOrderByID;
        info: Info;
      };
      productsInOrder: {
        data: ProductInOrder[];
        info: Info;
      };
    }>,
    next,
  ) => {
    const { id } = req.params;
    try {
      const order = await OrdersRepositories.getOrderByID(+id);
      if (!order) throw Boom.notFound();

      const productsInOrder =
        await ProductsRepositories.getProductsInOrderByOrderID(+id);

      res.json({ order, productsInOrder });
    } catch (err) {
      next(err);
    }
  };
}
