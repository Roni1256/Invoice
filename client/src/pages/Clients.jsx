import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  Building2,
  Eye,
  X,
  FileText,
  DollarSign,
} from 'lucide-react';
import {axiosInstance} from "../utils/axiosInstance"
import { useContext } from 'react';
import {CompanyContext} from "../App"
import { useEffect } from 'react';
const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    taxId: '',
    notes: '',
  });
  const [company,setCompany]=useContext(CompanyContext)
  // Sample client data - Replace with API data
  const [clients, setClients] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        address: client.address,
        city: client.city,
        state: client.state,
        zipCode: client.zipCode,
        country: client.country,
        taxId: client.taxId,
        notes: client.notes,
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        taxId: '',
        notes: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      taxId: '',
      notes: '',
    });
  };

  const openDetailsModal = (client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedClient(null);
  };
  const getAllClient=async()=>{
    try {
      const resp=await axiosInstance.get(`client/${company._id}`)
      console.log(resp.data);
      setClients(resp.data.clients)
      
    } catch (error) {
      console.log(error);
      
    }
  }
  const handleSubmit = async(e) => {
    e.preventDefault();

    if (editingClient) {
      // Update existing client
      try {
        const resp=await axiosInstance.put(`client/${editingClient._id}`,formData)
        getAllClient()
      } catch (error) {
        console.log(error);
        
      }
    } else {
      // Add new client
      const newClient = {
        id: clients.length + 1,
        ...formData,
        totalInvoices: 0,
        totalAmount: 0,
        outstanding: 0,
      };
      setClients([...clients, newClient]);
      try {
        const resp=await axiosInstance.post(`client/${company._id}`,formData)
        console.log(resp.data);
        
        getAllClient()
      } catch (error) {
        
      }
    }

    closeModal();
  };

  const handleDelete = async(id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        const resp=await axiosInstance.delete(`client/${id}`);
        getAllClient()
      } catch (error) {
        console.log(error);
        
      }
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
  );

  const getTotalClients = () => clients.length;
  const getTotalRevenue = () =>
    clients.reduce((sum, client) => sum + client.totalAmount, 0);
  const getOutstandingAmount = () =>
    clients.reduce((sum, client) => sum + client.outstanding, 0);

  useEffect(()=>{
    getAllClient()
  },[])
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Client Management
        </h1>
        <p className="text-text-secondary">
          Manage your client information and track business relationships
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface p-5 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-text-secondary text-sm font-medium">
              Total Clients
            </p>
            <Users className="w-8 h-8 text-primary" />
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {getTotalClients()}
          </p>
        </div>

        <div className="bg-surface p-5 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-text-secondary text-sm font-medium">
              Total Revenue
            </p>
            <DollarSign className="w-8 h-8 text-success" />
          </div>
          <p className="text-2xl font-bold text-success">
            ${getTotalRevenue().toLocaleString()}
          </p>
        </div>

        <div className="bg-surface p-5 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-text-secondary text-sm font-medium">
              Outstanding
            </p>
            <FileText className="w-8 h-8 text-warning" />
          </div>
          <p className="text-2xl font-bold text-warning">
            ${getOutstandingAmount().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, company, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={() => openModal()}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Client
        </button>
      </div>

      {/* Clients Grid */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length === 0 ? (
          <div className="col-span-full bg-surface rounded-xl shadow-md border border-border p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-text-secondary text-lg">No clients found</p>
          </div>
        ) : (
          filteredClients.map((client,i) => (
            <div
              key={i}
              className="bg-surface rounded-xl shadow-md border border-border hover:shadow-lg transition-all p-6"
            >
              {/* Client Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary text-lg">
                      {client.name}
                    </h3>
                    <p className="text-text-secondary text-sm flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {client.company}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>
                    {client.city}, {client.state}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-xs text-text-secondary">Invoices</p>
                  <p className="font-bold text-text-primary">
                    {client.invoiceId.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-text-secondary">Revenue</p>
                  <p className="font-bold text-success">
                    ${(client.totalAmount / 1000).toFixed(0)}k
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-text-secondary">Due</p>
                  <p className="font-bold text-warning">
                    ${(client.outstanding / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openDetailsModal(client)}
                  className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => openModal(client)}
                  className="px-3 py-2 border border-border rounded-lg hover:bg-gray-50 transition"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-primary" />
                </button>
                <button
                  onClick={() => handleDelete(client._id)}
                  className="px-3 py-2 border border-border rounded-lg hover:bg-error/5 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-error" />
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text-primary">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Acme Inc."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="123 Business Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    ZIP/Postal Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="USA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="TX-12345"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Additional notes about this client..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
                >
                  {editingClient ? 'Update Client' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Details Modal */}
      {showDetailsModal && selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text-primary">
                Client Details
              </h2>
              <button
                onClick={closeDetailsModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-2xl">
                    {selectedClient.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">
                    {selectedClient.name}
                  </h3>
                  <p className="text-text-secondary flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {selectedClient.company}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-text-primary mb-3">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="text-text-secondary">
                      {selectedClient.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-text-secondary">
                      {selectedClient.phone}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-text-secondary">
                      {selectedClient.address}, {selectedClient.city},{' '}
                      {selectedClient.state} {selectedClient.zipCode},{' '}
                      {selectedClient.country}
                    </span>
                  </div>
                </div>
              </div>

              {/* Business Stats */}
              <div>
                <h4 className="font-semibold text-text-primary mb-3">
                  Business Overview
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-primary/5 p-4 rounded-lg text-center">
                    <p className="text-sm text-text-secondary mb-1">
                      Total Invoices
                    </p>
                    <p className="text-2xl font-bold text-text-primary">
                      {selectedClient.invoiceId.length}
                    </p>
                  </div>
                  <div className="bg-success/5 p-4 rounded-lg text-center">
                    <p className="text-sm text-text-secondary mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-success">
                      ${selectedClient?.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-warning/5 p-4 rounded-lg text-center">
                    <p className="text-sm text-text-secondary mb-1">
                      Outstanding
                    </p>
                    <p className="text-2xl font-bold text-warning">
                      ${selectedClient?.outstanding?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedClient.taxId && (
                <div>
                  <h4 className="font-semibold text-text-primary mb-3">
                    Tax Information
                  </h4>
                  <p className="text-text-secondary">
                    Tax ID: {selectedClient.taxId}
                  </p>
                </div>
              )}

              {selectedClient.notes && (
                <div>
                  <h4 className="font-semibold text-text-primary mb-3">
                    Notes
                  </h4>
                  <p className="text-text-secondary bg-gray-50 p-4 rounded-lg">
                    {selectedClient.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => {
                    closeDetailsModal();
                    openModal(selectedClient);
                  }}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
                >
                  Edit Client
                </button>
                <button
                  onClick={closeDetailsModal}
                  className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;