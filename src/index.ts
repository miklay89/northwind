import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import customersRoutes from "./routes/customers";
import employeesRoutes from "./routes/employees";
import ordersRoutes from "./routes/orders";
import productsRoutes from "./routes/products";
import searchRoutes from "./routes/search";
import suppliersRoutes from "./routes/suppliers";
import errorHandler from "./utils/error_handler";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/", customersRoutes);
app.use("/", employeesRoutes);
app.use("/", ordersRoutes);
app.use("/", productsRoutes);
app.use("/", searchRoutes);
app.use("/", suppliersRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server has been started on port ${process.env.PORT || 5000}...`);
});
