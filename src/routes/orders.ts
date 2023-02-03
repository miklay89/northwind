import Router from "express";
import allOrders from "../controllers/allorders";
import singleOrder from "../controllers/orderbyid";

const router = Router();

router.get("/orders", allOrders);
router.get("/orders/:id", singleOrder);

export default router;
