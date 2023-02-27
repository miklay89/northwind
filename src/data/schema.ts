import {
  pgTable,
  text,
  index,
  integer,
  boolean,
  decimal,
  smallint,
  InferModel,
} from "drizzle-orm/pg-core";

export const categoriesTable = pgTable("categories", {
  categoryID: integer("CategoryID").notNull().primaryKey(),
  categoryName: text("CategoryName").notNull(),
  description: text("Description"),
});

export const customersTable = pgTable("customers", {
  customerID: text("CustomerID").notNull().primaryKey(),
  companyName: text("CompanyName").notNull(),
  contactName: text("ContactName"),
  contactTitle: text("ContactTitle"),
  address: text("Address"),
  city: text("City"),
  region: text("Region"),
  postalCode: text("PostalCode"),
  country: text("Country"),
  phone: text("Phone"),
  fax: text("Fax"),
});

export const employeesTable = pgTable("employees", {
  employeeID: integer("EmployeeID").notNull().primaryKey(),
  lastName: text("LastName").notNull(),
  firstName: text("FirstName").notNull(),
  title: text("Title"),
  titleOfCourtesy: text("TitleOfCourtesy"),
  birthDate: text("BirthDate"),
  hireDate: text("HireDate"),
  address: text("Address"),
  city: text("City"),
  region: text("Region"),
  postalCode: text("PostalCode"),
  country: text("Country"),
  homePhone: text("HomePhone"),
  extension: text("Extension"),
  notes: text("Notes"),
  reportsTo: integer("ReportsTo"),
});

export const regionsTable = pgTable("regions", {
  regionID: integer("RegionID").notNull().primaryKey(),
  regionDescription: text("RegionDescription").notNull(),
});

export const territoriesTable = pgTable("territories", {
  territoryID: text("TerritoryID").notNull().primaryKey(),
  territoryDescription: text("TerritoryDescription").notNull(),
  regionID: integer("RegionID")
    .notNull()
    .references(() => regionsTable.regionID),
});

export const employeeTerritoriesTable = pgTable("employee_territories", {
  employeeID: integer("EmployeeID")
    .notNull()
    .references(() => employeesTable.employeeID),
  territoryID: text("TerritoryID")
    .notNull()
    .references(() => territoriesTable.territoryID),
});

export const suppliersTable = pgTable("suppliers", {
  supplierID: integer("SupplierID").notNull().primaryKey(),
  companyName: text("CompanyName").notNull(),
  contactName: text("ContactName"),
  contactTitle: text("ContactTitle"),
  address: text("Address"),
  city: text("City"),
  region: text("Region"),
  postalCode: text("PostalCode"),
  country: text("Country"),
  phone: text("Phone"),
  fax: text("Fax"),
  homePage: text("HomePage"),
});

export const productsTable = pgTable("products", {
  productID: integer("ProductID").notNull().primaryKey(),
  productName: text("ProductName").notNull(),
  supplierID: integer("SupplierID").references(() => suppliersTable.supplierID),
  categoryID: integer("CategoryID").references(
    () => categoriesTable.categoryID,
  ),
  quantityPerUnit: text("QuantityPerUnit"),
  unitPrice: decimal("UnitPrice"),
  unitsInStock: smallint("UnitsInStock"),
  unitsOnOrder: smallint("UnitsOnOrder"),
  reorderLevel: smallint("ReorderLevel"),
  discontinued: boolean("Discontinued").notNull(),
});

export const shippersTable = pgTable("shippers", {
  shipperID: integer("ShipperID").notNull().primaryKey(),
  companyName: text("CompanyName").notNull(),
  phone: text("Phone"),
});

export const ordersTable = pgTable("orders", {
  orderID: integer("OrderID").notNull().primaryKey(),
  customerID: text("CustomerID")
    .notNull()
    .references(() => customersTable.customerID),
  employeeID: integer("EmployeeID")
    .notNull()
    .references(() => employeesTable.employeeID),
  orderDate: text("OrderDate"),
  requiredDate: text("RequiredDate"),
  shippedDate: text("ShippedDate"),
  shipVia: integer("ShipVia")
    .notNull()
    .references(() => shippersTable.shipperID),
  freight: decimal("Freight"),
  shipName: text("ShipName"),
  shipAddress: text("ShipAddress"),
  shipCity: text("ShipCity"),
  shipRegion: text("ShipRegion"),
  shipPostalCode: text("ShipPostalCode"),
  shipCountry: text("ShipCountry"),
});

export const orderDetailsTable = pgTable(
  "order_details",
  {
    orderID: integer("OrderID")
      .notNull()
      .references(() => ordersTable.orderID),
    productID: integer("ProductID")
      .notNull()
      .references(() => productsTable.productID),
    unitPrice: decimal("UnitPrice").notNull(),
    quantity: integer("Quantity").notNull(),
    discount: decimal("Discount").notNull(),
  },
  (table) => ({
    uniqIdx: index("orderID_and_productID_index").on(
      table.orderID,
      table.productID,
    ),
  }),
);

export type Supplier = InferModel<typeof suppliersTable>;
export type Product = InferModel<typeof productsTable>;
export type Order = InferModel<typeof ordersTable>;
export type Employee = InferModel<typeof employeesTable>;
export type Customer = InferModel<typeof customersTable>;
