import Router from "express";
import allEmployees from "../controllers/allemployees";
import singleEmployee from "../controllers/employeebyid";

const router = Router();

router.get("/employees", allEmployees);
router.get("/employees/:id", singleEmployee);

export default router;
