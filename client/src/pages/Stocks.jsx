import React, { useContext, useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Package, AlertCircle, X, RefreshCcw, Import } from 'lucide-react';
import { axiosInstance } from '../utils/axiosInstance';
import { CompanyContext } from '../App';
import * as XLSX from 'xlsx'


const Stocks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: '',
    unit: 'pcs',
    price: '',
    category: '',
    minStock: ''
  });
  const [bulkData,setBulkData]=useState([])
  const [company,setCompany]=useContext(CompanyContext)
  // Sample inventory data - Replace with API data
  const [inventory, setInventory] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        category: item.category,
        minStock: item.minStock
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        sku: '',
        quantity: '',
        unit: 'pcs',
        price: '',
        category: '',
        minStock: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      name: '',
      sku: '',
      quantity: '',
      unit: 'pcs',
      price: '',
      category: '',
      minStock: ''
    });
  };
 const getAllInventory=async()=>{
    try {
      const resp=await axiosInstance.get(`/inventory/${company._id}`)
      setInventory(resp.data.data)
    } catch (error) {
      console.log(error);
      
    }
  }
  const handleSubmit =async (e) => {
    e.preventDefault();
    
    if (editingItem) {
      try {
        const updatingItem={
          ...formData,
          quantity: parseInt(formData.quantity),
          price: parseFloat(formData.price),
          minStock: parseInt(formData.minStock)
        }
        const resp=await axiosInstance.put(`/inventory/${company._id}/${editingItem._id}`,updatingItem);
        getAllInventory();
      } catch (error) {
        
      }
     
    } else {
      // Add new item
      const newItem = {
        
        ...formData,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        minStock: parseInt(formData.minStock)

      };
      
      try {
        const resp=await axiosInstance.post(`/inventory/${company._id}`,newItem);
        console.log(resp.data);
        getAllInventory()
      } catch (error) {
        console.log(error);
        
      }
    }
    
    closeModal();
  };
 
  const handleDelete = async(id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const resp=await axiosInstance.delete(`/inventory/${company._id}/${id}`);
        getAllInventory()
      } catch (error) {
        console.log(error);
        
      }
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLowStockCount = () => {
    return inventory.filter(item => item.quantity <= item.minStock).length;
  };

  const getTotalValue = () => {
    return inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2);
  };
const importFile = async(e) => {
    const file = e.target.files[0];
    if (!file) return;
    let sendingData=[];
    const reader = new FileReader();
    reader.onload = async(event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(sheet);
       const jsonData = rawData.map((row) => {
        const newRow = {};
        Object.keys(row).forEach((key) => {
          newRow[key.toLowerCase()] = row[key];
        });
        return newRow;
      });
      setBulkData(jsonData);
      try {
      const resp=await axiosInstance.post(`/inventory/bulk/${company._id}`,jsonData);
      getAllInventory()
    } catch (error) {
     console.log(error);
      
    }
    };
    reader.readAsBinaryString(file);
    
    
  };

  useEffect(()=>{
    getAllInventory()
  },[])
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Inventory Management</h1>
        <p className="text-text-secondary">Manage your stock and track inventory levels</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Items</p>
              <p className="text-2xl font-bold text-text-primary">{inventory.length}</p>
            </div>
            <Package className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="bg-surface p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold text-error">{getLowStockCount()}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-error" />
          </div>
        </div>

        <div className="bg-surface p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Value</p>
              <p className="text-2xl font-bold text-success">${getTotalValue()}</p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <span className="text-success text-xl font-bold">$</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button onClick={()=>getAllInventory()} className='bg-border text-text-primary p-2 rounded-xl ring ring-primary-dark hover:bg-border/80 cursor-pointer'><RefreshCcw/></button>
        <button
          onClick={() => openModal()}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
        <button
          onClick={() => {window.document.getElementById('import').click()}}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2 font-medium"
        >
          <Import/>
          Import
        </button>
        <input type="file" name="import-file" id="import" className='hidden' onChange={importFile} accept=".xls,.xlsx"/>
      </div>

      {/* Inventory Table */}
      <main className="rounded-xl shadow-md bg-surface border border-primary-light/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary/5 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Item Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Category</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Unit</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-text-primary">Price</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-text-secondary">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No items found</p>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item,i) => (
                  <tr key={i} className="hover:bg-primary/5 transition">
                    <td className="px-6 py-4 text-text-primary font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-text-secondary text-sm">{item.sku}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-text-primary font-semibold">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm">{item.unit}</td>
                    <td className="px-6 py-4 text-right text-text-primary font-medium">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.quantity <= item.minStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-error/10 text-error rounded">
                          <AlertCircle className="w-3 h-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-success/10 text-success rounded">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(item)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-error hover:bg-error/10 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text-primary">
                {editingItem ? 'Edit Item' : 'Add New Item'}
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
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter item name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    required
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., PRD-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Electronics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Unit *
                  </label>
                  <select
                    name="unit"
                    required
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="pcs">Pieces</option>
                    <option value="box">Box</option>
                    <option value="kg">Kilogram</option>
                    <option value="ltr">Liter</option>
                    <option value="mtr">Meter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Price per Unit *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Minimum Stock Level *
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    required
                    min="0"
                    value={formData.minStock}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="10"
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
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stocks;