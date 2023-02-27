import Router from "express";
import SearchController from "../controllers/search";

const router = Router();

router.post("/search", SearchController.search);

export default router;
