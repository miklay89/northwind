CREATE TABLE IF NOT EXISTS categories (
	"CategoryID" integer PRIMARY KEY NOT NULL,
	"CategoryName" text NOT NULL,
	"Description" text
);

CREATE TABLE IF NOT EXISTS customers (
	"CustomerID" text PRIMARY KEY NOT NULL,
	"CompanyName" text NOT NULL,
	"ContactName" text,
	"ContactTitle" text,
	"Address" text,
	"City" text,
	"Region" text,
	"PostalCode" text,
	"Country" text,
	"Phone" text,
	"Fax" text
);

CREATE TABLE IF NOT EXISTS employee_territories (
	"EmployeeID" integer NOT NULL,
	"TerritoryID" text NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
	"EmployeeID" integer PRIMARY KEY NOT NULL,
	"LastName" text NOT NULL,
	"FirstName" text NOT NULL,
	"Title" text,
	"TitleOfCourtesy" text,
	"BirthDate" text,
	"HireDate" text,
	"Address" text,
	"City" text,
	"Region" text,
	"PostalCode" text,
	"Country" text,
	"HomePhone" text,
	"Extension" text,
	"Notes" text,
	"ReportsTo" integer
);

CREATE TABLE IF NOT EXISTS order_details (
	"OrderID" integer NOT NULL,
	"ProductID" integer NOT NULL,
	"UnitPrice" numeric NOT NULL,
	"Quantity" numeric NOT NULL,
	"Discount" numeric NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
	"OrderID" integer PRIMARY KEY NOT NULL,
	"CustomerID" text NOT NULL,
	"EmployeeID" integer NOT NULL,
	"OrderDate" text,
	"RequiredDate" text,
	"ShippedDate" text,
	"ShipVia" integer NOT NULL,
	"Freight" text,
	"ShipName" text,
	"ShipAddress" text,
	"ShipCity" text,
	"ShipRegion" text,
	"ShipPostalCode" text,
	"ShipCountry" text
);

CREATE TABLE IF NOT EXISTS products (
	"ProductID" integer PRIMARY KEY NOT NULL,
	"ProductName" text NOT NULL,
	"SupplierID" integer,
	"CategoryID" integer,
	"QuantityPerUnit" text,
	"UnitPrice" text,
	"UnitsInStock" text,
	"UnitsOnOrder" text,
	"ReorderLevel" text,
	"Discontinued" boolean NOT NULL
);

CREATE TABLE IF NOT EXISTS regions (
	"RegionID" integer PRIMARY KEY NOT NULL,
	"RegionDescription" text NOT NULL
);

CREATE TABLE IF NOT EXISTS shippers (
	"ShipperID" integer PRIMARY KEY NOT NULL,
	"CompanyName" text NOT NULL,
	"Phone" text
);

CREATE TABLE IF NOT EXISTS suppliers (
	"SupplierID" integer PRIMARY KEY NOT NULL,
	"CompanyName" text NOT NULL,
	"ContactName" text,
	"ContactTitle" text,
	"Address" text,
	"City" text,
	"Region" text,
	"PostalCode" text,
	"Country" text,
	"Phone" text,
	"Fax" text,
	"HomePage" text
);

CREATE TABLE IF NOT EXISTS territories (
	"TerritoryID" text PRIMARY KEY NOT NULL,
	"TerritoryDescription" text NOT NULL,
	"RegionID" integer NOT NULL
);

DO $$ BEGIN
 ALTER TABLE employee_territories ADD CONSTRAINT employee_territories_EmployeeID_employees_EmployeeID_fk FOREIGN KEY ("EmployeeID") REFERENCES employees("EmployeeID");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE employee_territories ADD CONSTRAINT employee_territories_TerritoryID_territories_TerritoryID_fk FOREIGN KEY ("TerritoryID") REFERENCES territories("TerritoryID");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE order_details ADD CONSTRAINT order_details_OrderID_orders_OrderID_fk FOREIGN KEY ("OrderID") REFERENCES orders("OrderID");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE order_details ADD CONSTRAINT order_details_ProductID_products_ProductID_fk FOREIGN KEY ("ProductID") REFERENCES products("ProductID");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE orders ADD CONSTRAINT orders_CustomerID_customers_CustomerID_fk FOREIGN KEY ("CustomerID") REFERENCES customers("CustomerID");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE orders ADD CONSTRAINT orders_EmployeeID_employees_EmployeeID_fk FOREIGN KEY ("EmployeeID") REFERENCES employees("EmployeeID");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE orders ADD CONSTRAINT orders_ShipVia_shippers_ShipperID_fk FOREIGN KEY ("ShipVia") REFERENCES shippers("ShipperID");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE products ADD CONSTRAINT products_SupplierID_suppliers_SupplierID_fk FOREIGN KEY ("SupplierID") REFERENCES suppliers("SupplierID");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE products ADD CONSTRAINT products_CategoryID_categories_CategoryID_fk FOREIGN KEY ("CategoryID") REFERENCES categories("CategoryID");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE territories ADD CONSTRAINT territories_RegionID_regions_RegionID_fk FOREIGN KEY ("RegionID") REFERENCES regions("RegionID");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS orderID_and_productID_index ON order_details ("OrderID","ProductID");