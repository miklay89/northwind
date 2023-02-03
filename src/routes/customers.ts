import Router from "express";
import allCustomers from "../controllers/allcustomers";
import singleCustomer from "../controllers/customerbyid";

const router = Router();

router.get("/customers", allCustomers);
router.get("/customers/:id", singleCustomer);

export default router;
