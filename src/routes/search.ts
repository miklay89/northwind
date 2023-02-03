import Router from "express";
import searchController from "../controllers/searchProductsOrCustomers";

const router = Router();

router.post("/search", searchController);

export default router;
