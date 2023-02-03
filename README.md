Endpoints

GET - /customers - will show a list of customers

GET - /employees - will show a list of employees

GET - /orders - will show a list of orders

GET - /products - will show a list of products

GET - /suppliers - will show a list of suppliers

POST - /search
body: 
{"table": "products","search": "search_string"} - for search in products table by product name 
{"table": "customers","search": "search_string"} - for search in customers table by (company name or contact name or contact title or company address)

GET - /customers/${customer_id} - will show information about customer by customer_id 

GET - /employees/${employee_id} - will show information about employee by employee_id 

GET - /suppliers/${supplier_id} - will show information about supplier by supplier_id

GET - /products/${product_id} - will show information about product by product_id

GET - /orders/${order_id} - will show information about order by order_id