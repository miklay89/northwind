import Router from "express";
import allProducts from "../controllers/allproducts";
import singleProduct from "../controllers/productbyid";

const router = Router();

router.get("/products", allProducts);
router.get("/products/:id", singleProduct);

export default router;
