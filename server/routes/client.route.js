import express from "express";
import {
  createClient,
  getClientsByCompany,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/client.controller.js";

const router = express.Router();

// Create a client for a specific company
router.post("/:companyId", createClient);

// Get all clients for a company
router.get("/:companyId", getClientsByCompany);

// Get single client by ID
router.get("/details/:clientId", getClientById);

// Update a client
router.put("/:clientId", updateClient);

// Delete a client
router.delete("/:clientId", deleteClient);

export default router;
