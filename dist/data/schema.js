"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDetailsTable = exports.ordersTable = exports.shippersTable = exports.productsTable = exports.suppliersTable = exports.employeeTerritoriesTable = exports.territoriesTable = exports.regionsTable = exports.employeesTable = exports.customersTable = exports.categoriesTable = void 0;
const drizzle_orm_pg_1 = require("drizzle-orm-pg");
exports.categoriesTable = (0, drizzle_orm_pg_1.pgTable)("categories", {
    categoryID: (0, drizzle_orm_pg_1.integer)("CategoryID").notNull().primaryKey(),
    categoryName: (0, drizzle_orm_pg_1.text)("CategoryName").notNull(),
    description: (0, drizzle_orm_pg_1.text)("Description"),
});
exports.customersTable = (0, drizzle_orm_pg_1.pgTable)("customers", {
    customerID: (0, drizzle_orm_pg_1.text)("CustomerID").notNull().primaryKey(),
    companyName: (0, drizzle_orm_pg_1.text)("CompanyName").notNull(),
    contactName: (0, drizzle_orm_pg_1.text)("ContactName"),
    contactTitle: (0, drizzle_orm_pg_1.text)("ContactTitle"),
    address: (0, drizzle_orm_pg_1.text)("Address"),
    city: (0, drizzle_orm_pg_1.text)("City"),
    region: (0, drizzle_orm_pg_1.text)("Region"),
    postalCode: (0, drizzle_orm_pg_1.text)("PostalCode"),
    country: (0, drizzle_orm_pg_1.text)("Country"),
    phone: (0, drizzle_orm_pg_1.text)("Phone"),
    fax: (0, drizzle_orm_pg_1.text)("Fax"),
});
exports.employeesTable = (0, drizzle_orm_pg_1.pgTable)("employees", {
    employeeID: (0, drizzle_orm_pg_1.integer)("EmployeeID").notNull().primaryKey(),
    lastName: (0, drizzle_orm_pg_1.text)("LastName").notNull(),
    firstName: (0, drizzle_orm_pg_1.text)("FirstName").notNull(),
    title: (0, drizzle_orm_pg_1.text)("Title"),
    titleOfCourtesy: (0, drizzle_orm_pg_1.text)("TitleOfCourtesy"),
    birthDate: (0, drizzle_orm_pg_1.text)("BirthDate"),
    hireDate: (0, drizzle_orm_pg_1.text)("HireDate"),
    address: (0, drizzle_orm_pg_1.text)("Address"),
    city: (0, drizzle_orm_pg_1.text)("City"),
    region: (0, drizzle_orm_pg_1.text)("Region"),
    postalCode: (0, drizzle_orm_pg_1.text)("PostalCode"),
    country: (0, drizzle_orm_pg_1.text)("Country"),
    homePhone: (0, drizzle_orm_pg_1.text)("HomePhone"),
    extension: (0, drizzle_orm_pg_1.text)("Extension"),
    notes: (0, drizzle_orm_pg_1.text)("Notes"),
    reportsTo: (0, drizzle_orm_pg_1.integer)("ReportsTo"),
});
exports.regionsTable = (0, drizzle_orm_pg_1.pgTable)("regions", {
    regionID: (0, drizzle_orm_pg_1.integer)("RegionID").notNull().primaryKey(),
    regionDescription: (0, drizzle_orm_pg_1.text)("RegionDescription").notNull(),
});
exports.territoriesTable = (0, drizzle_orm_pg_1.pgTable)("territories", {
    territoryID: (0, drizzle_orm_pg_1.text)("TerritoryID").notNull().primaryKey(),
    territoryDescription: (0, drizzle_orm_pg_1.text)("TerritoryDescription").notNull(),
    regionID: (0, drizzle_orm_pg_1.integer)("RegionID")
        .notNull()
        .references(() => exports.regionsTable.regionID),
});
exports.employeeTerritoriesTable = (0, drizzle_orm_pg_1.pgTable)("employee_territories", {
    employeeID: (0, drizzle_orm_pg_1.integer)("EmployeeID")
        .notNull()
        .references(() => exports.employeesTable.employeeID),
    territoryID: (0, drizzle_orm_pg_1.text)("TerritoryID")
        .notNull()
        .references(() => exports.territoriesTable.territoryID),
});
exports.suppliersTable = (0, drizzle_orm_pg_1.pgTable)("suppliers", {
    supplierID: (0, drizzle_orm_pg_1.integer)("SupplierID").notNull().primaryKey(),
    companyName: (0, drizzle_orm_pg_1.text)("CompanyName").notNull(),
    contactName: (0, drizzle_orm_pg_1.text)("ContactName"),
    contactTitle: (0, drizzle_orm_pg_1.text)("ContactTitle"),
    address: (0, drizzle_orm_pg_1.text)("Address"),
    city: (0, drizzle_orm_pg_1.text)("City"),
    region: (0, drizzle_orm_pg_1.text)("Region"),
    postalCode: (0, drizzle_orm_pg_1.text)("PostalCode"),
    country: (0, drizzle_orm_pg_1.text)("Country"),
    phone: (0, drizzle_orm_pg_1.text)("Phone"),
    fax: (0, drizzle_orm_pg_1.text)("Fax"),
    HomePage: (0, drizzle_orm_pg_1.text)("HomePage"),
});
exports.productsTable = (0, drizzle_orm_pg_1.pgTable)("products", {
    productID: (0, drizzle_orm_pg_1.integer)("ProductID").notNull().primaryKey(),
    productName: (0, drizzle_orm_pg_1.text)("ProductName").notNull(),
    supplierID: (0, drizzle_orm_pg_1.integer)("SupplierID").references(() => exports.suppliersTable.supplierID),
    categoryID: (0, drizzle_orm_pg_1.integer)("CategoryID").references(() => exports.categoriesTable.categoryID),
    quantityPerUnit: (0, drizzle_orm_pg_1.text)("QuantityPerUnit"),
    unitPrice: (0, drizzle_orm_pg_1.text)("UnitPrice"),
    unitsInStock: (0, drizzle_orm_pg_1.text)("UnitsInStock"),
    unitsOnOrder: (0, drizzle_orm_pg_1.text)("UnitsOnOrder"),
    reorderLevel: (0, drizzle_orm_pg_1.text)("ReorderLevel"),
    discontinued: (0, drizzle_orm_pg_1.boolean)("Discontinued").notNull(),
});
exports.shippersTable = (0, drizzle_orm_pg_1.pgTable)("shippers", {
    shipperID: (0, drizzle_orm_pg_1.integer)("ShipperID").notNull().primaryKey(),
    companyName: (0, drizzle_orm_pg_1.text)("CompanyName").notNull(),
    phone: (0, drizzle_orm_pg_1.text)("Phone"),
});
exports.ordersTable = (0, drizzle_orm_pg_1.pgTable)("orders", {
    orderID: (0, drizzle_orm_pg_1.integer)("OrderID").notNull().primaryKey(),
    customerID: (0, drizzle_orm_pg_1.text)("CustomerID")
        .notNull()
        .references(() => exports.customersTable.customerID),
    employeeID: (0, drizzle_orm_pg_1.integer)("EmployeeID")
        .notNull()
        .references(() => exports.employeesTable.employeeID),
    orderDate: (0, drizzle_orm_pg_1.text)("OrderDate"),
    requiredDate: (0, drizzle_orm_pg_1.text)("RequiredDate"),
    shippedDate: (0, drizzle_orm_pg_1.text)("ShippedDate"),
    shipVia: (0, drizzle_orm_pg_1.integer)("ShipVia")
        .notNull()
        .references(() => exports.shippersTable.shipperID),
    freight: (0, drizzle_orm_pg_1.text)("Freight"),
    shipName: (0, drizzle_orm_pg_1.text)("ShipName"),
    shipAddress: (0, drizzle_orm_pg_1.text)("ShipAddress"),
    shipCity: (0, drizzle_orm_pg_1.text)("ShipCity"),
    shipRegion: (0, drizzle_orm_pg_1.text)("ShipRegion"),
    shipPostalCode: (0, drizzle_orm_pg_1.text)("ShipPostalCode"),
    shipCountry: (0, drizzle_orm_pg_1.text)("ShipCountry"),
});
exports.orderDetailsTable = (0, drizzle_orm_pg_1.pgTable)("order_details", {
    orderID: (0, drizzle_orm_pg_1.integer)("OrderID")
        .notNull()
        .references(() => exports.ordersTable.orderID),
    productID: (0, drizzle_orm_pg_1.integer)("ProductID")
        .notNull()
        .references(() => exports.productsTable.productID),
    unitPrice: (0, drizzle_orm_pg_1.numeric)("UnitPrice").notNull(),
    quantity: (0, drizzle_orm_pg_1.numeric)("Quantity").notNull(),
    discount: (0, drizzle_orm_pg_1.numeric)("Discount").notNull(),
}, (table) => ({
    uniqIdx: (0, drizzle_orm_pg_1.index)("orderID_and_productID_index").on(table.orderID, table.productID),
}));
