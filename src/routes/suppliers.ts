import Router from "express";
import SuppliersController from "../controllers/suppliers";

const router = Router();

router.get("/suppliers", SuppliersController.getSuppliers);
router.get("/suppliers/:id", SuppliersController.getSupplierByID);

export default router;
