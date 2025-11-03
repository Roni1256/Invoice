import Invoice from "../models/invoice.model.js";
import InventoryItem from "../models/inventory.model.js";
import Client from "../models/client.model.js";
import Activity from "../models/activities.model.js";

export const createInvoice = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is missing",
      });
    }

    const {
      clientId,
      items,
      clientName,
      clientEmail,
      clientPhone,
      clientCompany,
      clientAddress,
      clientCity,
      clientState,
      clientZip,
      clientCountry,
      invoiceNumber,
      issueDate,
      dueDate,
      amount,
      status,
      discount,
      discountType,
      notes,
      paymentTerms,
      shipping,
      taxRate,
      terms,
    } = req.body;

    // Validate required fields
    if (
      !invoiceNumber ||
      !issueDate ||
      !amount ||
      !status ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for invoice creation",
      });
    }

    let clientRef;

    // Handle existing or new client
    if (clientId) {
      const existingClient = await Client.findById(clientId);
      if (existingClient) {
        existingClient.totalAmount = (existingClient.totalAmount || 0) + amount;
        await existingClient.save();
        clientRef = existingClient._id;
      } else {
        // Create new client if not found
        const newClient = await Client.create({
          companyId,
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          company: clientCompany,
          address: clientAddress,
          city: clientCity,
          state: clientState,
          zipCode: clientZip,
          country: clientCountry,
          totalAmount: amount,
        });
        clientRef = newClient._id;
      }
    } else {
      // Create client if clientId not provided
      const newClient = await Client.create({
        companyId,
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        company: clientCompany,
        address: clientAddress,
        city: clientCity,
        state: clientState,
        zipCode: clientZip,
        country: clientCountry,
        totalAmount: amount,
      });
      clientRef = newClient._id;
    }

    // Prepare items and update inventory
    const itemsSchemaArray = [];
    for (const element of items) {
      const inventoryItem = await InventoryItem.findById(element.inventoryId);
      if (inventoryItem) {
        if (inventoryItem.quantity < element.quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for item ${inventoryItem.name}`,
          });
        }

        inventoryItem.quantity -= element.quantity;
        await inventoryItem.save();

        itemsSchemaArray.push({
          item: inventoryItem._id,
          quantity: element.quantity,
          amount: element.quantity * inventoryItem.price,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: `Inventory item not found for ID ${element.inventoryId}`,
        });
      }
    }

    // Create the invoice
    const newInvoice = await Invoice.create({
      companyId,
      clientId: clientRef,
      
      invoiceNumber,
      issueDate,
      dueDate,
      amount,
      status,
      items: itemsSchemaArray,
      notes,
      taxRate,
      paymentTerms,
      shipping,
      discount,
      discountType,
      terms,
    });

    const activity = await Activity.create({
      companyId,
      action: `Created Invoice `,
      description: `Invoice Number: ${invoiceNumber}`,
    });
    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      invoice: newInvoice,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating invoice",
      error: error.message,
    });
  }
};

export const getInvoiceByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;
    if (!companyId)
      res.status(400).json({ success: false, message: "CompanyId required" });

    const invoices = await Invoice.find({ companyId }).sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, message: "Retrieved Successfully", invoices });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const getLastInvoiceNumber = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    // Find the last created invoice for the company (sorted by creation date)
    const lastInvoice = await Invoice.findOne({ companyId })
      .sort({ createdAt: -1 })
      .select("invoiceNumber");

    let nextInvoiceNumber;

    if (lastInvoice && lastInvoice.invoiceNumber) {
      // Try to extract number if invoiceNumber is like "INV-0010"
      const match = lastInvoice.invoiceNumber.match(/\d+$/);
      if (match) {
        const lastNum = parseInt(match[0], 10);
        const nextNum = lastNum + 1;
        nextInvoiceNumber = lastInvoice.invoiceNumber.replace(
          /\d+$/,
          nextNum.toString().padStart(match[0].length, "0")
        );
      } else {
        // If invoiceNumber has no numeric part
        nextInvoiceNumber = `${lastInvoice.invoiceNumber}-1`;
      }
    } else {
      // If no invoices exist yet
      nextInvoiceNumber = "INV-0001";
    }

    return res.status(200).json({
      success: true,
      message: "Next invoice number generated successfully",
      nextInvoiceNumber,
    });
  } catch (error) {
    console.error("Error retrieving last invoice number:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching last invoice number",
      error: error.message,
    });
  }
};

export const deleteInvoiceById = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const deletedInvoice = await Invoice.findByIdAndDelete(invoiceId);

    const activity = await Activity.create({
      companyId,
      action: `Deleted Invoice `,
      description: `Invoice Number: ${deletedInvoice.invoiceNumber}`,
    });
    res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server error", error });
  }
};
