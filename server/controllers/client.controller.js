import Activity from "../models/activities.model.js";
import Client from "../models/client.model.js";

export const createClient = async (req, res) => {
  try {
    const { companyId } = req.params;
    const clientData = req.body;

    if (!companyId) {
      return res
        .status(400)
        .json({ success: false, message: "Company ID missing" });
    }

    const client = await Client.create({ ...clientData, companyId });
    const activity=await Activity.create({
      companyId,
      action:"New client added",
      description:`${client.company}`
    })

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ✅ Get all clients for a company
export const getClientsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    if (!companyId)
      res.status(400).json({
        success: false,
        message: "Company ID Missing",
      });

    const clients = await Client.find({ companyId });
    console.log(clients);
    
    res.status(200).json({ success: true, clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ✅ Get a single client by ID
export const getClientById = async (req, res) => {
  try {
    const { clientId } = req.params;
    console.log(clientId);
    
    const client = await Client.findById(clientId)
    console.log(client);
    
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    res.status(200).json({ success: true, client });
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ✅ Update a client
export const updateClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const updates = req.body;

    const client = await Client.findByIdAndUpdate(clientId, updates, {
      new: true,
    });

    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
     const activity=await Activity.create({
      companyId,
      action:`Updated Client`,
      description:`${client.company}`
    })

    res
      .status(200)
      .json({ success: true, message: "Client updated successfully", client });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ✅ Delete a client
export const deleteClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    const client = await Client.findByIdAndDelete(clientId);

    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
     const activity=await Activity.create({
      companyId,
      action:`Deleted client`,
      description:`${client.company}`

    })

    res
      .status(200)
      .json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
