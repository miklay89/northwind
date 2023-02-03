export interface OrderInfo {
  total_products_discount: string;
  total_products_price: string;
  total_products_items: string;
  total_products: string;
  CustomerID: string;
  OrderID: number;
  ShippedDate: string;
  ShipName: string;
  ShipCity: string;
  CompanyName: string;
  ShipCountry: string;
  Freight: string;
  OrderDate: string;
  RequiredDate: string;
  ShipRegion: string;
  ShipPostalCode: string;
}

export interface ProductsInOrder {
  ProductID: number;
  ProductName: string;
  Quantity: string;
  UnitPrice: string;
  total_products_price: string;
  Discount: string;
}

export interface AllOrders {
  OrderID: number;
  total_products_price: string;
  total_products_items: string;
  total_products_quantity: string;
  ShippedDate: string;
  ShipName: string;
  ShipCity: string;
  ShipCountry: string;
}
