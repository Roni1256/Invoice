import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Send,
  Eye,
  X,
  Calendar,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  Building,
} from "lucide-react";
import { useContext } from "react";
import { CompanyContext } from "../App";
import { axiosInstance } from "../utils/axiosInstance";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    invoiceNumber: "INV-1006",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "-",
    clientId: "",
    clientName: "",
    clientEmail: "",
    clientCompany: "",
    clientPhone: "",
    clientAddress: "",
    clientCity: "",
    clientState: "",
    clientZip: "",
    clientCountry: "",
    paymentTerms: "30",
    status: "paid",
    notes: "",
    terms: "",
    discount: 0,
    discountType: "fixed", // 'fixed' or 'percentage'
    taxRate: 0,
    shipping: 0,
  });
  const [items, setItems] = useState([
    {
      id: 1,
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      inventoryId: null,
    },
  ]);
  const [company, setCompany] = useContext(CompanyContext);
  const [showPreview, setShowPreview] = useState(false);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [showInventorySearch, setShowInventorySearch] = useState({});
  const [inventorySearchTerm, setInventorySearchTerm] = useState({});
  const [inventoryItems, setInventoryItems] = useState([]);
  const [existingClients, setExistingClients] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const lastInvoice = async () => {
    try {
      const { data } = await axiosInstance.get(
        `invoice/last-inv/${company._id}`
      );
      setInvoiceNumber(data.nextInvoiceNumber);
    } catch (error) {
      console.log(error);
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id || inventoryId===id) {
          const updatedItem = {
            ...item,
            inventoryId: item._id,
            [field]: value,
          };
          if (field === "quantity" || field === "rate") {
            updatedItem.amount =
              parseFloat(updatedItem.quantity || 0) *
              parseFloat(updatedItem.rate || 0);
          }
          return updatedItem;
        }
        return item;
      })
    );
    console.log(items);
  };

  const selectInventoryItem = (itemId, inventoryItem) => {
    setItems(
      items.map((item) => {
        if (item._id === itemId) {
          return {
            ...item,
            inventoryId: inventoryItem._id,
            description: `${inventoryItem.name} (${inventoryItem.sku})`,
            rate: inventoryItem.price,
            amount: item.quantity * inventoryItem.price,
          };
        }
        return item;
      })
    );
    setShowInventorySearch({ ...showInventorySearch, [itemId]: false });
    setInventorySearchTerm({ ...inventorySearchTerm, [itemId]: "" });
  };

  const toggleInventorySearch = (itemId) => {
    setShowInventorySearch({
      ...showInventorySearch,
      [itemId]: !showInventorySearch[itemId],
    });
  };

  const getFilteredInventory = (itemId) => {
    const searchTerm = inventorySearchTerm[itemId] || "";
    if (!searchTerm) return inventoryItems;

    return inventoryItems.filter(
      (inv) =>
        inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const addItem = () => {
    const newId =
      items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([
      ...items,
      {
        id: newId,
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
        inventoryId: null,
      },
    ]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const selectClient = (client) => {
    setFormData({
      ...formData,
      clientId: client._id,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      clientAddress: client.address,
      clientCity: client.city,
      clientState: client.state,
      clientZip: client.zipCode,
      clientCountry: client.country,
      clientCompany: client.company,
    });
    setShowClientSearch(false);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (formData.discountType === "percentage") {
      return (subtotal * parseFloat(formData.discount || 0)) / 100;
    }
    return parseFloat(formData.discount || 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return ((subtotal - discount) * parseFloat(formData.taxRate || 0)) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    const shipping = parseFloat(formData.shipping || 0);
    return subtotal - discount + tax + shipping;
  };

  const getInventoryItems = async () => {
    try {
      const resp = await axiosInstance.get(`/inventory/${company._id}`);
      console.log(resp.data);
      const filteredItem = resp.data.data.filter(
        (item) => item.minStock < item.quantity
      );
      setInventoryItems(filteredItem);
    } catch (error) {}
  };
  const getClients = async () => {
    try {
      const resp = await axiosInstance.get(`client/${company._id}`);
      setExistingClients(resp.data.clients);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSaveAsDraft = async () => {
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
      invoiceNumber: invoiceNumber,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      amount: calculateTotal(),
      status: formData.status,
      discount: formData.discount,
      discountType: formData.discountType,
      notes: formData.notes,
      paymentTerms: formData.paymentTerms,
      shipping: formData.shipping,
      taxRate: formData.taxRate,
      terms: formData.terms,
      items: items,
    };
    try {
      console.log(sendingObj);

      const resp = await axiosInstance.post(
        `invoice/${company._id}`,
        sendingObj
      );
      console.log(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendInvoice = () => {
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
      invoiceNumber: invoiceNumber,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      amount: calculateTotal(),
      status: formData.status,
      discount: formData.discount,
      discountType: formData.discountType,
      notes: formData.notes,
      paymentTerms: formData.paymentTerms,
      shipping: formData.shipping,
      taxRate: formData.taxRate,
      terms: formData.terms,
      items: items,
    };
    console.log("Sending invoice:", { formData, items });
    if (
      formData.clientEmail &&
      formData.clientCompany &&
      formData.clientName &&
      items
    ) {
      navigate("send-invoice", {
        state: { data: sendingObj },
      });
    } else {
      alert("Need to fill the client information and select item");
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  useEffect(() => {
    getInventoryItems();
    getClients();
    lastInvoice();
  }, []);
  return (
    <div className="p-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Create New Invoice
            </h1>
            <p className="text-text-secondary">
              Fill in the details to generate an invoice
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSaveAsDraft}
              className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium"
            >
              <Save className="w-4 h-4" />
              Save 
            </button>
            <button
              onClick={handlePreview}
              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition flex items-center gap-2 font-medium"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={handleSendInvoice}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2 font-medium"
            >
              <Send className="w-4 h-4" />
              Send Invoice
            </button>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Invoice Details
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Invoice Number *
                </label>
                <input
                  type="text"
                  name="invoiceNumber"
                  required
                  defaultValue={invoiceNumber}
                  className="w-full px-4 py-3 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-4 focus:ring-primary"
                  contentEditable={"false"}

                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Issue Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                  <input
                    type="date"
                    name="issueDate"
                    required
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Due Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                  <input
                    type="date"
                    name="dueDate"
                    
                    required
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Payment Terms
              </label>
              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="0">Due on Receipt</option>
                <option value="7">Net 7</option>
                <option value="15">Net 15</option>
                <option value="30">Net 30</option>
                <option value="45">Net 45</option>
                <option value="60">Net 60</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary "
              >
                <option value="paid">Paid</option>
                <option value="overdue">Due</option>
                <option value="pending">Pending</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Client Details */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <User className="w-5 h-5" />
                Bill To
              </h2>
              <button
                onClick={() => setShowClientSearch(!showClientSearch)}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                {showClientSearch ? "New Client" : "Select Existing"}
              </button>
            </div>

            {/* Client Search Dropdown */}
            {showClientSearch && (
              <div className="mb-4 border border-primary/20 rounded-lg p-4 bg-primary/5">
                <p className="text-sm text-text-secondary mb-2">
                  Select from existing clients:
                </p>
                <div className="space-y-2">
                  {existingClients.map((client, i) => (
                    <button
                      key={i}
                      onClick={() => selectClient(client)}
                      className="w-full text-left p-3 bg-surface border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition"
                    >
                      <p className="font-medium text-text-primary">
                        {client.name}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {client.email}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  required
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Client Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                  <input
                    type="email"
                    name="clientEmail"
                    required
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="client@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                  <input
                    type="text"
                    name="clientCompany"
                    required
                    value={formData.clientCompany}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Example Tech"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                  <input
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Street Address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="clientCity"
                  value={formData.clientCity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="City"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 w-full col-span-2">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="clientState"
                    value={formData.clientState}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="ST"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    ZIP
                  </label>
                  <input
                    type="text"
                    name="clientZip"
                    value={formData.clientZip}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="clientCountry"
                    value={formData.clientCountry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="India"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Items</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-border rounded-lg space-y-3"
                >
                  {/* Description with Inventory Search */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Item Description *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                        className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter item description or search inventory"
                      />
                      <button
                        type="button"
                        onClick={() => toggleInventorySearch(item.id)}
                        className="px-4 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition font-medium whitespace-nowrap"
                      >
                        {showInventorySearch[item.id]
                          ? "Close"
                          : "Browse Inventory"}
                      </button>
                    </div>

                    {/* Inventory Search Dropdown */}
                    {showInventorySearch[item.id] && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-primary/20 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                        <div className="p-3 border-b border-border sticky top-0 bg-surface">
                          <input
                            type="text"
                            placeholder="Search inventory..."
                            value={inventorySearchTerm[item.id] || ""}
                            onChange={(e) =>
                              setInventorySearchTerm({
                                ...inventorySearchTerm,
                                [item.id]: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="p-2">
                          {getFilteredInventory(item.id).length === 0 ? (
                            <p className="text-center text-text-secondary py-4 text-sm">
                              No items found
                            </p>
                          ) : (
                            getFilteredInventory(item.id).map((invItem,i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() =>
                                  selectInventoryItem(item._id, invItem)
                                }
                                className="w-full text-left p-3 hover:bg-primary/5 rounded-lg transition"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-text-primary">
                                      {invItem.name}
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                      SKU: {invItem.sku} • Stock:{" "}
                                      {invItem.stock} {invItem.unit}
                                    </p>
                                  </div>
                                  <span className="font-bold text-primary">
                                    ${invItem.price.toFixed(2)}
                                  </span>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quantity and Rate */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(item._id, "quantity", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Rate ($) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(item.id, "rate", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Amount
                      </label>
                      <div className="w-full px-4 py-3 border border-border rounded-lg bg-gray-50 font-bold text-primary text-lg">
                        ${item.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  {items.length > 1 && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="px-4 py-2 text-error hover:bg-error/10 rounded-lg transition flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Item
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              type="button"
              className="mt-4 w-full px-4 py-3 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-primary/5 transition flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Another Item
            </button>
          </div>

          {/* Additional Information */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Additional Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Thank you for your business..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Terms & Conditions (Optional)
                </label>
                <textarea
                  name="terms"
                  rows="3"
                  value={formData.terms}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Payment terms, late fees, etc..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Summary
            </h2>

            <div className="space-y-4">
              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Discount
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="discount"
                    min="0"
                    step="0.01"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                  />
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="fixed">$</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
              </div>

              {/* Tax */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  name="taxRate"
                  min="0"
                  step="0.01"
                  value={formData.taxRate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>

              {/* Shipping */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Shipping ($)
                </label>
                <input
                  type="number"
                  name="shipping"
                  min="0"
                  step="0.01"
                  value={formData.shipping}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                />
              </div>

              {/* Calculations */}
              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal:</span>
                  <span className="font-medium text-text-primary">
                    ${calculateSubtotal().toFixed(2)}
                  </span>
                </div>

                {formData.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">
                      Discount{" "}
                      {formData.discountType === "percentage"
                        ? `(${formData.discount}%)`
                        : ""}
                      :
                    </span>
                    <span className="font-medium text-success">
                      -${calculateDiscount().toFixed(2)}
                    </span>
                  </div>
                )}

                {formData.taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">
                      Tax ({formData.taxRate}%):
                    </span>
                    <span className="font-medium text-text-primary">
                      ${calculateTax().toFixed(2)}
                    </span>
                  </div>
                )}

                {formData.shipping > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Shipping:</span>
                    <span className="font-medium text-text-primary">
                      ${parseFloat(formData.shipping).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-border flex justify-between">
                  <span className="font-semibold text-text-primary text-lg">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-text-secondary mb-2">
                <strong className="text-text-primary">Invoice #:</strong>{" "}
                {formData.invoiceNumber || "Not set"}
              </p>
              <p className="text-sm text-text-secondary mb-2">
                <strong className="text-text-primary">Due:</strong>{" "}
                {formData.dueDate
                  ? new Date(formData.dueDate).toLocaleDateString()
                  : "Not set"}
              </p>
              <p className="text-sm text-text-secondary">
                <strong className="text-text-primary">Client:</strong>{" "}
                {formData.clientName || "Not selected"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-text-primary">
                Invoice Preview
              </h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Preview content similar to invoice details modal */}
              <div className="flex justify-between items-start pb-6 border-b border-border">
                <div>
                  <h3 className="text-3xl font-bold text-text-primary mb-2">
                    {formData.invoiceNumber}
                  </h3>
                  <p className="text-text-secondary">
                    Issue Date:{" "}
                    {new Date(formData.issueDate).toLocaleDateString()}
                  </p>
                  <p className="text-text-secondary">
                    Due Date:{" "}
                    {formData.dueDate
                      ? new Date(formData.dueDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-text-secondary text-sm mb-1">
                    Total Amount
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    ${calculateTotal().toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-text-primary mb-3">
                    Bill To
                  </h4>
                  <p className="font-medium text-text-primary">
                    {formData.clientName || "Client Name"}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {formData.clientEmail || "client@example.com"}
                  </p>
                  {formData.clientAddress && (
                    <p className="text-sm text-text-secondary mt-2">
                      {formData.clientAddress}
                      {formData.clientCity && `, ${formData.clientCity}`}
                      {formData.clientState && `, ${formData.clientState}`}
                      {formData.clientZip && ` ${formData.clientZip}`}
                    </p>
                  )}
                </div>
              </div>

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
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-text-primary">
                            {item.description || "Item description"}
                          </td>
                          <td className="px-4 py-3 text-center text-text-secondary">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right text-text-secondary">
                            ${parseFloat(item.rate).toFixed(2)}
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

              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal:</span>
                    <span className="font-medium">
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  {formData.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        Discount{" "}
                        {formData.discountType === "percentage"
                          ? `(${formData.discount}%)`
                          : ""}
                        :
                      </span>
                      <span className="font-medium text-success">
                        -${calculateDiscount().toFixed(2)}
                      </span>
                    </div>
                  )}
                  {formData.taxRate > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        Tax ({formData.taxRate}%):
                      </span>
                      <span className="font-medium">
                        ${calculateTax().toFixed(2)}
                      </span>
                    </div>
                  )}
                  {formData.shipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Shipping:</span>
                      <span className="font-medium">
                        ${parseFloat(formData.shipping).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-semibold text-text-primary">
                      Total:
                    </span>
                    <span className="text-xl font-bold text-primary">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {formData.notes && (
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">
                    Notes
                  </h4>
                  <p className="text-sm text-text-secondary bg-gray-50 p-3 rounded-lg">
                    {formData.notes}
                  </p>
                </div>
              )}

              {formData.terms && (
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">
                    Terms & Conditions
                  </h4>
                  <p className="text-sm text-text-secondary bg-gray-50 p-3 rounded-lg">
                    {formData.terms}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    handleSendInvoice();
                  }}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateInvoice;
