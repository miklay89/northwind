import Router from "express";
import EmployeesController from "../controllers/employees";

const router = Router();

router.get("/employees", EmployeesController.getEmployees);
router.get("/employees/:id", EmployeesController.getEmployeeByID);

export default router;
