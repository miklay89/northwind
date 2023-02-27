import Router from "express";
import ProductsController from "../controllers/products";

const router = Router();

router.get("/products", ProductsController.getProducts);
router.get("/products/:id", ProductsController.getProductByID);

export default router;
