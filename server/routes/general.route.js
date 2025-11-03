import { Router } from "express";
import Invoice from "../models/invoice.model.js";
import Client from "../models/client.model.js";

const router = Router();

router.get("/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const now = new Date();

    // Define date ranges
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get invoices and clients for last & current month
    const [lastMonthInvoices, currentMonthInvoices, lastMonthClients, currentMonthClients] =
      await Promise.all([
        Invoice.find({ companyId, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
        Invoice.find({ companyId, createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth } }),
        Client.find({ companyId, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
        Client.find({ companyId, createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth } }),
      ]);

    // Fetch all invoices & clients for total stats
    const [invoices, clients] = await Promise.all([
      Invoice.find({ companyId }),
      Client.find({ companyId }),
    ]);

    let totalRevenue = 0,
      totalPending = 0,
      totalDue = 0,
      totalDraft = 0,
      oldMonthRevenue = 0,
      newMonthRevenue = 0;

    // Revenue calculation
    for (const invoice of invoices) {
      const amount = invoice.amount || 0;

      if (invoice.status === "paid") totalRevenue += amount;
      else if (invoice.status === "pending") totalPending += amount;
      else if (invoice.status === "overdue") totalDue += amount;
      else if (invoice.status === "draft") totalDraft += amount;

      // Revenue by month
      if (invoice.createdAt >= startOfLastMonth && invoice.createdAt <= endOfLastMonth)
        oldMonthRevenue += amount;
      if (invoice.createdAt >= startOfCurrentMonth && invoice.createdAt <= endOfCurrentMonth)
        newMonthRevenue += amount;
    }

    // Safe revenue change calculation
    const revenueChange =
      oldMonthRevenue > 0
        ? ((newMonthRevenue - oldMonthRevenue) / oldMonthRevenue) * 100
        : 100;

    const invoiceChange =
      lastMonthInvoices.length > 0
        ? ((currentMonthInvoices.length - lastMonthInvoices.length) / lastMonthInvoices.length) * 100
        : 100;

    const clientsChange =
      lastMonthClients.length > 0
        ? ((currentMonthClients.length - lastMonthClients.length) / lastMonthClients.length) * 100
        : 100;

    const generalStatus = {
      totalInvoices: invoices.length,
      totalClients: clients.length,
      revenueChange: revenueChange.toFixed(2),
      totalRevenue,
      totalPending,
      totalDue,
      totalDraft,
      newMonthRevenue,
      oldMonthRevenue,
      lastMonthInvoices: lastMonthInvoices.length,
      currentMonthInvoices: currentMonthInvoices.length,
      invoiceChange: invoiceChange.toFixed(2),
      lastMonthClients: lastMonthClients.length,
      currentMonthClients: currentMonthClients.length,
      clientsChange: clientsChange.toFixed(2),
    };

    res.status(200).json({ success: true, generalStatus });
  } catch (error) {
    console.error("Error fetching general status:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});



router.get("/upcoming-payments/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    // Get current date (set time to 00:00 for accurate day calculation)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Fetch all invoices for the company
    const invoices = await Invoice.find({ companyId });

    // Filter and transform invoices into desired format
    const upcomingPayments = invoices
      .filter((inv) => inv.dueDate && new Date(inv.dueDate) > currentDate)
      .map((inv) => {
        const dueDate = new Date(inv.dueDate);
        const timeDiff = dueDate - currentDate;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // convert ms → days

        return {
          dueDate: dueDate.toISOString().split("T")[0], // YYYY-MM-DD format
          daysLeft,
          invoiceDetails: inv,
        };
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // soonest due first

    return res.status(200).json({
      success: true,
      message: "Upcoming payments fetched successfully",
      count: upcomingPayments.length,
      upcomingPayments,
    });
  } catch (error) {
    console.error("Error fetching upcoming payments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});



export default router;
