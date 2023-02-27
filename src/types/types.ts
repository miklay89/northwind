import { Response, Request } from "express";
// eslint-disable-next-line import/no-unresolved
import { Send } from "express-serve-static-core";
import { Employee, Product, Supplier } from "../data/schema";

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}

export interface SearchRequest extends Request {
  body: {
    table: string;
    search: string;
  };
}

export interface FullEmployeeData {
  employees: Employee;
  reportsTo: Employee | null;
}

export interface CustomOrder {
  orderID: number;
  totalProductPrice: string;
  totalProductsItems: string;
  totalProductsQuantity: string;
  shippedDate: string | null;
  shipName: string | null;
  shipCity: string | null;
  shipCountry: string | null;
}

export interface CustomOrderByID {
  orderID: number;
  totalProductDiscount: string;
  totalProductPrice: string;
  totalProductsItems: string;
  totalProductsQuantity: string;
  customerID: string;
  shippedDate: string | null;
  shipName: string | null;
  shipCity: string | null;
  shipCountry: string | null;
  companyName: string | null;
  freight: string | null;
  orderDate: string | null;
  requiredDate: string | null;
  shipRegion: string | null;
  shipPostalCode: string | null;
}

export interface ProductInOrder {
  productID: number;
  productName: string | null;
  quantity: number;
  unitPrice: string;
  totalProductPrice: string;
  discount: string;
}

export interface ProductWithSupplier {
  products: Product;
  suppliers: Supplier | null;
}
