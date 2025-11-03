import React, { useContext, useState } from "react";
import {
  Building2,
  FileText,
  Palette,
  Check,
  ChevronRight,
  Upload,
  X,
} from "lucide-react";
import { axiosInstance } from "../utils/axiosInstance";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App";

const Startup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useContext(UserContext);
  console.log(user);
  const [message, setMessage] = useState({ type: "", text: "" }); // 'success', 'error', or ''
  const [formData, setFormData] = useState({
    // Company Details
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    taxId: "",
    website: "",
    logo: null,

    // Invoice Preferences
    invoicePrefix: "INV",
    startingNumber: "1001",
    currency: "INR",
    taxRate: "",
    paymentTerms: "30",

    // Template Selection
    templateStyle: "modern",
    primaryColor: "#059669",

    // Additional Info
    industry: "",
    companySize: "",
  });

  const [logoPreview, setLogoPreview] = useState(null);

  const steps = [
    { number: 1, title: "Company Details", icon: Building2 },
    { number: 2, title: "Invoice Settings", icon: FileText },
    { number: 3, title: "Template Design", icon: Palette },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting startup data:", formData);
    try {
      const sendingObj = { ...formData, userId: user.id };
      console.log(sendingObj);

      const response = await axiosInstance.post(
        "/company/add-details",
        sendingObj
      );
      console.log("Company details submitted successfully:", response.data);
      setMessage({
        type: "success",
        text: response.data.message || "Company details submitted successfully!",
      });
    } catch (error) {
      console.log(error);
      setMessage({
        type: "error",
        text: error.message || "Submission failed. Please try again.",
      });
    }
  };

  const templates = [
    {
      id: "modern",
      name: "Modern",
      description: "Clean and minimalist design",
    },
    {
      id: "professional",
      name: "Professional",
      description: "Traditional business style",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Bold and colorful layout",
    },
    { id: "classic", name: "Classic", description: "Timeless elegant design" },
  ];

  const colorOptions = [
    { value: "#059669", name: "Emerald" },
    { value: "#2563eb", name: "Blue" },
    { value: "#dc2626", name: "Red" },
    { value: "#7c3aed", name: "Purple" },
    { value: "#ea580c", name: "Orange" },
    { value: "#0891b2", name: "Cyan" },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2">
            Welcome! Let's Set Up Your Account
          </h1>
          <p className="text-text-secondary">
            This will only take a few minutes to get you started
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition ${
                      currentStep >= step.number
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium text-center ${
                      currentStep >= step.number
                        ? "text-primary"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition ${
                      currentStep > step.number ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-surface rounded-2xl shadow-xl border border-border p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Company Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Company Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="RW Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Company Email *
                    </label>
                    <input
                      type="email"
                      name="companyEmail"
                      required
                      value={formData.companyEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="contact@rw.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="companyPhone"
                      value={formData.companyPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+91 99431 84934"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="www.rw.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="companyAddress"
                    required
                    value={formData.companyAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="3/20, Kombakkadu Pudhur"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
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
                      placeholder="Tiruppur"
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
                      placeholder="TN"
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
                      placeholder="641 668"
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
                      placeholder="India    "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Tax ID/GST Number
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="XX-XXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Industry
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Industry</option>
                      <option value="technology">Technology</option>
                      <option value="consulting">Consulting</option>
                      <option value="retail">Retail</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Invoice Settings */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Invoice Preferences
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Invoice Prefix *
                    </label>
                    <input
                      type="text"
                      name="invoicePrefix"
                      required
                      value={formData.invoicePrefix}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="INV"
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Example: {formData.invoicePrefix}-
                      {formData.startingNumber}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Starting Invoice Number *
                    </label>
                    <input
                      type="number"
                      name="startingNumber"
                      required
                      value={formData.startingNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="1001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Default Currency *
                    </label>
                    <select
                      name="currency"
                      required
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Default Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      name="taxRate"
                      step="0.01"
                      value={formData.taxRate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Default Payment Terms (Days) *
                    </label>
                    <select
                      name="paymentTerms"
                      required
                      value={formData.paymentTerms}
                      onChange={handleChange}
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

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Company Size
                    </label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201+">201+ employees</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Template Design */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Choose Your Invoice Design
                </h2>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-4">
                    Template Style *
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                      <label
                        key={template.id}
                        className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition ${
                          formData.templateStyle === template.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="templateStyle"
                          value={template.id}
                          checked={formData.templateStyle === template.id}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-text-primary">
                            {template.name}
                          </span>
                          {formData.templateStyle === template.id && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-text-secondary">
                          {template.description}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-4">
                    Primary Brand Color *
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {colorOptions.map((color) => (
                      <label
                        key={color.value}
                        className="relative cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="primaryColor"
                          value={color.value}
                          checked={formData.primaryColor === color.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div
                          className={`w-full h-16 rounded-lg border-4 transition ${
                            formData.primaryColor === color.value
                              ? "border-gray-800 scale-105"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color.value }}
                        >
                          {formData.primaryColor === color.value && (
                            <div className="flex items-center justify-center h-full">
                              <Check className="w-6 h-6 text-white drop-shadow" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-center mt-1 text-text-secondary">
                          {color.name}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-text-primary">
                    <span className="font-semibold">💡 Tip:</span> You can
                    always customize your invoice design later from the
                    settings.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  currentStep === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Back
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition shadow-lg"
                >
                  Complete Setup
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button className="text-sm text-text-secondary hover:text-primary transition">
            Skip for now, I'll set this up later
          </button>
        </div>
      </div>
    </div>
  );
};

export default Startup;
