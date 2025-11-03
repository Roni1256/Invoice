import express from "express";
import {
  addInventoryItem,
  addInventoryItems,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,

} from "../controllers/inventory.controller.js";

const router = express.Router();

router.post("/:companyId", addInventoryItem);
router.post("/bulk/:companyId", addInventoryItems);
router.get("/:companyId", getAllInventoryItems);
router.get("/:companyId/:id", getInventoryItemById);
router.put("/:companyId/:id", updateInventoryItem);
router.delete("/:companyId/:id", deleteInventoryItem);

export default router;
