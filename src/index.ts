import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import customersRoutes from "./routes/customers";
import employeesRoutes from "./routes/employees";
import ordersRoutes from "./routes/orders";
import productsRoutes from "./routes/products";
import searchRoutes from "./routes/search";
import suppliersRoutes from "./routes/suppliers";

dotenv.config();

const PORT = (process.env.PORT as string) || 5000;
// const databaseURI = process.env.MONGO_DB_URI as string;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// routes
app.use("/", customersRoutes);
app.use("/", employeesRoutes);
app.use("/", ordersRoutes);
app.use("/", productsRoutes);
app.use("/", searchRoutes);
app.use("/", suppliersRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server has been started on port ${PORT}...`);
});
