import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import EmployeesRepositories from "../repositories/employees";
import { FullEmployeeData, TypedResponse } from "../types/types";
import Info from "../entities/info";
import { Employee } from "../data/schema";

export default class EmployeesController {
  static getEmployees: RequestHandler = async (
    req,
    res: TypedResponse<{
      count: {
        data: number;
        info: Info;
      };
      employees: {
        data: Employee[];
        info: Info;
      };
    }>,
    next,
  ) => {
    const page = req.query.page as unknown as number;
    try {
      const count = await EmployeesRepositories.getCount();
      if (!count) throw Boom.notFound();

      const employees = await EmployeesRepositories.getIndexedEmployees(page);
      if (!employees) throw Boom.notFound();

      res.json({ count, employees });
    } catch (err) {
      next(err);
    }
  };

  static getEmployeeByID: RequestHandler = async (
    req,
    res: TypedResponse<{
      employee: {
        data: FullEmployeeData;
        info: Info;
      };
    }>,
    next,
  ) => {
    const { id } = req.params;
    try {
      const employee = await EmployeesRepositories.getEmployeeByID(+id);
      if (!employee) throw Boom.notFound();

      res.json({ employee });
    } catch (err) {
      next(err);
    }
  };
}
