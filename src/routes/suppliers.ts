import Router from "express";
import allSuppliers from "../controllers/allsuppliers";
import singleSupplier from "../controllers/supplierbyid";

const router = Router();

router.get("/suppliers", allSuppliers);
router.get("/suppliers/:id", singleSupplier);

export default router;
