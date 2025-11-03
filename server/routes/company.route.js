import express from "express";
import { addCompanyDetails,getCompanyDetails,updateCompanyDetails } from "../controllers/company.controller.js";

const router = express.Router();

router.post("/add-details", addCompanyDetails);
router.put("/company/:companyId", updateCompanyDetails);
router.get("/:userId", getCompanyDetails);

export default router;
