import Activity from "../models/activities.model.js";
import Company from "../models/company.model.js";
import InventoryItem from "../models/inventory.model.js";

/**
 * @desc    Add a new inventory item

 */
export const addInventoryItem = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { name, sku, quantity, unit, price, category, minStock } = req.body;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }
    // Basic validation
    if (!name || !sku || !unit || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Check for duplicate SKU
    const existingItem = await InventoryItem.findOne({ sku });
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "An item with this SKU already exists",
      });
    }

    // Create new item
    const newItem = await InventoryItem.create({
      companyId,
      name,
      sku,
      quantity,
      unit,
      price,
      category,
      minStock,
    });
     const activity=await Activity.create({
      companyId,
      action:`Added new item`,
      description:`${newItem.name}`
    })
    res.status(201).json({
      success: true,
      message: "Inventory item added successfully",
      data: newItem,
    });
  } catch (error) {
    console.error("Error adding inventory item:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding item",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all inventory items

 */
export const getAllInventoryItems = async (req, res) => {
  try {
    const {companyId}=req.params

    if(!companyId){
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const items = await InventoryItem.find({companyId}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching items",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single inventory item by ID

 */
export const getInventoryItemById = async (req, res) => {
  try {
    const {companyId}=req.params

    if(!companyId){
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }
    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching item",
      error: error.message,
    });
  }
};

/**
   Update an inventory item

 */
export const updateInventoryItem = async (req, res) => {
  try {
    const {companyId,id}=req.params


    if(!companyId){
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }
    if(!id){
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }
    const updatedItem = await InventoryItem.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
 const activity=await Activity.create({
      companyId,
      action:`Updated Item`,
      description:`${updatedItem.name}`
    })
    res.status(200).json({
      success: true,
      message: "Inventory item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating item",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete an inventory item

 */
export const deleteInventoryItem = async (req, res) => {
  try {
    const {companyId}=req.params

    if(!companyId){
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }
    const deletedItem = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
     const activity=await Activity.create({
      companyId,
      action:`Deleted Item`,
      description:` ${deletedItem.name}`
    })

    res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting item",
      error: error.message,
    });
  }
};


export const addInventoryItems=async(req,res)=>{
  try {
    console.log(req.body);
    
    const {companyId}=req.params
    if(!companyId){
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }
    const items=req.body;
    console.log(items);
    
    if(!items || !Array.isArray(items) || items.length===0){
      return res.status(400).json({
        success: false,
        message: "Items array is required",
      });
    }
    const createdItems=[];
    for(const item of items){
      const { name, sku, quantity, unit, price, category, minStock } = item;
      if (!name || !sku || !unit || !price || !category) {
        return res.status(400).json({
          success: false,
          message: "Required fields are missing in one of the items",
        });
      }

      // Check for duplicate SKU
      const existingItem = await InventoryItem.findOne({ sku });
      if (existingItem) {
        return res.status(400).json({
          success: false,
          message: `An item with SKU ${sku} already exists`,
        });
      }
      const newItem = await InventoryItem.create({
        companyId,
        name,
        sku,
        quantity,
        unit,
        price,
        category,
        minStock,
      });
      createdItems.push(newItem);
    }

     const activity=await Activity.create({
      companyId,
      context:`Imported Inventory Items`,
    })
    res.status(201).json({
      success: true,
      message: "Inventory items added successfully",
      data: createdItems,
    });


  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while adding items",
      error: error,
    });
  }
}