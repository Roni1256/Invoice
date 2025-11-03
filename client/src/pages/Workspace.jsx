import React, { useContext, useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Send,
  MoreVertical,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { CompanyContext } from "../App";
import { axiosInstance } from "../utils/axiosInstance";
import Preview from "./Preview";

const Workspace = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [company, setCompany] = useContext(CompanyContext);
  const [currentInvoice,setCurrentInvoice]=useState()

  // Sample invoice data - Replace with API data
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: "INV-1001",
      clientName: "Acme Corporation",
      clientEmail: "contact@acme.com",
      issueDate: "2024-01-15",
      dueDate: "2024-02-14",
      amount: 2500.0,
      status: "paid",
      items: [
        { description: "Web Development", quantity: 1, rate: 2000 },
        { description: "Hosting Service", quantity: 1, rate: 500 },
      ],
    },
    {
      id: 2,
      invoiceNumber: "INV-1002",
      clientName: "TechStart Inc",
      clientEmail: "billing@techstart.com",
      issueDate: "2024-01-20",
      dueDate: "2024-02-19",
      amount: 1800.0,
      status: "pending",
      items: [
        { description: "Consulting Services", quantity: 10, rate: 150 },
        { description: "Documentation", quantity: 1, rate: 300 },
      ],
    },
    {
      id: 3,
      invoiceNumber: "INV-1003",
      clientName: "Design Studio Pro",
      clientEmail: "hello@designstudio.com",
      issueDate: "2024-01-18",
      dueDate: "2024-01-25",
      amount: 950.0,
      status: "overdue",
      items: [{ description: "Logo Design", quantity: 1, rate: 950 }],
    },
    {
      id: 4,
      invoiceNumber: "INV-1004",
      clientName: "Marketing Solutions",
      clientEmail: "info@marketing.com",
      issueDate: "2024-01-22",
      dueDate: "2024-02-21",
      amount: 3200.0,
      status: "draft",
      items: [
        { description: "SEO Optimization", quantity: 1, rate: 2000 },
        { description: "Content Creation", quantity: 1, rate: 1200 },
      ],
    },
    {
      id: 5,
      invoiceNumber: "INV-1005",
      clientName: "Global Enterprises",
      clientEmail: "accounts@global.com",
      issueDate: "2024-01-25",
      dueDate: "2024-02-24",
      amount: 5500.0,
      status: "pending",
      items: [
        { description: "Enterprise Software License", quantity: 5, rate: 1000 },
        { description: "Support Package", quantity: 1, rate: 500 },
      ],
    },
  ]);

  const statusConfig = {
    paid: {
      label: "Paid",
      color: "text-success bg-success/10",
      icon: CheckCircle,
    },
    pending: {
      label: "Pending",
      color: "text-warning bg-warning/10",
      icon: Clock,
    },
    overdue: {
      label: "Overdue",
      color: "text-error bg-error/10",
      icon: XCircle,
    },
    draft: {
      label: "Draft",
      color: "text-text-secondary bg-gray-100",
      icon: FileText,
    },
  };

  const getStats = () => {
    const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    console.log(total);

    const paid =
      invoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + inv.amount, 0) || 0;
    const pending =
      invoices
        .filter((inv) => inv.status === "pending")
        .reduce((sum, inv) => sum + inv.amount, 0) || 0;
    const overdue =
      invoices
        .filter((inv) => inv.status === "overdue")
        .reduce((sum, inv) => sum + inv.amount, 0) || 0;

    return { total, paid, pending, overdue };
  };

  const stats = getStats();

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || invoice.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleCreateInvoice = () => {
    console.log("Navigate to create invoice page");
    navigate("/dashboard/new-invoice");
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleDownloadInvoice = (invoice) => {
    console.log("Download invoice:", invoice.invoiceNumber);
    // Add download logic here
  };

  const handleSendInvoice = (formData) => {
    console.log(formData);

    const sendingObj = {
      clientId: formData.clientId,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      clientCompany: formData.clientCompany || "",
      clientAddress: formData.clientAddress,
      clientCity: formData.clientCity,
      clientState: formData.clientState,
      clientZip: formData.clientZip,
      clientCountry: formData.clientCountry || "",
      invoiceNumber: formData.invoiceNumber,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      amount: formData.amount,
      status: formData.status,
      discount: formData.discount,
      discountType: formData.discountType,
      notes: formData.notes,
      paymentTerms: formData.paymentTerms,
      shipping: formData.shipping,
      taxRate: formData.taxRate,
      terms: formData.terms,
      items: formData.items,
    };

    if (formData.clientId && formData.items) {
      navigate("/dashboard/send-invoice", {
        state: { data: sendingObj },
      });
    } else {
      alert("Need to fill the client information and select item");
    }
  };

  async function getInvoices() {
    try {
      const { data } = await axiosInstance.get(`/invoice/${company._id}`);
      console.log(data);
      setInvoices(data.invoices);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getInvoices();
  }, []);
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Billing Center
        </h1>
        <p className="text-text-secondary">
          Create, manage, and track your invoices
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface p-5 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-text-secondary text-sm font-medium">
              Total Revenue
            </p>
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
          <p className="text-2xl font-bold text-text-primary">${stats.total}</p>
        </div>

        <div className="bg-surface p-5 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-text-secondary text-sm font-medium">Paid</p>
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <p className="text-2xl font-bold text-success">${stats.paid}</p>
        </div>

        <div className="bg-surface p-5 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-text-secondary text-sm font-medium">Pending</p>
            <Clock className="w-8 h-8 text-warning" />
          </div>
          <p className="text-2xl font-bold text-warning">${stats.pending}</p>
        </div>

        <div className="bg-surface p-5 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-text-secondary text-sm font-medium">Overdue</p>
            <XCircle className="w-8 h-8 text-error" />
          </div>
          <p className="text-2xl font-bold text-error">${stats.overdue}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="text"
            placeholder="Search invoices by number, client name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="px-4 py-3 border border-border rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium"
            >
              <Filter className="w-5 h-5" />
              Filter
              {filterStatus !== "all" && (
                <span className="ml-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                  1
                </span>
              )}
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setFilterStatus("all");
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition ${
                    filterStatus === "all" ? "bg-primary/5 text-primary" : ""
                  }`}
                >
                  All Invoices
                </button>
                <button
                  onClick={() => {
                    setFilterStatus("paid");
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition ${
                    filterStatus === "paid" ? "bg-primary/5 text-primary" : ""
                  }`}
                >
                  Paid
                </button>
                <button
                  onClick={() => {
                    setFilterStatus("pending");
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition ${
                    filterStatus === "pending"
                      ? "bg-primary/5 text-primary"
                      : ""
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => {
                    setFilterStatus("overdue");
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition ${
                    filterStatus === "overdue"
                      ? "bg-primary/5 text-primary"
                      : ""
                  }`}
                >
                  Overdue
                </button>
                <button
                  onClick={() => {
                    setFilterStatus("draft");
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition rounded-b-lg ${
                    filterStatus === "draft" ? "bg-primary/5 text-primary" : ""
                  }`}
                >
                  Draft
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleCreateInvoice}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <main className="rounded-xl shadow-md bg-surface border border-primary-light/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary/5 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Invoice
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Issue Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Due Date
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-text-primary">
                  Amount
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-text-secondary">No invoices found</p>
                    {filterStatus !== "all" && (
                      <button
                        onClick={() => setFilterStatus("all")}
                        className="mt-2 text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => {
                  const StatusIcon = statusConfig[invoice.status].icon;
                  return (
                    <tr
                      key={invoice.id}
                      className="hover:bg-primary/5 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-text-primary">
                            {invoice.invoiceNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-text-primary">
                            {invoice.clientName}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {invoice.clientEmail}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-secondary text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(invoice.issueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-secondary text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-text-primary text-lg">
                          ${invoice.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                              statusConfig[invoice.status].color
                            }`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig[invoice.status].label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSendInvoice(invoice)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                            title="Send"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Quick Stats Summary */}
      <div className="mt-6 flex justify-between items-center text-sm text-text-secondary">
        <p>
          Showing {filteredInvoices.length} of {invoices.length} invoices
        </p>
        <p>
          Total: <span className="font-semibold">${stats.total}</span>
        </p>
      </div>
      {selectedInvoice && (<Preview formData={selectedInvoice} setShowPreview={setSelectedInvoice}/>)}
    </div>
  );
};

export default Workspace;
