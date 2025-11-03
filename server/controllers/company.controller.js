import Company from "../models/company.model.js";
import multer from "multer";
import User from "../models/user.model.js";
import Activity from "../models/activities.model.js";
// @desc    Add new company details
// @route   POST /api/company
// @access  Public or Private (depending on your auth setup)
export const addCompanyDetails = async (req, res) => {
  try {
    const {
        userId,
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      city,
      state,
      zipCode,
      country,
      taxId,
      website,
      invoicePrefix,
      startingNumber,
      currency,
      taxRate,
      paymentTerms,
      templateStyle,
      primaryColor,
      industry,
      companySize,
    } = req.body;

    // ✅ Basic validation (extra layer besides Mongoose)
    if (!companyName || !companyEmail || !companyPhone || !companyAddress) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing" });
    }

    // ✅ Check for duplicate email (optional)
    const isUser=await User.findById(userId);
    if(!isUser){
        return res.status(404).json({success:false,message:"User not found"})
    }

    // ✅ Create new company record
    const newCompany = await Company.create({
        userId,
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      city,
      state,
      zipCode,
      country,
      taxId,
      website,
      invoicePrefix,
      startingNumber,
      currency,
      taxRate,
      paymentTerms,
      templateStyle,
      primaryColor,
      industry,
      companySize,
    });

    // ✅ Send success response
    res.status(201).json({
      success: true,
      message: "Company details added successfully",
      data: newCompany,
    });
  } catch (error) {
    console.error("Error adding company details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding company details",
      error: error.message,
    });
  }
};

export const updateCompanyDetails = async (req, res) => {
  try {
    const { companyId } = req.params;
    const {
      userId,
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      city,
      state,
      zipCode,
      country,
      taxId,
      website,
      invoicePrefix,
      startingNumber,
      currency,
      taxRate,
      paymentTerms,
      templateStyle,
      primaryColor,
      industry,
      companySize,
    } = req.body;

    // ✅ Validate if user exists
    const isUser = await User.findById(userId);
    if (!isUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Validate if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    // ✅ Optional: Check if company belongs to the user (if user linking is required)
    if (company.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to update this company" });
    }

    // ✅ Update company details
    company.companyName = companyName || company.companyName;
    company.companyEmail = companyEmail || company.companyEmail;
    company.companyPhone = companyPhone || company.companyPhone;
    company.companyAddress = companyAddress || company.companyAddress;
    company.city = city || company.city;
    company.state = state || company.state;
    company.zipCode = zipCode || company.zipCode;
    company.country = country || company.country;
    company.taxId = taxId || company.taxId;
    company.website = website || company.website;
    company.invoicePrefix = invoicePrefix || company.invoicePrefix;
    company.startingNumber = startingNumber || company.startingNumber;
    company.currency = currency || company.currency;
    company.taxRate = taxRate || company.taxRate;
    company.paymentTerms = paymentTerms || company.paymentTerms;
    company.templateStyle = templateStyle || company.templateStyle;
    company.primaryColor = primaryColor || company.primaryColor;
    company.industry = industry || company.industry;
    company.companySize = companySize || company.companySize;

    // ✅ Save updated document
    const updatedCompany = await company.save();
     const activity=await Activity.create({
      companyId,
      action:`Updated Company Details`,
      description:`${company.companyName}`

    })
    // ✅ Send success response
    res.status(200).json({
      success: true,
      message: "Company details updated successfully",
      data: updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating company details",
      error: error.message,
    });
  }
};

export const getCompanyDetails=async(req,res)=>{
  try {
    const {userId}=req.params
    const company=await Company.findOne({userId:userId})
    if(!company){
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: company,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching company details",
      error: error.message,
    });
  }
}