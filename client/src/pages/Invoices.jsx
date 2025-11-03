import React, { useContext, useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Send,
  Edit2,
  Trash2,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  Printer,
  Copy,
  X,
  MoreVertical,
} from 'lucide-react';
import { axiosInstance } from '../utils/axiosInstance';
import { CompanyContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Invoices = () => {
  const navigate=useNavigate()
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [company,setCompany]=useContext(CompanyContext)
  const [dateFilter, setDateFilter] = useState('all');
  const [invoiceNumber,setInvoiceNumber]=useState()

  // Sample invoice data - Replace with API data
  const [invoices, setInvoices] = useState([]);

  const statusConfig = {
    paid: {
      label: 'Paid',
      color: 'text-success bg-success/10 border-success/20',
      icon: CheckCircle,
    },
    pending: {
      label: 'Pending',
      color: 'text-warning bg-warning/10 border-warning/20',
      icon: Clock,
    },
    overdue: {
      label: 'Overdue',
      color: 'text-error bg-error/10 border-error/20',
      icon: XCircle,
    },
    draft: {
      label: 'Draft',
      color: 'text-text-secondary bg-gray-100 border-gray-200',
      icon: FileText,
    },
  };

  const getStats = () => {
    const total = invoices.length;
    const paid = invoices.filter((inv) => inv.status === 'paid').length;
    const pending = invoices.filter((inv) => inv.status === 'pending').length;
    const overdue = invoices.filter((inv) => inv.status === 'overdue').length;
    const draft = invoices.filter((inv) => inv.status === 'draft').length;

    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidAmount = invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const pendingAmount = invoices
      .filter((inv) => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const overdueAmount = invoices
      .filter((inv) => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);

    return {
      total,
      paid,
      pending,
      overdue,
      draft,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
    };
  };

  const stats = getStats();

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || invoice.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleSelectInvoice = (id) => {
    setSelectedInvoices((prev) =>
      prev.includes(id) ? prev.filter((invId) => invId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map((inv) => inv.id));
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handleDownloadInvoice = (invoice) => {
    console.log('Download invoice:', invoice.invoiceNumber);
    // Add download logic here
  };
  const getAllInvoice=async()=>{
    try {
      const invoices=await axiosInstance.get(`invoice/${company._id}`)
      console.log(invoices.data.invoices);
      setInvoices(invoices.data.invoices)
      
    } catch (error) {
      console.log(error);
      
    }
  }
  const handleSendInvoice = (invoice) => {
    console.log('Send invoice:', invoice.invoiceNumber, 'to', invoice.clientEmail);
  
    navigate('/dashboard/send-invoice',{state:{data:invoice}})
  };

  const handleDeleteInvoice = async(id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
     const resp=await axiosInstance.delete(`/invoice/${id}`) 
     getAllInvoice()
    }
  };

  const handleDuplicateInvoice = async(invoice) => {
    console.log(invoice);
    
    
    const sendingObj = {
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      clientPhone: invoice.clientPhone,
      clientCompany: invoice.clientCompany || "",
      clientAddress: invoice.clientAddress,
      clientCity: invoice.clientCity,
      clientState: invoice.clientState,
      clientZip: invoice.clientZip,
      clientCountry: invoice.clientCountry || "",
      invoiceNumber: (await axiosInstance.get(`/invoice/last-inv/${company._id}`)).data.nextInvoiceNumber,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      amount: invoice.amount,
      status: invoice.status,
      discount: invoice.discount,
      discountType: invoice.discountType,
      notes: invoice.notes,
      paymentTerms: invoice.paymentTerms,
      shipping: invoice.shipping,
      taxRate: invoice.taxRate,
      terms: invoice.terms,
      items: invoice.items,
    };
    console.log(sendingObj);
    
    try {
      const resp=await axiosInstance.post(`/invoice/${company._id}`,sendingObj)
      getAllInvoice()
    } catch (error) {
      console.log(error);
      
    }
  };

  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotal = (invoice) => {
    const subtotal = calculateSubtotal(invoice.items);
    const tax = (subtotal * invoice.taxRate) / 100;
    return subtotal + tax - invoice.discount;
  };
  
  useEffect(()=>{
    getAllInvoice()
  },[])
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Invoices</h1>
        <p className="text-text-secondary">
          Manage and track all your invoices in one place
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-surface p-4 rounded-lg border border-border shadow-sm">
          <p className="text-text-secondary text-xs font-medium mb-1">
            Total Invoices
          </p>
          <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
          <p className="text-xs text-text-secondary mt-1">
            ${stats.totalAmount.toLocaleString()}
          </p>
        </div>

        <div className="bg-surface p-4 rounded-lg border border-success/20 shadow-sm">
          <div className="flex items-center gap-1 mb-1">
            <CheckCircle className="w-3 h-3 text-success" />
            <p className="text-success text-xs font-medium">Paid</p>
          </div>
          <p className="text-2xl font-bold text-success">{stats.paid}</p>
          <p className="text-xs text-text-secondary mt-1">
            ${stats.paidAmount.toLocaleString()}
          </p>
        </div>

        <div className="bg-surface p-4 rounded-lg border border-warning/20 shadow-sm">
          <div className="flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-warning" />
            <p className="text-warning text-xs font-medium">Pending</p>
          </div>
          <p className="text-2xl font-bold text-warning">{stats.pending}</p>
          <p className="text-xs text-text-secondary mt-1">
            ${stats.pendingAmount.toLocaleString()}
          </p>
        </div>

        <div className="bg-surface p-4 rounded-lg border border-error/20 shadow-sm">
          <div className="flex items-center gap-1 mb-1">
            <XCircle className="w-3 h-3 text-error" />
            <p className="text-error text-xs font-medium">Overdue</p>
          </div>
          <p className="text-2xl font-bold text-error">{stats.overdue}</p>
          <p className="text-xs text-text-secondary mt-1">
            ${stats.overdueAmount.toLocaleString()}
          </p>
        </div>

        <div className="bg-surface p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center gap-1 mb-1">
            <FileText className="w-3 h-3 text-text-secondary" />
            <p className="text-text-secondary text-xs font-medium">Draft</p>
          </div>
          <p className="text-2xl font-bold text-text-primary">{stats.draft}</p>
          <p className="text-xs text-text-secondary mt-1">Not sent</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="text"
            placeholder="Search invoices by number, client, or email..."
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
              {filterStatus !== 'all' && (
                <span className="ml-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                  1
                </span>
              )}
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-10">
                {['all', 'paid', 'pending', 'overdue', 'draft'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition first:rounded-t-lg last:rounded-b-lg ${
                      filterStatus === status ? 'bg-primary/5 text-primary' : ''
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}{' '}
                    {status === 'all' ? 'Invoices' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedInvoices.length > 0 && (
            <button className="px-4 py-3 border border-border rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium">
              <Download className="w-5 h-5" />
              Export ({selectedInvoices.length})
            </button>
          )}

          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition flex items-center gap-2 font-medium">
            <Plus className="w-5 h-5" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <main className="rounded-xl shadow-md bg-surface border border-primary-light/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary/5 border-b border-border">
              <tr>
                <th className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedInvoices.length === filteredInvoices.length &&
                      filteredInvoices.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                  />
                </th>
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
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-text-secondary">No invoices found</p>
                    {filterStatus !== 'all' && (
                      <button
                        onClick={() => setFilterStatus('all')}
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
                      key={invoice._id}
                      className="hover:bg-primary/5 transition"
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={() => handleSelectInvoice(invoice.id)}
                          className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                        />
                      </td>
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
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border ${
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
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSendInvoice(invoice)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                            title="Send Email"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateInvoice(invoice)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(invoice._id)}
                            className="p-2 text-error hover:bg-error/10 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Invoice Details Modal */}
      {showDetailsModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-3xl w-full my-8">
            <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-text-primary">
                Invoice Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Invoice Header */}
              <div className="flex justify-between items-start pb-6 border-b border-border">
                <div>
                  <h3 className="text-3xl font-bold text-text-primary mb-2">
                    {selectedInvoice.invoiceNumber}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full border ${
                      statusConfig[selectedInvoice.status].color
                    }`}
                  >
                    {statusConfig[selectedInvoice.status].label}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-text-secondary text-sm mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-primary">
                    ${selectedInvoice.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Client & Date Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-text-primary mb-3">
                    Bill To
                  </h4>
                  <p className="font-medium text-text-primary">
                    {selectedInvoice.clientName}
                  </p>
                  <p className="text-sm text-text-secondary flex items-center gap-1 mt-1">
                    <Mail className="w-4 h-4" />
                    {selectedInvoice.clientEmail}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-3">
                    Invoice Dates
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-text-secondary">Issue Date:</span>{' '}
                      <span className="font-medium">
                        {new Date(selectedInvoice.issueDate).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-text-secondary">Due Date:</span>{' '}
                      <span className="font-medium">
                        {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-semibold text-text-primary mb-3">Items</h4>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-primary/5">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                          Description
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-text-primary">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">
                          Rate
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-text-primary">
                            {item.description}
                          </td>
                          <td className="px-4 py-3 text-center text-text-secondary">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right text-text-secondary">
                            ${item.rate.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-text-primary">
                            ${item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal:</span>
                    <span className="font-medium">
                      ${calculateSubtotal(selectedInvoice.items).toFixed(2)}
                    </span>
                  </div>
                  {selectedInvoice.taxRate > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        Tax ({selectedInvoice.taxRate}%):
                      </span>
                      <span className="font-medium">
                        $
                        {(
                          (calculateSubtotal(selectedInvoice.items) *
                            selectedInvoice.taxRate) /
                          100
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Discount:</span>
                      <span className="font-medium text-success">
                        -${selectedInvoice.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-semibold text-text-primary">Total:</span>
                    <span className="text-xl font-bold text-primary">
                      ${calculateTotal(selectedInvoice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">Notes</h4>
                  <p className="text-sm text-text-secondary bg-gray-50 p-3 rounded-lg">
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button
                  onClick={() => handleSendInvoice(selectedInvoice)}
                  className="flex-1 px-4 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Email
                </button>
                <button
                  className="px-4 py-3 border border-border rounded-lg hover:bg-gray-50 transition"
                  title="Print"
                >
                  <Printer className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Summary */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
        <p>
          Showing {filteredInvoices.length} of {invoices.length} invoices
          {selectedInvoices.length > 0 &&
            ` (${selectedInvoices.length} selected)`}
        </p>
        <p>
          Total Value:{' '}
          <span className="font-semibold text-text-primary">
            ${stats.totalAmount.toLocaleString()}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Invoices;