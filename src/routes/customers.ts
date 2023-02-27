import Router from "express";
import CustomersController from "../controllers/customers";

const router = Router();

router.get("/customers", CustomersController.getCustomers);
router.get("/customers/:id", CustomersController.getCustomerByID);

export default router;
