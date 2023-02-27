import Router from "express";
import OrdersController from "../controllers/orders";

const router = Router();

router.get("/orders", OrdersController.getOrders);
router.get("/orders/:id", OrdersController.getOrderByID);

export default router;
